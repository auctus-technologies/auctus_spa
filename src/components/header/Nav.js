"use client"
import React from 'react'
import Link from 'next/link';
import { ReactSVG } from 'react-svg';
function Nav() {
    return (
        <div>
            <div className="nav-area">
                <nav>
                    <ul>
                        <li>
                            <Link className="nav-link" href="/">
                                Home
                            </Link>
                        </li>
                        <li>
                            <Link className="nav-link" href="/about">
                                About
                            </Link>
                        </li>
                        <li className="has-dropdown position-static with-megamenu">
                            <Link className="nav-link" href="/service">
                                Service{" "}
                                <i className="fa-duotone fa-regular fa-chevron-down" />
                            </Link>
                            <div className="submenu">
                                <div className="container">
                                    <div className="row">
                                        <div className="col-lg-3">
                                            <ul className="single-menu parent-nav">
                                                <li>
                                                    <Link
                                                        className="single-service-area-wrapper"
                                                        href="/web-development-service"
                                                    >
                                                        <div className="icon">
                                                            <img
                                                                src="/assets/images/service/icons/46.svg"
                                                                alt="service"
                                                            />
                                                        </div>
                                                        <div className="info">
                                                            <h4 className="title">Web Development</h4>
                                                            <p>Custom websites, dashboards<br/>& scalable web applications.</p>
                                                        </div>
                                                    </Link>
                                                </li>
                                                <li>
                                                    <Link
                                                        className="single-service-area-wrapper"
                                                        href="/mobile-app-development-service"
                                                    >
                                                        <div className="icon">
                                                            <img
                                                                src="/assets/images/service/icons/47.svg"
                                                                alt="service"
                                                            />
                                                        </div>
                                                        <div className="info">
                                                            <h4 className="title">Mobile App Development</h4>
                                                            <p>Native & cross-platform apps<br/>for Android & iOS devices.</p>
                                                        </div>
                                                    </Link>
                                                </li>
                                            </ul>
                                        </div>
                                        <div className="col-lg-3">
                                            <ul className="single-menu parent-nav">
                                                <li>
                                                    <Link
                                                        className="single-service-area-wrapper"
                                                        href="/ecommerce-development-service"
                                                    >
                                                        <div className="icon">
                                                            <img
                                                                src="/assets/images/service/icons/48.svg"
                                                                alt="service"
                                                            />
                                                        </div>
                                                        <div className="info">
                                                            <h4 className="title">E-Commerce Development</h4>
                                                            <p>Online stores with<br/>payment integration.</p>
                                                        </div>
                                                    </Link>
                                                </li>
                                                <li>
                                                    <Link
                                                        className="single-service-area-wrapper"
                                                        href="/hosting-deployment-service"
                                                    >
                                                        <div className="icon">
                                                            <img
                                                                src="/assets/images/service/icons/49.svg"
                                                                alt="service"
                                                            />
                                                        </div>
                                                        <div className="info">
                                                            <h4 className="title">Hosting & Deployment</h4>
                                                            <p>Cloud hosting, server setup<br/>& automated deployment.</p>
                                                        </div>
                                                    </Link>
                                                </li>
                                            </ul>
                                        </div>
                                        <div className="col-lg-3">
                                            <ul className="single-menu parent-nav">
                                                <li>
                                                    <Link
                                                        className="single-service-area-wrapper"
                                                        href="/bot-development-service"
                                                    >
                                                        <div className="icon">
                                                            <img
                                                                src="/assets/images/service/icons/50.svg"
                                                                alt="service"
                                                            />
                                                        </div>
                                                        <div className="info">
                                                            <h4 className="title">Bot Development</h4>
                                                            <p>AI chatbots & custom<br/>automation workflows.</p>
                                                        </div>
                                                    </Link>
                                                </li>
                                                <li>
                                                    <Link
                                                        className="single-service-area-wrapper"
                                                        href="/ui-ux-design-service"
                                                    >
                                                        <div className="icon">
                                                            <img
                                                                src="/assets/images/service/icons/51.svg"
                                                                alt="service"
                                                            />
                                                        </div>
                                                        <div className="info">
                                                            <h4 className="title">UI/UX Design</h4>
                                                            <p>Modern interface design<br/>& user experience optimization.</p>
                                                        </div>
                                                    </Link>
                                                </li>
                                            </ul>
                                        </div>
                                        <div className="col-lg-3">
                                            <ul className="single-menu parent-nav">
                                                <li>
                                                    <Link
                                                        className="single-service-area-wrapper"
                                                        href="/api-development-service"
                                                    >
                                                        <div className="icon">
                                                            <img
                                                                src="/assets/images/service/icons/52.svg"
                                                                alt="service"
                                                            />
                                                        </div>
                                                        <div className="info">
                                                            <h4 className="title">API Development & Integration</h4>
                                                            <p>REST APIs, third-party<br/>integrations & backend.</p>
                                                        </div>
                                                    </Link>
                                                </li>
                                                <li>
                                                    <Link
                                                        className="single-service-area-wrapper"
                                                        href="/tech-support-service"
                                                    >
                                                        <div className="icon">
                                                            <img
                                                                src="/assets/images/service/icons/53.svg"
                                                                alt="service"
                                                            />
                                                        </div>
                                                        <div className="info">
                                                            <h4 className="title">Tech Support & Maintenance</h4>
                                                            <p>Monitoring, bug fixes<br/>& technical support.</p>
                                                        </div>
                                                    </Link>
                                                </li>
                                            </ul>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </li>
                        <li>
                            <Link className="nav-link" href="/career">
                                Career
                            </Link>
                        </li>
                        <li>
                            <Link className="nav-link" href="/contact">
                                Contact
                            </Link>
                        </li>
                    </ul>
                </nav>
            </div>
        </div>
    )
}

export default Nav