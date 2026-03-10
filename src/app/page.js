"use client"
import BannerOne from "@/components/banner/BannerOne";
import BackToTop from "@/components/common/BackToTop";
import CtaOne from "@/components/cta/CtaOne";
import Project from "@/components/casestudies/Project";
import FooterOne from "@/components/footer/FooterOne";
import HeaderTwo from "@/components/header/HeaderTwo";
import ServiceTwo from "@/components/services/ServiceTwo";
import { useEffect } from "react";
import AOS from "aos";
import "aos/dist/aos.css";
import AboutOne from "@/components/about/AboutOne";


export default function Home() {
    useEffect(() => {
        AOS.init({
            disableMutationObserver: true,
            once: true,
        });
    }, []);
    return (
        <div className='#'>
            <HeaderTwo />
            <BannerOne />
            <ServiceTwo />
            <AboutOne />
            <>
                <div className="rts-solution-area rts-section-gap2Bottom rts-section-gapTop">
                    <div className="container">
                        <div className="row">
                            <div className="col-lg-12">
                                <div className="text-center-title-bg-white">
                                    <h2 className="title">Our Process</h2>
                                    <p>Comprehensive technology solutions tailored to your business needs</p>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="container-consulting mt--80 mt_sm--30">
                        <div className="row">
                            <div className="col-lg-12">
                                <div className="consulting-step">
                                    <div className="timeline-line" />
                                    <div className="single-consulting-one">
                                        <div className="thumbnail">
                                            <img src="assets/images/process/01.jpg" alt="consulting" />
                                        </div>
                                        <div className="right-area">
                                            <h4 className="title">Requirement Discussion</h4>
                                            <p>
                                                Understanding your business <br /> requirements and objectives.
                                            </p>
                                        </div>
                                        <div className="timeline-dot">
                                            <div className="time-line-circle" />
                                        </div>
                                    </div>
                                    <div className="single-consulting-one">
                                        <div className="thumbnail">
                                            <img src="assets/images/process/02.jpg" alt="consulting" />
                                        </div>
                                        <div className="right-area">
                                            <h4 className="title">Planning & Design</h4>
                                            <p>
                                                Creating detailed project plans <br /> and design specifications.
                                            </p>
                                        </div>
                                        <div className="timeline-dot">
                                            <div className="time-line-circle" />
                                        </div>
                                    </div>
                                    <div className="single-consulting-one">
                                        <div className="thumbnail">
                                            <img src="assets/images/process/03.jpg" alt="consulting" />
                                        </div>
                                        <div className="right-area">
                                            <h4 className="title">Development</h4>
                                            <p>Building and implementing the solution.</p>
                                        </div>
                                        <div className="timeline-dot">
                                            <div className="time-line-circle" />
                                        </div>
                                    </div>
                                    <div className="single-consulting-one">
                                        <div className="thumbnail">
                                            <img src="assets/images/process/04.jpg" alt="consulting" />
                                        </div>
                                        <div className="right-area">
                                            <h4 className="title">Testing</h4>
                                            <p>Quality assurance and performance validation.</p>
                                        </div>
                                        <div className="timeline-dot">
                                            <div className="time-line-circle" />
                                        </div>
                                    </div>
                                    <div className="single-consulting-one">
                                        <div className="thumbnail">
                                            <img src="assets/images/process/05.jpg" alt="consulting" />
                                        </div>
                                        <div className="right-area">
                                            <h4 className="title">Launch & Support</h4>
                                            <p>
                                                Deployment and ongoing maintenance support.
                                            </p>
                                        </div>
                                        <div className="timeline-dot">
                                            <div className="time-line-circle" />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </>

            <Project />

            <div className="keybenefits-area rts-section-gap2Bottom">
                <div className="container">
                    <div className="row">
                        <div className="col-lg-12">
                            <div className="text-center-title-bg-white">
                                <h2 className="title">Our Technologies</h2>
                                <p>Cutting-edge technologies powering modern digital solutions</p>
                            </div>
                        </div>
                    </div>
                    <div className="row g-0 mt--40">
                        <div className="col-lg-3" data-aos-duration="1000" data-aos-delay="100">
                            <div className="single-benefits-area-wrapper bg-light">
                                <div className="icon">
                                    <img src="assets/images/technologies/01.svg" alt="benefits" />
                                </div>
                                <h5 className="title">AWS</h5>
                            </div>
                        </div>
                        <div className="col-lg-3" data-aos-duration="1000" data-aos-delay="200">
                            <div className="single-benefits-area-wrapper">
                                <div className="icon">
                                    <img src="assets/images/technologies/02.svg" alt="benefits" />
                                </div>
                                <h5 className="title">HTML/CSS</h5>
                            </div>
                        </div>
                        <div className="col-lg-3" data-aos-duration="1000" data-aos-delay="300">
                            <div className="single-benefits-area-wrapper bg-light">
                                <div className="icon">
                                    <img src="assets/images/technologies/03.svg" alt="benefits" />
                                </div>
                                <h5 className="title">Python</h5>
                            </div>
                        </div>
                        <div className="col-lg-3" data-aos-duration="1000" data-aos-delay="400">
                            <div className="single-benefits-area-wrapper">
                                <div className="icon">
                                    <img src="assets/images/technologies/04.svg" alt="benefits" />
                                </div>
                                <h5 className="title">Django</h5>
                            </div>
                        </div>
                        <div className="col-lg-3" data-aos-duration="1000" data-aos-delay="100">
                            <div className="single-benefits-area-wrapper">
                                <div className="icon">
                                    <img src="assets/images/technologies/05.svg" alt="benefits" />
                                </div>
                                <h5 className="title">Next.js</h5>
                            </div>
                        </div>
                        <div className="col-lg-3" data-aos-duration="1000" data-aos-delay="200">
                            <div className="single-benefits-area-wrapper  bg-light">
                                <div className="icon">
                                    <img src="assets/images/technologies/06.svg" alt="benefits" />
                                </div>
                                <h5 className="title">Flutter</h5>
                            </div>
                        </div>
                        <div className="col-lg-3" data-aos-duration="1000" data-aos-delay="300">
                            <div className="single-benefits-area-wrapper">
                                <div className="icon">
                                    <img src="assets/images/technologies/07.svg" alt="benefits" />
                                </div>
                                <h5 className="title">PostgreSQL</h5>
                            </div>
                        </div>
                        <div className="col-lg-3" data-aos-duration="1000" data-aos-delay="400">
                            <div className="single-benefits-area-wrapper  bg-light">
                                <div className="icon">
                                    <img src="assets/images/technologies/08.svg" alt="benefits" />
                                </div>
                                <h5 className="title">Figma</h5>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            {/* Why Choose Us Section */}
            <div className="luminos-solution-key-feature rts-section-gapTop rts-section-gap2Bottom">
                <div className="container">
                    <div className="row">
                        <div className="col-lg-5">
                            <div className="luminos-main-solutioin-key">
                                <h3 className="title">Choose Auctus for:</h3>
                                <div className="check-wrapper">
                                    <div className="single-check">
                                        <img src="assets/images/service/01.svg" alt="service" />
                                        <p>Modern Web Development</p>
                                    </div>
                                    <div className="single-check">
                                        <img src="assets/images/service/01.svg" alt="service" />
                                        <p>Mobile App Solutions</p>
                                    </div>
                                    <div className="single-check">
                                        <img src="assets/images/service/01.svg" alt="service" />
                                        <p>AI & Automation Tools</p>
                                    </div>
                                    <div className="single-check">
                                        <img src="assets/images/service/01.svg" alt="service" />
                                        <p>End-to-End Technical Support</p>
                                    </div>
                                </div>
                                <div className="tag-wrapper">
                                    <div className="single-tag">
                                        <span>Website</span>
                                    </div>
                                    <div className="single-tag">
                                        <span>AI Bots</span>
                                    </div>
                                    <div className="single-tag">
                                        <span>Tech Support</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="col-lg-7">
                            <div className="thumbnail-main-wrapper-choose-us">
                                <img src="assets/images/service/09.webp" alt="service" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <CtaOne />
            <FooterOne />
            <BackToTop />
        </div>
    );
}
