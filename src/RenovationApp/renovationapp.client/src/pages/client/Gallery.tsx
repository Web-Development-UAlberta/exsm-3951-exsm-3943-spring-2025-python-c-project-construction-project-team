import { useState, useEffect } from 'react';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import Card from 'react-bootstrap/Card';
import Carousel from 'react-bootstrap/Carousel';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import './Gallery.css';
import ImagePlaceholder from "../../assets/placeholder-svg.svg";
import { useRenovationTags } from '../../api/renotags/renotags';
import { getPublicProjectsWithImages } from '../../api/projects/children/projectPublic';
import { ProjectPublicInfoWithImages } from '../../api/projects/project.types';

const renoTypes = [
    { label: 'Kitchen Remodels', value: 'KitchenRemodels' },
    { label: 'Home Additions', value: "HomeAdditions" },
    { label: 'Basement Finishings', value: "BasementFinishings" },
    { label: 'Bathroom Renovations', value: 'BathroomRenovations' }
];
const renoBudgets = ['0-10k', '10k-20k', '20k-30k', '30k+'];


const Gallery = () => {
    // State for filters
    const [roomTypeFilter, setRoomTypeFilter] = useState<string[]>([]);
    const [styleFilter, setStyleFilter] = useState<string[]>([]);
    const [budgetFilter, setBudgetFilter] = useState<string[]>([]);
    const [FilteredPP, setFilteredPP] = useState<ProjectPublicInfoWithImages[]>([]);
    const { data: renoTags } = useRenovationTags();
    const { data: publicProjects = [] } = getPublicProjectsWithImages();

    // State for fullscreen modal
    const [showModal, setShowModal] = useState(false);
    const [selectedProject, setSelectedProject] = useState<ProjectPublicInfoWithImages | null>(null);
    const [activeIndex, setActiveIndex] = useState(0);

    // Filter and sort images based on selected filters
    useEffect(() => {
        let result = publicProjects;

        // Apply room type filter
        if (roomTypeFilter.length > 0) {
            result = result.filter(pp =>
                pp.renovationType !== undefined &&
                roomTypeFilter.includes(pp.renovationType)
            );
        }

        // Apply style filter
        if (styleFilter.length > 0) {
            result = result.filter(pp => {
                if (pp.renovationTagIds === undefined || pp.renovationTagIds === null) {
                    return false;
                }
                // Check if any of the project's tags match the selected style filters
                return pp.renovationTagIds.some(tagId => styleFilter.includes(tagId));
            });
        }

        // Apply budget filter
        if (budgetFilter.length > 0) {
            result = result.filter(pp => {
                if (pp.costCategory === undefined || pp.costCategory === null) {
                    return false;
                }
                // Convert costCategory number to our budget range strings
                let budgetRange = convertCostCategoryToString(pp.costCategory);
                return budgetFilter.includes(budgetRange);
            });
        }

        setFilteredPP(result);
    }, [roomTypeFilter, styleFilter, budgetFilter, publicProjects]);

    // Helper function to convert cost category to string
    const convertCostCategoryToString = (costCategory: number | null | undefined): string => {
        if (costCategory === null || costCategory === undefined) return '';

        if (costCategory <= 10) {
            return '0-10k';
        } else if (costCategory <= 20) {
            return '10k-20k';
        } else if (costCategory <= 30) {
            return '20k-30k';
        } else {
            return '30k+';
        }
    };

    // Handler for room type filter changes
    const handleRoomTypeChange = (type: string) => {
        setRoomTypeFilter(prev =>
            prev.includes(type)
                ? prev.filter(item => item !== type)
                : [...prev, type]
        );
    };

    // Handler for style filter changes
    const handleStyleChange = (style: string) => {
        setStyleFilter(prev =>
            prev.includes(style)
                ? prev.filter(item => item !== style)
                : [...prev, style]
        );
    };

    // Handler for budget filter changes
    const handleBudgetChange = (budget: string) => {
        setBudgetFilter(prev =>
            prev.includes(budget)
                ? prev.filter(item => item !== budget)
                : [...prev, budget]
        );
    };

    // Handler to open the full screen modal
    const handleOpenModal = (project: ProjectPublicInfoWithImages, initialIndex: number = 0) => {
        setSelectedProject(project);
        setActiveIndex(initialIndex);
        setShowModal(true);
    };

    // Handler to close the full screen modal
    const handleCloseModal = () => {
        setShowModal(false);
        setSelectedProject(null);
    };



    return (
        <div>


            <Row>
                {/* Filter Sidebar */}
                <Col lg={3} md={4} className="filter-sidebar">
                    <h5 className="filter-heading mb-3">Filter by</h5>

                    {/* Room Type Filter */}
                    <div className="filter-section mb-4">
                        <h6 className="filter-subheading">Room Type</h6>
                        <Form>
                            {renoTypes.map((rt, index) => (
                                <Form.Check
                                    key={index}
                                    type="checkbox"
                                    id={`room-${rt.value}`}
                                    label={rt.label}
                                    value={rt.value}
                                    checked={roomTypeFilter.includes(rt.value)}
                                    onChange={() => handleRoomTypeChange(rt.value)}
                                    className="mb-2"
                                />
                            ))}
                        </Form>
                    </div>

                    {/* Style Filter */}
                    <div className="filter-section mb-4">
                        <h6 className="filter-subheading">Style</h6>
                        <Form>
                            {renoTags && renoTags.map((tag) => (
                                <Form.Check
                                    key={tag.id}
                                    type="checkbox"
                                    id={`style-${tag.id}`}
                                    label={tag.id}
                                    checked={styleFilter.includes(tag.id)}
                                    onChange={() => handleStyleChange(tag.id)}
                                    className="mb-2"
                                />
                            ))}
                        </Form>
                    </div>

                    {/* Budget Filter */}
                    <div className="filter-section">
                        <h6 className="filter-subheading">Budget</h6>
                        <Form>
                            {renoBudgets.map((budget) => (
                                <Form.Check
                                    key={budget}
                                    type="checkbox"
                                    id={`budget-${budget}`}
                                    label={budget}
                                    checked={budgetFilter.includes(budget)}
                                    onChange={() => handleBudgetChange(budget)}
                                    className="mb-2"
                                />
                            ))}
                        </Form>
                    </div>
                </Col>

                {/* Gallery Content */}
                <Col lg={9} md={8}>
                    <div className='py-3'>
                        <h1 className="text-center mb-2">Gallery</h1>
                    </div>

                    <Row xs={1} sm={2} md={2} lg={4} className="g-4">
                        {FilteredPP.map((pp) => (
                            <Col key={String(pp.id)}>
                                <Card className="gallery-card h-100">
                                    {pp.images && pp.images.length > 0 ? (
                                        <>
                                            <div className="badge-cost-category">
                                                {convertCostCategoryToString(pp.costCategory)}
                                            </div>
                                            <Carousel
                                                className="gallery-carousel"
                                                interval={null}
                                                indicators={pp.images.length > 1}
                                                controls={pp.images.length > 1}
                                                onClick={() => handleOpenModal(pp)}
                                            >
                                                {pp.images.map((image, index) => (
                                                    <Carousel.Item key={image.fileName + index}>
                                                        <img
                                                            className="d-block w-100 gallery-image"
                                                            src={image.url}
                                                            alt={image.fileName}
                                                        />
                                                        <div className="gallery-caption">
                                                            <h6>{pp.renovationType || 'Renovation Project'}</h6>
                                                            {pp.renovationTagIds && pp.renovationTagIds.length > 0 && (
                                                                <small>{pp.renovationTagIds.join(', ')}</small>
                                                            )}
                                                        </div>
                                                    </Carousel.Item>
                                                ))}
                                            </Carousel>
                                        </>
                                    ) : (
                                        <Card.Img
                                            variant="top"
                                            src={ImagePlaceholder}
                                            alt="No image available"
                                            className="gallery-image"
                                        />
                                    )}
                                </Card>
                            </Col>
                        ))}
                    </Row>
                </Col>
            </Row>

            {/* Fullscreen Modal */}
            <Modal
                show={showModal}
                onHide={handleCloseModal}
                size="xl"
                centered
                className="fullscreen-modal"
            >
                <Modal.Header closeButton>
                    <Modal.Title>
                        {selectedProject?.renovationType || 'Project Gallery'}
                        {selectedProject?.costCategory && (
                            <span className="ms-3 badge bg-secondary">
                                {convertCostCategoryToString(selectedProject.costCategory)}
                            </span>
                        )}
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {selectedProject && selectedProject.images && selectedProject.images.length > 0 && (
                        <Carousel
                            activeIndex={activeIndex}
                            onSelect={(index) => setActiveIndex(index)}
                            interval={null}
                        >
                            {selectedProject.images.map((image, index) => (
                                <Carousel.Item key={image.fileName + index}>
                                    <img
                                        className="d-block w-100"
                                        src={image.url}
                                        alt={image.fileName}
                                    />
                                    <Carousel.Caption>
                                        <h5>{selectedProject.renovationType || 'Renovation Project'}</h5>
                                        {selectedProject.renovationTagIds && selectedProject.renovationTagIds.length > 0 && (
                                            <p>{selectedProject.renovationTagIds.join(', ')}</p>
                                        )}
                                    </Carousel.Caption>
                                </Carousel.Item>
                            ))}
                        </Carousel>
                    )}
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleCloseModal}>
                        Close
                    </Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
};

export default Gallery;