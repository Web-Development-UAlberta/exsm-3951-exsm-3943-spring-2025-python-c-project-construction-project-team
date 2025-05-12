
import { Link } from 'react-router-dom';
import KitchenImage from "../../assets/kitchen-hero-image.jpg";
import BathroomImage from "../../assets/bathroom-hero-image.jpg";
import BasementImage from "../../assets/basement-hero-image.jpg";
import HomeAdditionImage from "../../assets/home-addition-hero-image.jpg";
import LogoImage from "../../assets/logo-square.svg";
import './Home.css';

const Home = () => {
    return (
        <div>
            {/* Hero Section */}
            <div className="hero-section bg-light mb-5">
                <div className="row g-0">
                    <div className="col-md-8 p-5 d-flex flex-column justify-content-center">
                        <h1 className="display-4 fw-bold mb-4">Your home transformation begins here</h1>
                        <p className="lead mb-4">
                            Lorem ipsum dolor sit amet consectetur.
                            Phasellus tellus lacus integer lectus adipiscing
                            porttitor senectus amet pulvinar.
                        </p>
                        <div>
                            <Link to="/rfq" className="btn btn-dark px-4 py-2 rounded-1">
                                Request A Quote
                            </Link>
                        </div>
                    </div>
                    <div className="col-md-4">
                        <div
                            className="h-100 w-100"
                            style={{
                                backgroundImage: `url(${LogoImage})`,
                                backgroundPosition: 'center',
                                backgroundSize: 'contain',
                                backgroundRepeat: 'no-repeat'
                            }}
                        ></div>
                    </div>
                </div>
            </div>

            {/* Services Section */}
            <div className="services-section mb-5">
                <h2 className="text-center mb-5">Browse Services</h2>

                <div className="d-flex justify-content-around">
                    {/* Kitchen Remodels */}
                    <div >
                        <Link to="/service" className="text-decoration-none text-dark">
                            <div className="service-card bg-light p-4 text-center">
                                <img src={KitchenImage} alt="kitchen" height="160" />
                                <h3 className="h5 mt-3">Kitchen Remodels</h3>
                            </div>
                        </Link>
                    </div>

                    {/* Bathroom Renovations */}
                    <div >
                        <Link to="/service" className="text-decoration-none text-dark">
                            <div className="service-card bg-light p-4 text-center">
                                <img src={BathroomImage} alt="bathroom" height="160" />
                                <h3 className="h5 mt-3">Bathroom Renovations</h3>
                            </div>
                        </Link>
                    </div>

                    {/* Basement Finishings */}
                    <div >
                        <Link to="/service" className="text-decoration-none text-dark">
                            <div className="service-card bg-light p-4 text-center">
                                <img src={BasementImage} alt="basement" height="160" />
                                <h3 className="h5 mt-3">Basement Finishings</h3>
                            </div>
                        </Link>
                    </div>

                    {/* Home Additions */}
                    <div >
                        <Link to="/service" className="text-decoration-none text-dark">
                            <div className="service-card bg-light p-4 text-center">
                                <img src={HomeAdditionImage} alt="basement" height="160" />
                                <h3 className="h5 mt-3">Home Additions</h3>
                            </div>
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Home;