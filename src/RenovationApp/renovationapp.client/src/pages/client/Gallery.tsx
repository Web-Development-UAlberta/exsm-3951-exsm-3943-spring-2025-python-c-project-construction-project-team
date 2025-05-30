import { useState, useEffect } from 'react';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import Card from 'react-bootstrap/Card';
import Carousel from 'react-bootstrap/Carousel';
import './Gallery.css';
import ImagePlaceholder from "../../assets/placeholder-svg.svg";
import { useRenovationTags } from '../../api/renotags/renotags';
// import { getPublicProjectsWithImages } from '../../api/projects/children/projectPublic';
import { ProjectPublicInfoWithImages } from '../../api/projects/project.types';
import { gallery_mock_data } from './mockData';
import { Button } from '../../components/ButtonComponent/Button';

const renoTypes = ['Kitchen Remodels', 'Home Additions', 'Basement Finishings', 'Bathroom Renovations'];
const renoBudgets = ['0-10k', '10k-20k', '20k-30k', '30k+'];

const Gallery = () => {
    const [roomTypeFilter, setRoomTypeFilter] = useState<string[]>([]);
    const [styleFilter, setStyleFilter] = useState<string[]>([]);
    const [budgetFilter, setBudgetFilter] = useState<string[]>([]);
    const [FilteredPP, setFilteredPP] = useState<ProjectPublicInfoWithImages[]>([]);
    const { data: renoTags } = useRenovationTags();
    // const { data: publicProjects = [] } = getPublicProjectsWithImages();  
    const publicProjects = gallery_mock_data; // switched to using mock data due to image url not rendering issue with Amzon S3 - images are uploaded but not browser cant resolve the url

    const [showModal, setShowModal] = useState(false);
    const [selectedProject, setSelectedProject] = useState<ProjectPublicInfoWithImages | null>(null);
    const [activeIndex, setActiveIndex] = useState(0);

    // Filter and sort images based on selected filters
    useEffect(() => {
        let result = publicProjects;
        if (roomTypeFilter.length > 0) {
            result = result.filter(pp =>
                pp.renovationType !== undefined &&
                roomTypeFilter.includes(pp.renovationType)
            );
        }
        if (styleFilter.length > 0) {
            result = result.filter(pp => {
                if (pp.renovationTagIds === undefined || pp.renovationTagIds === null) {
                    return false;
                }
                return pp.renovationTagIds.some(tagId => styleFilter.includes(tagId));
            });
        }
        if (budgetFilter.length > 0) {
            result = result.filter(pp => {
                if (pp.costCategory === undefined || pp.costCategory === null) {
                    return false;
                }
                let budgetRange = convertCostCategoryToString(pp.costCategory);
                return budgetFilter.includes(budgetRange);
            });
        }

        setFilteredPP(result);
    }, [roomTypeFilter, styleFilter, budgetFilter, publicProjects]);

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

    const handleRoomTypeChange = (type: string) => {
        setRoomTypeFilter(prev =>
            prev.includes(type)
                ? prev.filter(item => item !== type)
                : [...prev, type]
        );
    };

    const handleStyleChange = (style: string) => {
        setStyleFilter(prev =>
            prev.includes(style)
                ? prev.filter(item => item !== style)
                : [...prev, style]
        );
    };

    const handleBudgetChange = (budget: string) => {
        setBudgetFilter(prev =>
            prev.includes(budget)
                ? prev.filter(item => item !== budget)
                : [...prev, budget]
        );
    };


    const handleOpenModal = (project: ProjectPublicInfoWithImages, initialIndex: number = 0) => {
        setSelectedProject(project);
        setActiveIndex(initialIndex);
        setShowModal(true);
        // Prevent scrolling when modal is open
        document.body.style.overflow = 'hidden';
    };

    const handleCloseModal = () => {
        setShowModal(false);
        setSelectedProject(null);
        // Restore scrolling
        document.body.style.overflow = 'auto';
    };


    const goToPrevious = () => {
        if (!selectedProject || !selectedProject.images) return;
        setActiveIndex((prevIndex) =>
            prevIndex === 0 ? selectedProject.images.length - 1 : prevIndex - 1
        );
    };

    const goToNext = () => {
        if (!selectedProject || !selectedProject.images) return;
        setActiveIndex((prevIndex) =>
            prevIndex === selectedProject.images.length - 1 ? 0 : prevIndex + 1
        );
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
                            {renoTypes.map((type) => (
                                <Form.Check
                                    key={type}
                                    type="checkbox"
                                    id={`room-${type}`}
                                    label={type}
                                    checked={roomTypeFilter.includes(type)}
                                    onChange={() => handleRoomTypeChange(type)}
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
                                                        <div className="gallery-caption p-2">
                                                            <h6>{pp.renovationType?.replace(/([A-Z])/g, ' $1').trim()}</h6>
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
            {showModal && selectedProject && selectedProject.images && selectedProject.images.length > 0 && (
                <div className="fullscreen-overlay">
                    {/* Close button */}
                    <Button
                        variant="transparent"
                        iconOnly
                        className="fullscreen-close-btn"
                        onClick={handleCloseModal}
                        aria-label="Close"
                    >
                        <i className="bi bi-x-lg"></i>
                    </Button>

                    {/* Fullscreen navigation */}
                    <div className="fullscreen-navigation-container">
                        <Button
                            variant="transparent"
                            iconOnly
                            className="fullscreen-nav-btn prev"
                            onClick={goToPrevious}
                            aria-label="Previous image"
                        >
                            <i className="bi bi-chevron-left"></i>
                        </Button>

                        <div className="fullscreen-image-container">
                            <img
                                src={selectedProject.images[activeIndex].url}
                                alt={selectedProject.images[activeIndex].fileName || 'Project image'}
                                className="fullscreen-image"
                            />
                        </div>

                        <Button
                            variant="transparent"
                            iconOnly
                            className="fullscreen-nav-btn next"
                            onClick={goToNext}
                            aria-label="Next image"
                        >
                            <i className="bi bi-chevron-right"></i>
                        </Button>
                    </div>

                    {/* Image info footer */}
                    <div className="fullscreen-footer">
                        <div className="fullscreen-project-info">
                            <h3>{selectedProject.renovationType?.replace(/([A-Z])/g, ' $1').trim() || 'Renovation Project'}</h3>
                            <div>
                                {selectedProject.renovationTagIds && selectedProject.renovationTagIds.length > 0 && (
                                    <span>{selectedProject.renovationTagIds.join(', ')}</span>
                                )}
                                {selectedProject.costCategory && (
                                    <span className="budget-badge">
                                        {convertCostCategoryToString(selectedProject.costCategory)}
                                    </span>
                                )}
                            </div>
                        </div>

                        <div className="fullscreen-counter">
                            {activeIndex + 1} / {selectedProject.images.length}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Gallery;