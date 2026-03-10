"use client"
import React from 'react'
import Link from 'next/link';
import { ReactSVG } from 'react-svg';
function FooterTwo() {
    return (
        <div>
            {/* rts call to action area start */}
            <div className="rts-call-to-action-area">
                <div className="container">
                    <div className="row">
                        <div className="col-lg-12">
                            <div className="cta-two-wrapper">
                                <div className="inner">
                                    <h2 className="title">Let’s schedule a Free consultation</h2>
                                    <p>
                                        Offers a 30-day free trial of Luminouss Managed IT Services.
                                    </p>
                                    <Link
                                        href="/contact"
                                        className="rts-btn btn-primary wow fadeInUp"
                                        data-wow-delay=".5s"
                                    >
                                        Schedule Now
                                        <ReactSVG
                                            src="assets/images/service/icons/13.svg"
                                            alt="arrow"
                                        />
                                    </Link>
                                </div>
                                <div className="shape-area">
                                    <img
                                        src="assets/images/cta/05.png"
                                        alt="cta"
                                        className="one wow toBottomLeft"
                                    />
                                    <img
                                        src="assets/images/cta/06.png"
                                        alt="cta"
                                        className="two wow toTopRight"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            {/* rts call to action area end */}
            {/* rts footer area start */}
            <div className="rts-footer-area rts-section-gapTop pb--80">
                <div className="container">
                    <div className="row">
                        <div className="col-lg-5 col-md-12">
                            <div className="logo-area">
                                <Link href="#" className="logo">
                                    <img src="assets/images/logo/logo-1.svg" alt="logo" />
                                </Link>
                                <p className="disc">
                                    Luminous is a leading IT solutions company that provides
                                    innovative technology services to businesses of all sizes.
                                </p>
                            </div>
                        </div>
                        <div className="col-lg-7">
                            <div className="row g-5">
                                <div className="col-lg-3 col-md-6 col-sm-6 col-12">
                                    <div className="single-nav-area-footer">
                                        <p className="parent">Services</p>
                                        <ul>
                                            <li>
                                                <Link href="/technologies-service">Technologies</Link>
                                            </li>
                                            <li>
                                                <Link href="/ai-learning-service">Ai Learning</Link>
                                            </li>
                                            <li>
                                                <Link href="/it-strategies">IT Strategies</Link>
                                            </li>
                                            <li>
                                                <Link href="/it-consulting-service">It Consulting</Link>
                                            </li>
                                            <li>
                                                <Link href="/management-service">Management</Link>
                                            </li>
                                            <li>
                                                <Link href="/service-single">Cloud Migration</Link>
                                            </li>
                                        </ul>
                                    </div>
                                </div>
                                <div className="col-lg-3 col-md-6 col-sm-6 col-12">
                                    <div className="single-nav-area-footer">
                                        <p className="parent">Company</p>
                                        <ul>
                                            <li>
                                                <Link href="/about">About us</Link>
                                            </li>
                                            <li>
                                                <Link href="/career">Careers</Link>
                                            </li>
                                            <li>
                                                <Link href="/team">Our Team</Link>
                                            </li>
                                            <li>
                                                <Link href="/blog-grid">News</Link>
                                            </li>
                                            <li>
                                                <Link href="/partner">Partner</Link>
                                            </li>
                                            <li>
                                                <Link href="/contact">Contact</Link>
                                            </li>
                                        </ul>
                                    </div>
                                </div>
                                <div className="col-lg-3 col-md-6 col-sm-6 col-12">
                                    <div className="single-nav-area-footer">
                                        <p className="parent">Industrys</p>
                                        <ul>
                                            <li>
                                                <Link href="/construction-industry">Construction</Link>
                                            </li>
                                            <li>
                                                <Link href="/healthcare-industry">Healthcare</Link>
                                            </li>
                                            <li>
                                                <Link href="/ecommerce-industry">Ecommerce</Link>
                                            </li>
                                            <li>
                                                <Link href="/fintech-industry">Fintech</Link>
                                            </li>
                                            <li>
                                                <Link href="/logistic-industry">Logistic</Link>
                                            </li>
                                            <li>
                                                <Link href="/travel-industry">Travel Industry</Link>
                                            </li>
                                        </ul>
                                    </div>
                                </div>
                                <div className="col-lg-3 col-md-6 col-sm-6 col-12">
                                    <div className="single-nav-area-footer">
                                        <p className="parent">Legal</p>
                                        <ul>
                                            <li>
                                                <Link href="/terms-of-use">Terms</Link>
                                            </li>
                                            <li>
                                                <Link href="/privacy-policy">Privacy</Link>
                                            </li>
                                            <li>
                                                <Link href="/cookies-policy">Cookies</Link>
                                            </li>
                                            <li>
                                                <Link href="/faq">Faqs</Link>
                                            </li>
                                            <li>
                                                <Link href="/free-consultation">Consultation</Link>
                                            </li>
                                            <li>
                                                <Link href="/contact">Contact</Link>
                                            </li>
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            {/* rts footer area end */}
            {/* rts copyright area start */}
            <div className="rts-copyright-area-one">
                <div className="container">
                    <div className="row">
                        <div className="col-lg-12">
                            <div className="copyright-wrapper">
                                <p>© 2024 Luminos. All rights reserved.</p>
                                <div className="social-copyright-area">
                                    <ul>
                                        <li aria-label="Visit our Facebook page">
                                            <Link href="/#">
                                                <i className="fa-brands fa-facebook-f" />
                                            </Link>
                                        </li>
                                        <li aria-label="Visit our Twitter page">
                                            <Link href="/#">
                                                <i className="fa-brands fa-twitter" />
                                            </Link>
                                        </li>
                                        <li aria-label="Visit our Youtube page">
                                            <Link href="/#">
                                                <i className="fa-brands fa-youtube" />
                                            </Link>
                                        </li>
                                        <li aria-label="Visit our Linkedin page">
                                            <Link href="/#">
                                                <i className="fa-brands fa-linkedin" />
                                            </Link>
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            {/* rts copyright area end */}

        </div>
    )
}

export default FooterTwo