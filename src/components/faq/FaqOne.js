"use client"
import React from 'react'
import Accordion from 'react-bootstrap/Accordion';
import Link from 'next/link';

function FaqOne() {
    return (
        <div>
            <>
                {/* commercial faq area */}
                <div className="professional-faq-area rts-section-gap position-relative">
                    <div className="shape-top">
                        <img
                            loading="lazy"
                            rel="preload"
                            src="assets/images/video/shape/01.png"
                            alt=""
                            className="wow move-right"
                            data-wow-offset={120}
                        />
                    </div>
                    <div className="container">
                        <div className="row">
                            <div className="col-lg-12">
                                <div className="text-center-title-bg-white">
                                    <h2 className="title" style={{ fontSize: 40 }}>
                                        Frequently Asked Questions
                                    </h2>
                                    <p>
                                        Find answers to common questions about our services, process, and how we can help bring your project to life.
                                    </p>
                                </div>
                            </div>
                        </div>
                        <div className="row mt--80">
                            <div className="col-lg-12">
                                <div className="accordion-container-one">

                                    <Accordion defaultActiveKey="0">
                                        <Accordion.Item eventKey="0">
                                            <Accordion.Header>What services does Auctus offer?</Accordion.Header>
                                            <Accordion.Body>
                                                Auctus provides comprehensive technology services including Web Development, Mobile App Development (iOS & Android), E-Commerce Solutions, Hosting & Deployment, Bot Development, UI/UX Design, API Development & Integration, and Technical Support & Maintenance. We handle projects from concept to deployment.
                                            </Accordion.Body>
                                        </Accordion.Item>
                                        <Accordion.Item eventKey="1">
                                            <Accordion.Header>How much does a typical project cost?</Accordion.Header>
                                            <Accordion.Body>
                                                Project costs vary based on scope, complexity, and timeline. We provide custom quotes after understanding your requirements. Typically, we require an advance payment to begin work, with subsequent payments at agreed milestones. Contact us for a free consultation and detailed estimate.
                                            </Accordion.Body>
                                        </Accordion.Item>
                                        <Accordion.Item eventKey="2">
                                            <Accordion.Header>What technologies do you specialize in?</Accordion.Header>
                                            <Accordion.Body>
                                                We work with modern, proven technologies including React, Next.js, Node.js, Python, Flutter, React Native, AWS, MongoDB, PostgreSQL, and more. Our tech stack is chosen based on project requirements to ensure scalability, performance, and maintainability.
                                            </Accordion.Body>
                                        </Accordion.Item>
                                        <Accordion.Item eventKey="3">
                                            <Accordion.Header>How long does it take to complete a project?</Accordion.Header>
                                            <Accordion.Body>
                                                Timelines depend on project complexity. A simple website may take 2-4 weeks, while complex applications can take 3-6 months or more. We provide detailed timelines during the planning phase and keep you updated throughout the development process.
                                            </Accordion.Body>
                                        </Accordion.Item>
                                        <Accordion.Item eventKey="4">
                                            <Accordion.Header>Do you provide ongoing support after project completion?</Accordion.Header>
                                            <Accordion.Body>
                                                Yes, we offer various support and maintenance packages. This includes bug fixes, security updates, performance monitoring, feature enhancements, and technical support. We ensure your application remains secure and up-to-date after launch.
                                            </Accordion.Body>
                                        </Accordion.Item>
                                        <Accordion.Item eventKey="5">
                                            <Accordion.Header>How do I get started with Auctus?</Accordion.Header>
                                            <Accordion.Body>
                                                Getting started is easy. Simply reach out to us via email at auctustech.cnn@gmail.com or call +91 95004 98565. We'll schedule a free consultation to discuss your requirements, provide recommendations, and outline the next steps for your project.
                                            </Accordion.Body>
                                        </Accordion.Item>
                                    </Accordion>
                                </div>
                            </div>
                        </div>
                        <div className="row mt--80">
                            <div className="col-lg-12 text-center">
                                <p>
                                    Still have a question?{" "}
                                    <Link
                                        href="/contact"
                                        style={{ color: "var(--color-primary)" }}
                                    >
                                        Contact us
                                    </Link>
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
                {/* commercial faq area end */}
            </>

        </div>
    )
}

export default FaqOne