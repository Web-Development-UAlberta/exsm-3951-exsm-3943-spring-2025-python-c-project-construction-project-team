import { useState, ChangeEvent, FormEvent, useEffect } from 'react';
import { Row, Col, Form, Card, Container, Modal } from 'react-bootstrap';
import { Button } from '../../components/ButtonComponent/Button';
import ConstructionImage from "../../assets/construction.png";
import { RFQCreate } from '../../api/rfq/rfq.types';
import { useCreateRFQ, uploadImageToRFQ } from '../../api/rfq/rfq';
import { useIsAuthenticated, useMsal } from '@azure/msal-react';
import { loginRequest } from '../../config/authConfig';
import { useNavigate } from 'react-router-dom';

const RequestQuote = () => {
    const { instance } = useMsal();
    const isAuthenticated = useIsAuthenticated();
    const navigate = useNavigate();
    const [showLoginModal, setShowLoginModal] = useState(false);
    const createRFQMutation = useCreateRFQ(instance);
    const uploadImageMutation = uploadImageToRFQ(instance);

    const MAX_BUDGET = 999999999;

    useEffect(() => {
        if (!isAuthenticated) {
        setShowLoginModal(true);
        }
    }, [isAuthenticated]);

    const handleModalLogin = () => {
        setShowLoginModal(false);
        instance
        .loginRedirect({
            ...loginRequest,
            prompt: 'login',
        })
        .catch((error) => console.log(error));
    };

    // Form state
    const [formData, setFormData] = useState({
        projectAddress: '',
        renovationType: '',
        roomSize: '',
        budget: '',
        preferredMaterial: '',
        description: '',
    });

    // File upload state
    const [files, setFiles] = useState<File[]>([]);

    // Form submission state
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitSuccess, setSubmitSuccess] = useState(false);
    const [submitError, setSubmitError] = useState('');

    // Room size options
    const roomSizeOptions = [
        { value: "Small", label: "Small : Less than 100 sq ft" },
        { value: "Medium", label: 'Medium: 100-200 sq ft' },
        { value: "Large", label: 'Large: 200-500 sq ft' },
        { value: "Extra Spacious", label: 'Extra Spacious: More than 500 sq ft' },
    ];

    // Handle form input changes
    const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;

        if (name === 'budget') {
            const budgetValue = value.replace(/[^0-9]/g, ''); // Allow only numbers
            setFormData({
                ...formData,
                [name]: budgetValue,
            });
            return;
        } else {
            setFormData({
                ...formData,
                [name]: value,
            });
        }
    };

    // Handle radio changes for renovation type
    const handleRenovationTypeChange = (e: ChangeEvent<HTMLInputElement>) => {
        const { value } = e.target;
        setFormData({
            ...formData,
            renovationType: value,
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
        if (!isAuthenticated) {
            setShowLoginModal(true);
            return;
        }
        setIsSubmitting(true);
        setSubmitError('');

        // Budget validation
        const budgetValue = Number(formData.budget);
        if (isNaN(budgetValue) || budgetValue <= 0) {
            setSubmitError('Please enter a valid budget amount');
            return;
        }

        if (budgetValue > MAX_BUDGET) {
            setSubmitError(`Budget cannot exceed ${MAX_BUDGET.toLocaleString()}`);
            return;
        }

        try {
            const rfqCreateBody: RFQCreate = {
                projectAddress: formData.projectAddress,
                renovationType: formData.renovationType,
                roomSize: formData.roomSize,
                budget: Number(formData.budget),
                preferredMaterial: formData.preferredMaterial,
                description: formData.description,
            };

            const newRFQ = await createRFQMutation.mutateAsync(rfqCreateBody);
            if (!newRFQ) {
                throw new Error('Failed to create RFQ');
            }

            await Promise.all(
                files.map(file => uploadImageMutation.mutateAsync({ rfqId: newRFQ.id, fileName: file.name, file }))
            );

            setSubmitSuccess(true);
            setFormData({ projectAddress: '', renovationType: '', roomSize: '', budget: '', preferredMaterial: '', description: '' });
            setFiles([]);
        } catch (error: any) {
            const errorMessage = error?.response?.data?.message || error.message || 'Unexpected error occurred';
            console.error('Error during form submission:', errorMessage);
            setSubmitError(`Submission failed: ${errorMessage}`);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <Container className="py-5">
            {/* Redirect Modal */}
            <Modal show={!isAuthenticated && showLoginModal} onHide={() => navigate('/')} centered backdrop="static">
                <Modal.Header closeButton>
                    <Modal.Title>Login Required</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <p>Please login to submit a quote request.</p>
                </Modal.Body>
                <Modal.Footer>
                    <Button
                        variant="secondary"
                        onClick={() => navigate('/')}
                    >Return Home</Button>
                    <Button
                        variant="primary"
                        onClick={handleModalLogin}
                    >Login</Button>
                </Modal.Footer>
            </Modal>

            {/* Request Quote Form */}
            <Row>
                <Col lg={6}>
                    <h1 className="mb-3">Request A Quote</h1>
                    <Card className="bg-light border-0 mb-4">
                        <Card.Body className="p-0">
                            <img
                                src={ConstructionImage}
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
                                            type="radio"
                                            id="KitchenRemodels"
                                            label="Kitchen Remodels"
                                            name="renovationType"
                                            value="KitchenRemodels"
                                            // checked={formData.renovationType === "Kitchen Remodels"}
                                            onChange={handleRenovationTypeChange}
                                        />
                                    </Col>
                                    <Col xs={6}>
                                        <Form.Check
                                            type="radio"
                                            id="HomeAdditions"
                                            label="Home Additions"
                                            name="renovationType"
                                            value="HomeAdditions"
                                            // checked={formData.renovationType === "Home Additions"}
                                            onChange={handleRenovationTypeChange}
                                        />
                                    </Col>
                                    <Col xs={6}>
                                        <Form.Check
                                            type="radio"
                                            id="BasementFinishing"
                                            label="Basement Finishing"
                                            name="renovationType"
                                            value="BasementFinishing"
                                            // checked={formData.renovationType === "Basement Finishing"}
                                            onChange={handleRenovationTypeChange}
                                        />
                                    </Col>
                                    <Col xs={6}>
                                        <Form.Check
                                            type="radio"
                                            id="BathroomRenovations"
                                            label="Bathroom Renovation"
                                            name="renovationType"
                                            value="BathroomRenovations"
                                            // checked={formData.renovationType === "Bathroom Renovation"}
                                            onChange={handleRenovationTypeChange}
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
                                    {roomSizeOptions.map((rs, index) => (
                                        <option key={index} value={rs.value}>{rs.label}</option>
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
                                    min="0"
                                    max="999999999"
                                />
                            </Form.Group>

                            <Form.Group className="mb-3">
                                <Form.Label>Preferred Materials</Form.Label>
                                <Form.Control
                                    type="text"
                                    name="preferredMaterial"
                                    value={formData.preferredMaterial}
                                    onChange={handleInputChange}
                                />
                            </Form.Group>

                            <Form.Group className="mb-3">
                                <Form.Label>description</Form.Label>
                                <Form.Control
                                    as="textarea"
                                    rows={4}
                                    name="description"
                                    value={formData.description}
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
                                                <Button variant="danger" size="sm" onClick={() => handleFileRemove(index)}>
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
                                    variant="primary"
                                    type="submit"
                                    disabled={isSubmitting || !isAuthenticated}
                                    className="py-2"
                                >
                                    {
                                        !isAuthenticated ? 'Please Login to Submit' :
                                        isSubmitting ? 'Submitting...' : 'Submit Request'
                                    }
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