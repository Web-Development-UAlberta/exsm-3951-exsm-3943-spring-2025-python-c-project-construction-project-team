// components/components/QuoteEstimateModal.tsx
import React, { useState, useEffect, useRef } from 'react';
import { Modal } from 'react-bootstrap';
import { Button } from '../../../../components/ButtonComponent/Button';
import { useMsal } from '@azure/msal-react';
import { useCreateProjectService } from '../../../../api/projects/children/projectService';
import { useCreateProject } from '../../../../api/projects/useProjectOutput';
import { ProjectServiceCreateDTO } from '../../../../api/projects/project.types';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { fetchRFQById } from '../../../../api/rfq/rfqQueries';
import { useUpdateRFQ } from '../../../../api/rfq/rfq';
import { generateAndDownloadPDF } from '../../../../utils/generatePDF';

interface QuoteEstimateModalProps {
    show: boolean;
    rfqId: number | null;
    onClose: () => void;
    onQuoteSent: () => void;
}

interface ServiceLine {
    name: string;
    description: string;
    projectServiceTypeId?: number;
    quotePrice: number;
    quoteCost: number;
    quoteStartDate: string;
    quoteEndDate: string;
}

export const QuoteEstimateModal: React.FC<QuoteEstimateModalProps> = ({
    show,
    rfqId,
    onClose,
    onQuoteSent
}) => {
    const { instance } = useMsal();
    const updateRFQ = useUpdateRFQ(instance);
    const quoteRef = useRef<HTMLDivElement>(null);


    const [services, setServices] = useState<ServiceLine[]>([]);
    const [quoteNumber, setQuoteNumber] = useState('');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [subtotal, setSubtotal] = useState(0);
    const [tax, setTax] = useState(0);
    const [total, setTotal] = useState(0);

    const createProject = useCreateProject(instance);
    const createService = useCreateProjectService(BigInt(rfqId || 0), instance);

    const formatDateWithoutTimezone = (dateString: string) => {
        const date = new Date(dateString);
        return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}T00:00:00`;
    }

    const queryClient = useQueryClient();
    const { data: rfqData } = useQuery({
        queryKey: ['rfq', rfqId],
        queryFn: () => rfqId ? fetchRFQById(BigInt(rfqId), instance) : null,
        enabled: !!rfqId
    });

    useEffect(() => {
        // Calculate totals whenever services change
        const newSubtotal = services.reduce((sum, service) => sum + service.quotePrice, 0);
        const newTax = newSubtotal * 0.05; // 5% tax
        setSubtotal(newSubtotal);
        setTax(newTax);
        setTotal(newSubtotal + newTax);
    }, [services]);
    
    const addItem = () => {
        setServices([
            ...services,
            {
                name: '',
                description: '',
                quotePrice: 0,
                quoteCost: 0,
                quoteStartDate: startDate,
                quoteEndDate: endDate
            }
        ]);
    };

    const updateItem = (index: number, field: keyof ServiceLine, value: any) => {
        const updatedServices = [...services];
        updatedServices[index] = {
            ...updatedServices[index],
            [field]: value
        };
        setServices(updatedServices);
    };

    const removeItem = (index: number) => {
        setServices(services.filter((item => item !== services[index])));
    };

    const handleSubmit = async () => {
        try {
            if (!rfqData?.clientId) {
                throw new Error('No client ID available from RFQ');
            }

            // Generate and download the PDF
            if (quoteRef.current) {
                const success = await generateAndDownloadPDF(quoteRef.current, `Quote_${quoteNumber || Date.now()}.pdf`);

                if (!success) {
                    throw new Error('Failed to generate PDF');
                }

                // Prepare email content
                const emailContent = {
                    to: 'buniel@ualberta.ca', // Replace with actual email if we have access to entra
                    subject: `Quote Estimate - ${quoteNumber}`,
                    body: `Dear Client,\n\nPlease find attached the quote estimate.\n\nBest regards,\nBob & Susan Renovations`,
                };

                // Open email client
                window.location.href = `mailto:${emailContent.to}?subject=${encodeURIComponent(emailContent.subject)}&body=${encodeURIComponent(emailContent.body)}`;
            }

            // update RFQ status to "Quoted"
            // await updateRFQ.mutateAsync({
            //     rfqid: BigInt(rfqId ?? 0),
            //     rfq: {
            //         status: 'Quoted'
            //     }
            // });
            
            // Create Project
            const projectData = {
                status: 'Quote Complete',
                rfqId: rfqId || undefined,
                clientId: rfqData.clientId
            };

            const createdProject = await createProject.mutateAsync(projectData);

            if (createdProject?.id) {
                const servicePromises = services.map(service => {
                const serviceDTO: ProjectServiceCreateDTO = {
                    name: service.name,
                    description: service.description,
                    projectServiceTypeId: service.projectServiceTypeId,
                    quotePrice: service.quotePrice,
                    quoteCost: service.quoteCost,
                    quoteStartDate: formatDateWithoutTimezone(startDate),
                    quoteEndDate: formatDateWithoutTimezone(endDate),
                    status: 'Quoted',
                };
                console.log('Creating service for project:', createdProject.id);
                console.log('Creating service with DTO:', serviceDTO);
                return createService.mutateAsync(serviceDTO);
            });

            await Promise.all(servicePromises);

            try {
            await updateRFQ.mutateAsync({
                rfqId: BigInt(rfqId ?? 0),
                rfq: {
                    status: 'Quoted'
                }
            });

            // Update cache only after successful RFQ update
            queryClient.setQueryData(['rfqs'], (oldData: any) => {
                if (!oldData) return oldData;
                return oldData.filter((request: any) => request.id !== rfqId);
            });
        } catch (rfqError) {
            console.error('Error updating RFQ status:', rfqError);
            // Project is created but RFQ update failed
            // You might want to show a warning to the user
        }
            onQuoteSent();
            onClose();
            } else {
                throw new Error('Project creation failed: No ID returned');
            }
        } catch (error) {
            console.error('Error creating project or services:', error);
            console.error('Error generating PDF:', error);
        }
    };

    return (
    <Modal show={show} onHide={onClose} size="lg">
        <Modal.Header closeButton>
            <Modal.Title>Quote Estimate</Modal.Title>
        </Modal.Header>
        <Modal.Body>
            <div className="container" ref={quoteRef}>
                <div className="row mb-4">
                    <div className="col-md-6">
                        <div className="fw-bold">Bob & Susan Renovations</div>
                        <div>1234 Renovation St.</div>
                        <div>Renovation City, AB</div>
                    </div>
                    <div className="col-md-6 text-md-end">
                        <h2 className="mb-4">RENOVATION QUOTE</h2>
                    </div>
                </div>
                <div className="quote-details mb-4">
                    <div className="row">
                        <div className="col-md-6">
                            <div className="mb-2 fw-bold">Bill To</div>
                            <div>John Doe</div>
                            <div>5678 Client St.</div>
                            <div>Client City, AB</div>
                        </div>
                        <div className="col-6">
                            <div className="mb-3">
                                <div className="row mb-3">
                                    <label className="col-sm-4 col-form-label">Quote Number</label>
                                    <div className="col-sm-8">
                                        <input
                                            type="text"
                                            className="form-control"
                                            value={quoteNumber}
                                            onChange={(e) => setQuoteNumber(e.target.value)}
                                        />
                                    </div>
                                </div>
                                <div className="row mb-3">
                                    <label className="col-sm-4 col-form-label">Issue Date</label>
                                    <div className="col-sm-8">
                                        <input
                                            type="date"
                                            className="form-control"
                                            value={startDate}
                                            onChange={(e) => setStartDate(e.target.value)}
                                        />
                                    </div>
                                </div>
                                <div className="row mb-3">
                                    <label className="col-sm-4 col-form-label">Valid Until</label>
                                    <div className="col-sm-8">
                                        <input
                                            type="date"
                                            className="form-control"
                                            value={endDate}
                                            onChange={(e) => setEndDate(e.target.value)}
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Quote Items Table */}
                <div className="quote-items mb-4">
                    <table className="table">
                        <thead>
                            <tr>
                                <th>Item</th>
                                <th>Description</th>
                                <th>Price</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {services.map((service, index) => (
                                <tr key={index}>
                                    <td>
                                        <input
                                            type="text"
                                            className="form-control"
                                            value={service.name}
                                            onChange={(e) => updateItem(index, 'name', e.target.value)}
                                        />
                                    </td>
                                    <td>
                                        <input
                                            type="text"
                                            className="form-control"
                                            value={service.description}
                                            onChange={(e) => updateItem(index, 'description', e.target.value)}
                                        />
                                    </td>
                                    <td>
                                        <div className="input-group">
                                            <span className="input-group-text">$</span>
                                            <input
                                                type="text"
                                                className="form-control"
                                                value={service.quotePrice}
                                                onChange={(e) => updateItem(index, 'quotePrice', Number(e.target.value))}
                                            />
                                        </div>
                                    </td>
                                    <td>
                                        <Button
                                            variant='danger'
                                            size="small"
                                            onClick={() => removeItem(index)}
                                            iconOnly={true}>
                                            <i className="bi bi-trash"></i>
                                        </Button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    <Button variant="primary" className="outline" onClick={addItem} label="Add Item"/>
                </div>

                {/* Quote Summary */}
                <div className="quote-summary">
                    <div className="row justify-content-end">
                        <div className="col-4">
                            <div className="d-flex justify-content-between mb-2">
                                <span>Subtotal:</span>
                                <span>${subtotal.toFixed(2)}</span>
                            </div>
                            <div className="d-flex justify-content-between mb-2">
                                <span>Tax (5%):</span>
                                <span>${tax.toFixed(2)}</span>
                            </div>
                            <div className="d-flex justify-content-between fw-bold">
                                <span>Total:</span>
                                <span>${total.toFixed(2)}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
    </Modal.Body>
    <Modal.Footer>
      <Button variant="secondary" onClick={onClose} label="Close"/>
      <Button 
        variant="primary" 
        onClick={handleSubmit}
        disabled={services.length === 0}
        label="Generate and Send"
      />
    </Modal.Footer>
  </Modal>
    );
};

export default QuoteEstimateModal;