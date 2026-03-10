"use client";

import Link from 'next/link';
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";
import "swiper/css";

export default function MoreSolutions() {
    const solutions = [
        {
            icon: "/assets/images/service/icons/46.svg",
            title: "Web Development",
            description: "Custom websites, dashboards & scalable web applications.",
            href: "/web-development-service",
        },
        {
            icon: "/assets/images/service/icons/47.svg",
            title: "Mobile App Development",
            description: "Native & cross-platform apps for Android & iOS devices.",
            href: "/mobile-app-development-service",
        },
        {
            icon: "/assets/images/service/icons/48.svg",
            title: "E-Commerce Development",
            description: "Online stores with payment integration.",
            href: "/ecommerce-development-service",
        },
        {
            icon: "/assets/images/service/icons/49.svg",
            title: "Hosting & Deployment",
            description: "Cloud hosting, server setup & automated deployment.",
            href: "/hosting-deployment-service",
        },
        {
            icon: "/assets/images/service/icons/50.svg",
            title: "Bot Development",
            description: "AI chatbots & custom automation workflows.",
            href: "/bot-development-service",
        },
        {
            icon: "/assets/images/service/icons/51.svg",
            title: "UI/UX Design",
            description: "Modern interface design & user experience optimization.",
            href: "/ui-ux-design-service",
        },
        {
            icon: "/assets/images/service/icons/52.svg",
            title: "API Development & Integration",
            description: "REST APIs, third-party integrations & backend.",
            href: "/api-development-service",
        },
        {
            icon: "/assets/images/service/icons/53.svg",
            title: "Tech Support & Maintenance",
            description: "Monitoring, bug fixes & technical support.",
            href: "/tech-support-service",
        },
    ];

    return (
        <div className="rts-solution-area rts-section-gapTop">
            <div className="container">
                <div className="row">
                    <div className="col-lg-12">
                        <div className="title-center-style-two">
                            <h2 className="title">More solutions..</h2>
                        </div>
                    </div>
                </div>
                <div className="row g-5 mt--30">
                    <div className="float-right-style">
                        {/* Swiper Wrapper */}
                        <Swiper
                            modules={[Autoplay]}
                            slidesPerView={3.8}
                            spaceBetween={30}
                            loop={true}
                            speed={1000}
                            autoplay={{
                                delay: 1000,
                                disableOnInteraction: false,
                            }}
                            breakpoints={{
                                320: {
                                    slidesPerView: 1,
                                    spaceBetween: 25,
                                },
                                768: {
                                    slidesPerView: 2,
                                    spaceBetween: 25,
                                },
                                980: {
                                    slidesPerView: 3,
                                    spaceBetween: 25,
                                },
                                1280: {
                                    slidesPerView: 3.8,
                                    spaceBetween: 25,
                                },
                            }}
                            className="mySwiper-service-inenr"
                        >
                            {solutions.map((solution, index) => (
                                <SwiperSlide key={index}>
                                    <div className="single-service-style-two">
                                        <div className="inner">
                                            <div className="icon">
                                                <img src={solution.icon} alt={solution.title} />
                                            </div>
                                            <div className="bottom">
                                                <Link href={solution.href}>
                                                    <h3 className="title animated fadeIn">
                                                        {solution.title}
                                                        <img
                                                            src="/assets/images/service/icons/13.svg"
                                                            alt="service"
                                                        />
                                                    </h3>
                                                    <p className="disc">{solution.description}</p>
                                                </Link>
                                            </div>
                                        </div>
                                    </div>
                                </SwiperSlide>
                            ))}
                        </Swiper>
                    </div>
                </div>
            </div>
        </div>
    );
}
