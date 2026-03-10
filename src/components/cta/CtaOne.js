"use client"
import React, { useEffect } from 'react';
// import SVGInject from 'svg-injector';
import AOS from "aos";
import "aos/dist/aos.css";
import { ReactSVG } from 'react-svg';
function CtaOne() {
    // useEffect(() => {
    //     // SVGInject will inject SVGs in images with the class 'injectable'
    //     SVGInject(document.querySelectorAll("img.injectable"));
    // }, []); // Empty dependency array means it runs once when the component mounts
    useEffect(() => {
        AOS.init({
            disableMutationObserver: true,
            once: true,
        });
    }, []);
    return (
        <div>

            {/* rts cta area start */}
            <div className="rts-cts-area" data-aos="zoom-in" data-aos-delay="300">
                <div className="container">
                    <div className="row">
                        <div className="col-gl-12">
                            <div className="cta-one-wrapper">
                                <div className="shape-area">
                                    <img
                                        loading="lazy"
                                        rel="preload"
                                        src="assets/images/cta/02.png"
                                        alt="cta-area"
                                    />
                                </div>
                                <div className="left-area">
                                    <h3 className="title wow fadeInUp" data-wow-delay=".1s">
                                        Transform Your Ideas into Digital Reality
                                    </h3>
                                    <p className="wow fadeInUp" data-wow-delay=".3s">
                                        Partner with Auctus to build modern digital solutions that drive your business forward. 
                                        From web development to AI automation, we help businesses grow with cutting-edge technology.
                                    </p>
                                    <a
                                        href="tel:+919500498565"
                                        className="rts-btn btn-primary wow fadeInUp"
                                        data-wow-delay=".5s"
                                    >
                                        Call Us Now
                                        <ReactSVG
                                            src="assets/images/service/icons/13.svg"
                                            alt="arrow"
                                        />
                                    </a>
                                </div>
                                <div className="right wow move-out" data-wow-offset={140}>
                                    <img
                                        src="assets/images/cta/01.png"
                                        alt=""
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            {/* rts cta area end */}

        </div>
    )
}

export default CtaOne