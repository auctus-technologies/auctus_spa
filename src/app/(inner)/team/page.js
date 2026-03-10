"use client"
import React, { useEffect } from 'react';
import BackToTop from "@/components/common/BackToTop";
import FooterOne from "@/components/footer/FooterOne";
import HeaderTwo from "@/components/header/HeaderTwo";
import CtaOne from "@/components/cta/CtaOne";
import FaqOne from "@/components/faq/FaqOne";
import Testimonials from "@/components/testimonials/Testimonials";
import AOS from "aos";
import "aos/dist/aos.css";
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



            <>
                <div className="rts-career-banner-area rts-section-gap">
                    <div className="container">
                        <div className="row">
                            <div className="col-lg-5">
                                <div className="career-banner-wrapper">
                                    <h1 className="title">Meet Our CreativeTeam Members</h1>
                                    <p className="disc">
                                        Our team is a group of skilled and dedicated professionals who
                                        bring their expertise, creativity, and commitment to every
                                        project. We believe that great work stems from collaboration
                                    </p>
                                </div>
                            </div>
                            <div className="col-lg-7 mt_md--30 mt_sm--30">
                                <div
                                    className="thumbnail-top wow scaleIn"
                                    data-wow-delay=".1s"
                                    data-wow-duration=".5s"
                                >
                                    <img src="assets/images/team/01.webp" alt="career" />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                {/* rts team area start */}
                <div className="rts-team-area rts-section-gapBottom">
                    <div className="container mb--50">
                        <div className="row">
                            <div className="col-lg-12">
                                <div className="title-team-left">
                                    <h2 className="title">Leadership Team</h2>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="container">
                        <div className="row g-5">
                            <div
                                className="col-lg-3 col-md-6 col-sm-12" data-aos="fade-up"
                            >
                                <div className="single-team-style-one">
                                    <a href="#" className="thumbnail">
                                        <img src="assets/images/team/02.webp" alt="team" />
                                    </a>
                                    <div className="inner-content">
                                        <a href="#">
                                            <h3 className="title">Daniel Brown</h3>
                                        </a>
                                        <span className="deg">Chief Executive Officer</span>
                                    </div>
                                </div>
                            </div>
                            <div
                                className="col-lg-3 col-md-6 col-sm-12" data-aos="fade-up" data-aos-delay="300"
                            >
                                <div className="single-team-style-one">
                                    <a href="#" className="thumbnail">
                                        <img src="assets/images/team/03.webp" alt="team" />
                                    </a>
                                    <div className="inner-content">
                                        <a href="#">
                                            <h3 className="title">Christopher Henry</h3>
                                        </a>
                                        <span className="deg">Marketing Director</span>
                                    </div>
                                </div>
                            </div>
                            <div
                                className="col-lg-3 col-md-6 col-sm-12" data-aos="fade-up" data-aos-delay="500"
                            >
                                <div className="single-team-style-one">
                                    <a href="#" className="thumbnail">
                                        <img src="assets/images/team/04.webp" alt="team" />
                                    </a>
                                    <div className="inner-content">
                                        <a href="#">
                                            <h3 className="title">John Smith</h3>
                                        </a>
                                        <span className="deg">Senior Developer</span>
                                    </div>
                                </div>
                            </div>
                            <div
                                className="col-lg-3 col-md-6 col-sm-12" data-aos="fade-up" data-aos-delay="700"
                            >
                                <div className="single-team-style-one">
                                    <a href="#" className="thumbnail">
                                        <img src="assets/images/team/05.webp" alt="team" />
                                    </a>
                                    <div className="inner-content">
                                        <a href="#">
                                            <h3 className="title">Gabriel Benjamin</h3>
                                        </a>
                                        <span className="deg">IT Specialist</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                {/* rts team area end */}
                {/* rts team area start */}
                <div className="rts-team-area rts-section-gapBottom">
                    <div className="container mb--50">
                        <div className="row">
                            <div className="col-lg-12">
                                <div className="title-team-left">
                                    <h2 className="title">Luminos Team Member</h2>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="container">
                        <div className="row g-5">
                            <div
                                className="col-lg-3 col-md-6 col-sm-12" data-aos="fade-up" data-aos-delay="100"
                            >
                                <div className="single-team-style-one" >
                                    <a href="#" className="thumbnail">
                                        <img src="assets/images/team/02.webp" alt="team" />
                                    </a>
                                    <div className="inner-content">
                                        <a href="#">
                                            <h3 className="title">Daniel Brown</h3>
                                        </a>
                                        <span className="deg">Chief Executive Officer</span>
                                    </div>
                                </div>
                            </div>
                            <div
                                className="col-lg-3 col-md-6 col-sm-12" data-aos="fade-up" data-aos-delay="300"
                            >
                                <div className="single-team-style-one">
                                    <a href="#" className="thumbnail">
                                        <img src="assets/images/team/03.webp" alt="team" />
                                    </a>
                                    <div className="inner-content">
                                        <a href="#">
                                            <h3 className="title">Christopher Henry</h3>
                                        </a>
                                        <span className="deg">Marketing Director</span>
                                    </div>
                                </div>
                            </div>
                            <div
                                className="col-lg-3 col-md-6 col-sm-12" data-aos="fade-up" data-aos-delay="500"
                            >
                                <div className="single-team-style-one">
                                    <a href="#" className="thumbnail">
                                        <img src="assets/images/team/04.webp" alt="team" />
                                    </a>
                                    <div className="inner-content">
                                        <a href="#">
                                            <h3 className="title">John Smith</h3>
                                        </a>
                                        <span className="deg">Senior Developer</span>
                                    </div>
                                </div>
                            </div>
                            <div
                                className="col-lg-3 col-md-6 col-sm-12" data-aos="fade-up" data-aos-delay="700"
                            >
                                <div className="single-team-style-one">
                                    <a href="#" className="thumbnail">
                                        <img src="assets/images/team/05.webp" alt="team" />
                                    </a>
                                    <div className="inner-content">
                                        <a href="#">
                                            <h3 className="title">Gabriel Benjamin</h3>
                                        </a>
                                        <span className="deg">IT Specialist</span>
                                    </div>
                                </div>
                            </div>
                            <div
                                className="col-lg-3 col-md-6 col-sm-12" data-aos="fade-up" data-aos-delay="300"
                            >
                                <div className="single-team-style-one">
                                    <a href="#" className="thumbnail">
                                        <img src="assets/images/team/04.webp" alt="team" />
                                    </a>
                                    <div className="inner-content">
                                        <a href="#">
                                            <h3 className="title">John Smith</h3>
                                        </a>
                                        <span className="deg">Senior Developer</span>
                                    </div>
                                </div>
                            </div>
                            <div
                                className="col-lg-3 col-md-6 col-sm-12" data-aos="fade-up" data-aos-delay="500"
                            >
                                <div className="single-team-style-one">
                                    <a href="#" className="thumbnail">
                                        <img src="assets/images/team/05.webp" alt="team" />
                                    </a>
                                    <div className="inner-content">
                                        <a href="#">
                                            <h3 className="title">Gabriel Benjamin</h3>
                                        </a>
                                        <span className="deg">IT Specialist</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                {/* rts team area end */}
                <Testimonials />
                <FaqOne />
            </>




            <CtaOne />
            <FooterOne />
            <BackToTop />
        </div>
    );
}
