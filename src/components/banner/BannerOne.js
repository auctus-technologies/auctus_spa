"use client";
import React from "react";
import { useEffect } from "react";
import Rellax from "rellax";
import AOS from "aos";
import { ReactSVG } from 'react-svg';
import "aos/dist/aos.css";
function BannerOne() {
    useEffect(() => {
        if (typeof window !== "undefined") {
            new Rellax(".rellax", { speed: -1 });
        }
    }, []);
    useEffect(() => {
        AOS.init({
            disableMutationObserver: true,
            once: true,
        });
    }, []);
    return (
        <div>
            <div className="rts-banner-area-start">
                <div className="container">
                    <div className="row align-items-center">
                        {/* Left Content */}
                        <div className="col-lg-5">
                            <div className="banner-wrapper-one">
                                <span className="pre-title" data-aos="fade-up" data-aos-duration="1000">Meet Auctus</span>
                                <h2 className="title" data-aos="fade-up" data-aos-duration="1000" data-aos-delay="300">
                                    Building Smart <br /> Web & Mobile <span>Solutions</span>
                                </h2>
                                <p data-aos="fade-up" data-aos-delay="500">
                                    We help businesses and startups build websites, mobile apps, automation bots, and scalable tech solutions.
                                </p>
                                <a
                                    href="service.html"
                                    className="rts-btn btn-primary" data-aos="fade-up" data-aos-duration="1000" data-aos-delay="700"
                                >
                                    View Solutions
                                    <ReactSVG
                                        className="injectable"
                                        src="assets/images/banner/01.svg"
                                        alt="icons"
                                    />
                                </a>
                            </div>
                        </div>

                        {/* Right Content */}
                        <div className="col-lg-7">
                            <div className="right-clippath-wrapper d-flex">
                                <div
                                    className="left-image mt--120 mt_sm--70 jara-mask-1"
                                    data-speed=".7"
                                >
                                    <img
                                        loading="lazy"
                                        rel="preload"
                                        className="jarallax-img rellax"
                                        src="assets/images/banner/08.webp"
                                        alt="banner"
                                    />
                                </div>
                                <div
                                    className="left-image jara-mask-1"
                                    data-speed=".7"
                                >
                                    <img
                                        loading="lazy"
                                        rel="preload"
                                        className="jarallax-img rellax"
                                        src="assets/images/banner/09.webp"
                                        alt="banner"
                                    />
                                </div>
                                <div className="shape-image">
                                    <img
                                        loading="lazy"
                                        rel="preload"
                                        src="assets/images/banner/shape/01.png"
                                        alt="shape"
                                        className="one wow move-left"
                                    />
                                    <img
                                        loading="lazy"
                                        rel="preload"
                                        src="assets/images/banner/shape/02.png"
                                        alt="shape"
                                        className="two wow move-left"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default BannerOne;
