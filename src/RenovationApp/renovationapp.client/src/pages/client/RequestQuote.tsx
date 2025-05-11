import React, { useState, ChangeEvent, FormEvent } from 'react';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import Card from 'react-bootstrap/Card';
import { useIsAuthenticated } from '@azure/msal-react';
import { useNavigate } from 'react-router-dom';
import Container from 'react-bootstrap/esm/Container';
import Button from 'react-bootstrap/esm/Button';
import ImagePlaceholder from "../../assets/placeholder-svg.svg";

const RequestQuote: React.FC = () => {
    const isAuthenticated = useIsAuthenticated();
    const navigate = useNavigate();

    // Form state
    const [formData, setFormData] = useState({
        projectAddress: '',
        services: {
            kitchenRemodel: false,
            homeAdditions: false,
            basementFinishing: false,
            bathroomRenovation: false,
        },
        roomSize: '',
        budget: '',
        preferredMaterials: '',
        message: '',
    });

    // File upload state
    const [files, setFiles] = useState<File[]>([]);

    // Form submission state
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitSuccess, setSubmitSuccess] = useState(false);
    const [submitError, setSubmitError] = useState('');

    // Room size options
    const roomSizeOptions = [
        'Samll : Less than 100 sq ft',
        'Medium: 100-200 sq ft',
        'Large: 200-500 sq ft',
        'Extra Spacious: More than 500 sq ft',
    ];

    // Handle form input changes
    const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    };

    // Handle checkbox changes
    const handleCheckboxChange = (e: ChangeEvent<HTMLInputElement>) => {
        const { name, checked } = e.target;
        setFormData({
            ...formData,
            services: {
                ...formData.services,
                [name]: checked,
            },
        });
    };

    // Handle file upload

    const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            setFiles([...files, ...Array.from(e.target.files)]);
        }
    };

    const handleFileRemove = (index: number) => {
        setFiles(files.filter((_, i) => i !== index));
    };

    // Handle form submission
    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();

        // If not authenticated, redirect to login
        if (!isAuthenticated) {
            setSubmitError('Please log in to submit a quote request');
            return;
        }

        setIsSubmitting(true);
        setSubmitError('');

        try {
            // Simulate API call with timeout
            await new Promise(resolve => setTimeout(resolve, 1000));

            // Create form data to send
            const requestFormData = new FormData();
            requestFormData.append('projectAddress', formData.projectAddress);
            requestFormData.append('services', JSON.stringify(formData.services));
            requestFormData.append('roomSize', formData.roomSize);
            requestFormData.append('budget', formData.budget);
            requestFormData.append('preferredMaterials', formData.preferredMaterials);
            requestFormData.append('message', formData.message);

            // Append files if any
            if (files) {
                for (let i = 0; i < files.length; i++) {
                    requestFormData.append('files', files[i]);
                }
            }

            // In a real app, you would send this data to your API
            // const response = await fetch('/api/request-quote', {
            //   method: 'POST',
            //   body: requestFormData,
            // });

            // if (!response.ok) throw new Error('Failed to submit request');

            setSubmitSuccess(true);

            // Reset form after successful submission
            setFormData({
                projectAddress: '',
                services: {
                    kitchenRemodel: false,
                    homeAdditions: false,
                    basementFinishing: false,
                    bathroomRenovation: false,
                },
                roomSize: '',
                budget: '',
                preferredMaterials: '',
                message: '',
            });
            setFiles([]);

        } catch (error) {
            console.error('Error submitting form:', error);
            setSubmitError('Failed to submit your request. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <Container className="py-5">
            <Row>
                <Col lg={6}>
                    <h1 className="mb-3">Request A Quote</h1>
                    <p className="text-muted mb-4">
                        Lorem ipsum dolor sit amet consectetur. Phasellus tellus lacus integer lectus adipiscing porttitor senectus amet pulvinar.
                    </p>

                    <Card className="bg-light border-0 mb-4">
                        <Card.Body className="p-0">
                            <img
                                src={ImagePlaceholder}
                                alt="Renovation"
                                className="img-fluid w-100"
                                style={{ objectFit: 'cover' }}
                            />
                        </Card.Body>
                    </Card>
                </Col>

                <Col lg={6}>
                    {submitSuccess ? (
                        <div className="p-4 bg-light rounded">
                            <h3 className="text-success mb-3">Request Submitted!</h3>
                            <p>Thank you for your quote request. Our team will review your project details and contact you shortly.</p>
                            <Button
                                variant="primary"
                                onClick={() => setSubmitSuccess(false)}
                                className="mt-3"
                            >
                                Submit Another Request
                            </Button>
                        </div>
                    ) : (
                        <Form onSubmit={handleSubmit}>
                            <Form.Group className="mb-3">
                                <Form.Label>Project Address</Form.Label>
                                <Form.Control
                                    type="text"
                                    name="projectAddress"
                                    value={formData.projectAddress}
                                    onChange={handleInputChange}
                                    required
                                />
                            </Form.Group>

                            <Form.Group className="mb-3">
                                <Form.Label>Services</Form.Label>
                                <Row>
                                    <Col xs={6}>
                                        <Form.Check
                                            type="checkbox"
                                            id="kitchenRemodel"
                                            label="Kitchen Remodel"
                                            name="kitchenRemodel"
                                            checked={formData.services.kitchenRemodel}
                                            onChange={handleCheckboxChange}
                                        />
                                    </Col>
                                    <Col xs={6}>
                                        <Form.Check
                                            type="checkbox"
                                            id="homeAdditions"
                                            label="Home Additions"
                                            name="homeAdditions"
                                            checked={formData.services.homeAdditions}
                                            onChange={handleCheckboxChange}
                                        />
                                    </Col>
                                    <Col xs={6}>
                                        <Form.Check
                                            type="checkbox"
                                            id="basementFinishing"
                                            label="Basement Finishing"
                                            name="basementFinishing"
                                            checked={formData.services.basementFinishing}
                                            onChange={handleCheckboxChange}
                                        />
                                    </Col>
                                    <Col xs={6}>
                                        <Form.Check
                                            type="checkbox"
                                            id="bathroomRenovation"
                                            label="Bathroom Renovation"
                                            name="bathroomRenovation"
                                            checked={formData.services.bathroomRenovation}
                                            onChange={handleCheckboxChange}
                                        />
                                    </Col>
                                </Row>
                            </Form.Group>

                            <Form.Group className="mb-3">
                                <Form.Label>Room size</Form.Label>
                                <Form.Select
                                    name="roomSize"
                                    value={formData.roomSize}
                                    onChange={handleInputChange}
                                >
                                    <option value="">Select room size</option>
                                    {roomSizeOptions.map((size, index) => (
                                        <option key={index} value={size}>{size}</option>
                                    ))}
                                </Form.Select>
                            </Form.Group>

                            <Form.Group className="mb-3">
                                <Form.Label>Budget</Form.Label>
                                <Form.Control
                                    type="text"
                                    name="budget"
                                    value={formData.budget}
                                    onChange={handleInputChange}
                                    placeholder="$"
                                />
                            </Form.Group>

                            <Form.Group className="mb-3">
                                <Form.Label>Preferred Materials</Form.Label>
                                <Form.Control
                                    type="text"
                                    name="preferredMaterials"
                                    value={formData.preferredMaterials}
                                    onChange={handleInputChange}
                                />
                            </Form.Group>

                            <Form.Group className="mb-3">
                                <Form.Label>Message</Form.Label>
                                <Form.Control
                                    as="textarea"
                                    rows={4}
                                    name="message"
                                    value={formData.message}
                                    onChange={handleInputChange}
                                    placeholder="Additional Notes"
                                />
                            </Form.Group>

                            <Form.Group className="mb-4">
                                <div className="d-flex justify-content-between align-items-center">
                                    <Form.Label className="mb-0">Share floorplans, inspired images, etc.</Form.Label>
                                    <div>
                                        <Form.Control
                                            type="file"
                                            id="fileUpload"
                                            onChange={handleFileChange}
                                            className="d-none"
                                            multiple
                                        />
                                        <label htmlFor="fileUpload" className="btn btn-outline-secondary">
                                            Upload Files
                                        </label>
                                    </div>
                                </div>
                                {files && files.length > 0 && (
                                    <ul className="mt-2 list-group">
                                        {files.map((file, index) => (
                                            <li key={index} className="list-group-item d-flex justify-content-between align-items-center">
                                                {file.name}
                                                <Button variant="outline-danger" size="sm" onClick={() => handleFileRemove(index)}>
                                                    <i className="bi bi-trash" ></i>
                                                </Button>
                                            </li>
                                        ))}
                                    </ul>
                                )}
                                {files && files.length > 0 && (
                                    <div className="mt-2">
                                        <small className="text-muted">
                                            {files.length} file(s) selected
                                        </small>
                                    </div>
                                )}
                            </Form.Group>

                            {submitError && (
                                <div className="alert alert-danger" role="alert">
                                    {submitError}
                                </div>
                            )}

                            <div className="d-grid">
                                <Button
                                    variant="dark"
                                    type="submit"
                                    disabled={isSubmitting}
                                    className="py-2"
                                >
                                    {isSubmitting ? 'Submitting...' : 'Submit Request'}
                                </Button>
                            </div>
                        </Form>
                    )}
                </Col>
            </Row>
        </Container>
    );
};

export default RequestQuote;