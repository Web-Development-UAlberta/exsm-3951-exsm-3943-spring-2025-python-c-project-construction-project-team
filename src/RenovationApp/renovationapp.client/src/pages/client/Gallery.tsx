
import { useState, useEffect } from 'react';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import Card from 'react-bootstrap/Card';
import './Gallery.css';
import ImagePlaceholder from "../../assets/placeholder-svg.svg";
// Define types for our project images
interface ProjectImage {
    id: number;
    imageUrl: string;
    roomType: string;
    style: string;
    budget: string;
    price: number;
    title: string;
    description: string;
}

const Gallery = () => {
    // State for filters
    const [roomTypeFilter, setRoomTypeFilter] = useState<string[]>([]);
    const [styleFilter, setStyleFilter] = useState<string[]>([]);
    const [budgetFilter, setBudgetFilter] = useState<string[]>([]);
    const [filteredImages, setFilteredImages] = useState<ProjectImage[]>([]);

    // Mock data for project images
    const projectImages: ProjectImage[] = [
        {
            id: 1,
            imageUrl: '/api/placeholder/250/250',
            roomType: 'Kitchen Remodels',
            style: 'Modern',
            budget: '20k-30k',
            price: 25000,
            title: 'Modern Kitchen Renovation',
            description: 'Complete kitchen renovation with custom cabinets and island.'
        },
        {
            id: 2,
            imageUrl: '/api/placeholder/250/250',
            roomType: 'Bathroom Renovations',
            style: 'Modern',
            budget: '10k-20k',
            price: 15000,
            title: 'Master Bathroom Remodel',
            description: 'Luxurious bathroom with walk-in shower and dual vanity.'
        },
        {
            id: 3,
            imageUrl: '/api/placeholder/250/250',
            roomType: 'Home Additions',
            style: 'Country style',
            budget: '30k+',
            price: 35000,
            title: 'Family Room Addition',
            description: 'Spacious family room addition with vaulted ceiling.'
        },
        {
            id: 4,
            imageUrl: '/api/placeholder/250/250',
            roomType: 'Basement Finishings',
            style: 'Budget-friendly',
            budget: '10k-20k',
            price: 12000,
            title: 'Basement Entertainment Area',
            description: 'Cozy basement transformation with entertainment center.'
        },
        {
            id: 5,
            imageUrl: '/api/placeholder/250/250',
            roomType: 'Kitchen Remodels',
            style: 'Fancy',
            budget: '30k+',
            price: 42000,
            title: 'Luxury Kitchen Overhaul',
            description: 'High-end kitchen with marble countertops and custom lighting.'
        },
        {
            id: 6,
            imageUrl: '/api/placeholder/250/250',
            roomType: 'Bathroom Renovations',
            style: 'Country style',
            budget: '0-10k',
            price: 8000,
            title: 'Guest Bathroom Update',
            description: 'Charming country-style bathroom renovation.'
        },
        {
            id: 7,
            imageUrl: '/api/placeholder/250/250',
            roomType: 'Home Additions',
            style: 'Modern',
            budget: '30k+',
            price: 45000,
            title: 'Modern Home Office Addition',
            description: 'Bright and spacious home office with custom built-ins.'
        },
        {
            id: 8,
            imageUrl: '/api/placeholder/250/250',
            roomType: 'Basement Finishings',
            style: 'Budget-friendly',
            budget: '0-10k',
            price: 9500,
            title: 'Budget Basement Makeover',
            description: 'Cost-effective basement renovation with multi-purpose space.'
        },
        {
            id: 11,
            imageUrl: '/api/placeholder/250/250',
            roomType: 'Kitchen Remodels',
            style: 'Modern',
            budget: '20k-30k',
            price: 25000,
            title: 'Modern Kitchen Renovation',
            description: 'Complete kitchen renovation with custom cabinets and island.'
        },
        {
            id: 12,
            imageUrl: '/api/placeholder/250/250',
            roomType: 'Bathroom Renovations',
            style: 'Modern',
            budget: '10k-20k',
            price: 15000,
            title: 'Master Bathroom Remodel',
            description: 'Luxurious bathroom with walk-in shower and dual vanity.'
        },
        {
            id: 13,
            imageUrl: '/api/placeholder/250/250',
            roomType: 'Home Additions',
            style: 'Country style',
            budget: '30k+',
            price: 35000,
            title: 'Family Room Addition',
            description: 'Spacious family room addition with vaulted ceiling.'
        },
        {
            id: 14,
            imageUrl: '/api/placeholder/250/250',
            roomType: 'Basement Finishings',
            style: 'Budget-friendly',
            budget: '10k-20k',
            price: 12000,
            title: 'Basement Entertainment Area',
            description: 'Cozy basement transformation with entertainment center.'
        },
    ];

    // Filter and sort images based on selected filters
    useEffect(() => {
        let result = [...projectImages];

        // Apply room type filter
        if (roomTypeFilter.length > 0) {
            result = result.filter(image => roomTypeFilter.includes(image.roomType));
        }

        // Apply style filter
        if (styleFilter.length > 0) {
            result = result.filter(image => styleFilter.includes(image.style));
        }

        // Apply budget filter
        if (budgetFilter.length > 0) {
            result = result.filter(image => budgetFilter.includes(image.budget));
        }
        setFilteredImages(result);
    }, [roomTypeFilter, styleFilter, budgetFilter]);

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
                            {['Kitchen Remodels', 'Home Additions', 'Basement Finishings', 'Bathroom Renovations'].map((type) => (
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
                            {['Fancy', 'Country style', 'Budget-friendly', 'Modern'].map((style) => (
                                <Form.Check
                                    key={style}
                                    type="checkbox"
                                    id={`style-${style}`}
                                    label={style}
                                    checked={styleFilter.includes(style)}
                                    onChange={() => handleStyleChange(style)}
                                    className="mb-2"
                                />
                            ))}
                        </Form>
                    </div>

                    {/* Budget Filter */}
                    <div className="filter-section">
                        <h6 className="filter-subheading">Budget</h6>
                        <Form>
                            {['0-10k', '10k-20k', '20k-30k', '30k+'].map((budget) => (
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
                        <p className="text-center mb-4">
                            Lorem ipsum dolor sit amet consectetur. Pharetra tellus lacus integer lectus adipiscing porttitor senectus amet pulvinar.
                        </p>
                    </div>

                    <Row xs={1} sm={2} md={2} lg={4} className="g-4">
                        {filteredImages.map((image) => (
                            <Col key={image.id}>
                                <Card className="gallery-card h-100">
                                    <Card.Img
                                        variant="top"
                                        src={ImagePlaceholder}
                                        alt={image.title}
                                        className="gallery-image"
                                    />
                                    {/* <Card.Body>
                                        <Card.Title className="project-title">{image.title}</Card.Title>
                                        <Card.Text className="project-description">{image.description}</Card.Text>
                                    </Card.Body> */}
                                    {/* <Card.Footer className="text-end">
                                        <small className="text-muted">${image.price.toLocaleString()}</small>
                                    </Card.Footer> */}
                                </Card>
                            </Col>
                        ))}
                    </Row>
                </Col>
            </Row>
        </div>
    );
};

export default Gallery;