"use client"
import Link from 'next/link';
import React, { useEffect } from 'react';
import AOS from "aos";
function ServiceTwo() {
    useEffect(() => {
        AOS.init({
            disableMutationObserver: true,
            once: true,
        });
    }, []);
    return (
        <div>
            {/* solution area start */}
            <div className="rts-solution-area rts-section-gapTop rts-section-gap2Bottom">
                <div className="container">
                    <div className="row">
                        <div className="col-lg-12">
                             <div className="text-center-title-bg-white">
                                <h2 className="title">Our Services</h2>
                                <p>Comprehensive technology solutions tailored to your business needs</p>
                            </div>
                        </div>
                    </div>
                    <div className="row g-5 mt--30">
                        <div
                            className="col-lg-3 col-md-6 col-sm-12" data-aos="fade-up" data-aos-delay="100"
                        >
                            {/* signle service area start */}
                            <div className="single-service-style-two">
                                <div className="inner">
                                    <div className="icon">
                                        <img src="assets/images/service/icons/46.svg" alt="service" />
                                    </div>
                                    <div className="bottom">
                                        <Link href="/web-development-service">
                                            <h3 className="title">
                                                Web <br /> Development
                                                <img
                                                    className="injectable"
                                                    src="assets/images/service/icons/13.svg"
                                                    alt="service"
                                                />
                                            </h3>
                                            <p className="disc">
                                                Custom websites, dashboards, and scalable web applications.
                                            </p>
                                        </Link>
                                    </div>
                                </div>
                            </div>
                            {/* single service end */}
                        </div>
                        <div
                            className="col-lg-3 col-md-6 col-sm-12" data-aos="fade-up" data-aos-delay="300"
                        >
                            {/* signle service area start */}
                            <div className="single-service-style-two">
                                <div className="inner">
                                    <div className="icon">
                                        <img src="assets/images/service/icons/47.svg" alt="service" />
                                    </div>
                                    <div className="bottom">
                                        <Link href="/mobile-app-development-service">
                                            <h3 className="title">
                                                Mobile App <br /> Development
                                                <img
                                                    className="injectable"
                                                    src="assets/images/service/icons/13.svg"
                                                    alt="service"
                                                />
                                            </h3>
                                            <p className="disc">
                                                Native and cross-platform mobile apps for Android & iOS.
                                            </p>
                                        </Link>
                                    </div>
                                </div>
                            </div>
                            {/* single service end */}
                        </div>
                        <div
                            className="col-lg-3 col-md-6 col-sm-12" data-aos="fade-up" data-aos-delay="500"
                        >
                            {/* signle service area start */}
                            <div className="single-service-style-two">
                                <div className="inner">
                                    <div className="icon">
                                        <img src="assets/images/service/icons/48.svg" alt="service" />
                                    </div>
                                    <div className="bottom">
                                        <Link href="/ecommerce-development-service">
                                            <h3 className="title">
                                                E-Commerce <br /> Development
                                                <img
                                                    className="injectable"
                                                    src="assets/images/service/icons/13.svg"
                                                    alt="service"
                                                />
                                            </h3>
                                            <p className="disc">
                                                Online stores with payment and product management.
                                            </p>
                                        </Link>
                                    </div>
                                </div>
                            </div>
                            {/* single service end */}
                        </div>
                        <div
                            className="col-lg-3 col-md-6 col-sm-12" data-aos="fade-up" data-aos-delay="100"
                        >
                            {/* signle service area start */}
                            <div className="single-service-style-two">
                                <div className="inner">
                                    <div className="icon">
                                        <img src="assets/images/service/icons/49.svg" alt="service" />
                                    </div>
                                    <div className="bottom">
                                        <Link href="/hosting-deployment-service">
                                            <h3 className="title">
                                                Hosting & <br /> Deployment
                                                <img
                                                    className="injectable"
                                                    src="assets/images/service/icons/13.svg"
                                                    alt="service"
                                                />
                                            </h3>
                                            <p className="disc">
                                                Cloud hosting, server setup, and automated deployment pipelines.
                                            </p>
                                        </Link>
                                    </div>
                                </div>
                            </div>
                            {/* single service end */}
                        </div>
                        <div
                            className="col-lg-3 col-md-6 col-sm-12" data-aos="fade-up" data-aos-delay="300"
                        >
                            {/* signle service area start */}
                            <div className="single-service-style-two">
                                <div className="inner">
                                    <div className="icon">
                                        <img src="assets/images/service/icons/50.svg" alt="service" />
                                    </div>
                                    <div className="bottom">
                                        <Link href="/bot-development-service">
                                            <h3 className="title">
                                                Bot <br /> Development
                                                <img
                                                    className="injectable"
                                                    src="assets/images/service/icons/13.svg"
                                                    alt="service"
                                                />
                                            </h3>
                                            <p className="disc">
                                                AI chatbots and custom automation for business workflows.
                                            </p>
                                        </Link>
                                    </div>
                                </div>
                            </div>
                            {/* single service end */}
                        </div>
                        <div
                            className="col-lg-3 col-md-6 col-sm-12" data-aos="fade-up" data-aos-delay="500"
                        >
                            {/* signle service area start */}
                            <div className="single-service-style-two">
                                <div className="inner">
                                    <div className="icon">
                                        <img src="assets/images/service/icons/51.svg" alt="service" />
                                    </div>
                                    <div className="bottom">
                                        <Link href="/ui-ux-design-service">
                                            <h3 className="title">
                                                UI/UX <br /> Design
                                                <img
                                                    className="injectable"
                                                    src="assets/images/service/icons/13.svg"
                                                    alt="service"
                                                />
                                            </h3>
                                            <p className="disc">
                                                Modern interface design and user experience optimization.
                                            </p>
                                        </Link>
                                    </div>
                                </div>
                            </div>
                            {/* single service end */}
                        </div>
                        <div
                            className="col-lg-3 col-md-6 col-sm-12" data-aos="fade-up" data-aos-delay="100"
                        >
                            {/* signle service area start */}
                            <div className="single-service-style-two">
                                <div className="inner">
                                    <div className="icon">
                                        <img src="assets/images/service/icons/52.svg" alt="service" />
                                    </div>
                                    <div className="bottom">
                                        <Link href="/api-development-service">
                                            <h3 className="title">
                                                API Development & Integration
                                                <img
                                                    className="injectable"
                                                    src="assets/images/service/icons/13.svg"
                                                    alt="service"
                                                />
                                            </h3>
                                            <p className="disc">
                                                REST APIs, third-party integrations, and backend services.
                                            </p>
                                        </Link>
                                    </div>
                                </div>
                            </div>
                            {/* single service end */}
                        </div>
                        <div
                            className="col-lg-3 col-md-6 col-sm-12" data-aos="fade-up" data-aos-delay="300"
                        >
                            {/* signle service area start */}
                            <div className="single-service-style-two">
                                <div className="inner">
                                    <div className="icon">
                                        <img src="assets/images/service/icons/53.svg" alt="service" />
                                    </div>
                                    <div className="bottom">
                                        <Link href="/tech-support-service">
                                            <h3 className="title">
                                                Tech Support & <br /> Maintenance
                                                <img
                                                    className="injectable"
                                                    src="assets/images/service/icons/13.svg"
                                                    alt="service"
                                                />
                                            </h3>
                                            <p className="disc">
                                                Monitoring, bug fixes, upgrades, and ongoing technical support.
                                            </p>
                                        </Link>
                                    </div>
                                </div>
                            </div>
                            {/* single service end */}
                        </div>
                        {/* <div className="col-lg-12 d-flex justify-content-center mt--80">
                            <a href="service.html" className="btn-bold rts-btn btn-border ">
                                View all solutions
                                <ReactSVG
                                    src="assets/images/service/icons/13.svg"
                                    alt="arrow"
                                />
                            </a>
                        </div> */}
                    </div>
                </div>
            </div>
            {/* solution area end */}


        </div>
    )
}

export default ServiceTwo