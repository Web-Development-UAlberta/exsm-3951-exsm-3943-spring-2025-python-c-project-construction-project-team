// components/components/QuoteEstimateModal.tsx
import React, { useState, useEffect, useRef } from 'react';
import { Modal } from 'react-bootstrap';
import { Button } from '../../../../components/ButtonComponent/Button';
import { useMsal } from '@azure/msal-react';
import { useCreateProjectService } from '../../../../api/projects/children/projectService';
import { useCreateProject } from '../../../../api/projects/useProjectOutput';
import { useUpdateRFQ, getRFQById } from '../../../../api/rfq/rfq';
import { RFQStatus } from '../../../../api/rfq/rfq.types';
import { generateAndDownloadPDF } from '../../../../utils/generatePDF';

interface QuoteEstimateModalProps {
    show: boolean;
    rfqId: string | number | null;
    assignedEmployeeId?: string;
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
    assignedEmployeeId,
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
    const createService = useCreateProjectService(rfqId ? BigInt(rfqId) : BigInt(0),
    instance
);

    const { data: rfqData } = getRFQById(
        rfqId ? BigInt(rfqId) : BigInt(0),
        instance
    );

    const resetForm = () => {
        setServices([]);
        setQuoteNumber('');
        setStartDate('');
        setEndDate('');
        setSubtotal(0);
        setTax(0);
        setTotal(0);
    };

    useEffect(() => {
        if (show) {
            resetForm();
        }
    }, [show]);

    useEffect(() => {
        // Calculate totals whenever services change
        const newSubtotal = services.reduce((sum, service) => sum + service.quotePrice, 0);
        const newTax = newSubtotal * 0.05; // 5% tax
        setSubtotal(newSubtotal);
        setTax(newTax);
        setTotal(newSubtotal + newTax);
    }, [services]);
    
    const addItem = () => {
        const today = new Date().toISOString().split('T')[0];
        setServices([
            ...services,
            {
                name: '',
                description: '',
                quotePrice: 0,
                quoteCost: 0,
                quoteStartDate: startDate || today,
                quoteEndDate: endDate || today,
                projectServiceTypeId: undefined
            }
        ]);
    };

    const updateItem = (index: number, field: keyof ServiceLine, value: any) => {
        const updatedServices = [...services];
        updatedServices[index] = {
            ...updatedServices[index],
            [field]: field === 'quotePrice' || field === 'quoteCost' ? 
                Number(value) || 0 : value
        };
        setServices(updatedServices);
    };

    const removeItem = (index: number) => {
        setServices(services.filter((item => item !== services[index])));
    };

    // TODO: Reset form after submission
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
                    to: '', 
                    subject: `Quote Estimate - ${quoteNumber}`,
                    body: `Dear Client,\n\nPlease find attached the quote estimate.\n\nBest regards,\nBob & Susan Renovations`,
                };

                // Open email client
                window.location.href = `mailto:${emailContent.to}?subject=${encodeURIComponent(emailContent.subject)}&body=${encodeURIComponent(emailContent.body)}`;
            }

            // Create Project
            const projectData = {
                renovationType: rfqData?.renovationType || 'Unknown',
                status: 'Quote Complete',
                rfqId: rfqId ? Number(rfqId) : undefined,
                createdByEmployee: assignedEmployeeId,
                clientId: rfqData.clientId,
                quoteNumber: quoteNumber,
                quoteStartDate: `${startDate}T00:00:00`,
                quoteEndDate: `${endDate}T00:00:00`,
                quoteCost: services.reduce((sum, service) => sum + service.quoteCost, 0),
                quotePrice: total
            };

            const createdProject = await createProject.mutateAsync(projectData);
            if (!createdProject?.id) {
                throw new Error('Project creation failed: No ID returned');
            }

            const servicePromises = services.map(service => {
                const serviceDTO = {
                    projectId: Number(createdProject.id),
                    name: service.name || '',
                    description: service.description || '',
                    projectServiceTypeId: service.projectServiceTypeId ? Number(service.projectServiceTypeId) : undefined,
                    quoteStartDate: `${service.quoteStartDate}T00:00:00`,
                    quoteEndDate: `${service.quoteEndDate}T00:00:00`,
                    quoteCost: Number(service.quoteCost),
                    quotePrice: Number(service.quotePrice),
                    status: 'Quoted'
                };
                return createService.mutateAsync(serviceDTO);
            });

            await Promise.all(servicePromises);

            // Update RFQ status to "Quoted"
            await updateRFQ.mutateAsync({
                rfqId: BigInt(rfqId ?? 0),
                rfq: {
                    status: RFQStatus.Quoted,
                }
            });

            resetForm();
            onQuoteSent();
            onClose();
        } catch (error) {
            console.error('Error creating project or services:', error);
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
                                            size="sm"
                                            onClick={() => removeItem(index)}
                                            iconOnly
                                        >
                                            <i className="bi bi-trash"></i>
                                        </Button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    <div className="d-flex justify-content-end">
                        <Button variant="primary" size="sm" outline={true} onClick={addItem}>
                            Add Item
                        </Button>
                    </div>
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
      <Button variant="danger" outline={true} onClick={onClose}>
        Close
      </Button>
      <Button 
        variant="primary" 
        onClick={handleSubmit}
        disabled={services.length === 0}
      >
        Generate and Send
      </Button>
    </Modal.Footer>
  </Modal>
    );
};

export default QuoteEstimateModal;