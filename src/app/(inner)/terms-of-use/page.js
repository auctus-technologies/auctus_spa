"use client"
import BackToTop from "@/components/common/BackToTop";
import FooterOne from "@/components/footer/FooterOne";
import HeaderTwo from "@/components/header/HeaderTwo";
import Link from 'next/link';
export default function Home() {
    return (
        <div className='#'>
            <HeaderTwo />

            <>
                <div className="container-large">
                    {/* service area start */}
                    <div
                        className="service-single-area-banner terms-service-banner bg_image jarallax"
                        data-jarallax="1.5"
                    ></div>
                    {/* service area end */}
                </div>
                <div className="service-area-details-wrapper">
                    <div className="container">
                        <div className="row">
                            <div className="col-lg-12">
                                <div className="inner-content">
                                    <div className="top">
                                        <h1 className="title">Terms of Use</h1>
                                        <p className="disc">
                                            Please read these Terms of Use carefully before engaging with Auctus. By accessing our website or using our services, you agree to these terms.
                                        </p>
                                    </div>
                                    <div className="mid-content">
                                        <h4>1. Acceptance of Terms</h4>
                                        <p className="disc">
                                            By accessing or using the Auctus website and services, you agree to be bound by these Terms of Use. If you do not agree to these terms, please do not use our services. We reserve the right to modify these terms at any time, and such modifications shall be effective immediately upon posting.
                                        </p>
                                        <h4>2. Services Description</h4>
                                        <p className="disc">
                                            Auctus provides technology services including web development, mobile app development, e-commerce solutions, hosting & deployment, bot development, UI/UX design, API development, and technical support. All services are subject to separate service agreements and project scopes agreed upon with clients.
                                        </p>
                                        <h4>3. Intellectual Property</h4>
                                        <p className="disc">
                                            All content on this website, including text, graphics, logos, and images, is the property of Auctus and protected by copyright laws. Upon project completion and full payment, clients receive ownership rights to custom deliverables as specified in their service agreement. Third-party components remain subject to their respective licenses.
                                        </p>
                                        <h4>4. User Responsibilities</h4>
                                        <p className="disc">
                                            Users agree to provide accurate information when contacting us or requesting services. You are responsible for maintaining the confidentiality of any account credentials and for all activities under your account. You agree not to use our services for any unlawful purpose or in any way that could damage our reputation.
                                        </p>
                                        <h4>5. Payment Terms</h4>
                                        <p className="disc">
                                            Payment terms are specified in individual service agreements. Generally, we require an advance payment before commencing work, with remaining payments due at project milestones or upon completion. Late payments may result in project delays or suspension of services.
                                        </p>
                                        <h4>6. Limitation of Liability</h4>
                                        <p className="disc">
                                            Auctus shall not be liable for any indirect, incidental, special, or consequential damages arising from the use of our services or website. Our total liability shall not exceed the amount paid by the client for the specific service giving rise to the liability.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="service-area-details-wrapper border-bottom">
                    <div className="container">
                        <div className="row">
                            <div className="col-lg-12">
                                <div className="inner-content">
                                    <div className="mid-content  pt--0">
                                        <h4>7. Confidentiality</h4>
                                        <p className="disc">
                                            We respect the confidentiality of your business information. Any proprietary information shared during project discussions or execution will be kept confidential and not disclosed to third parties without your consent, except as required by law.
                                        </p>
                                        <h4>8. Project Changes & Revisions</h4>
                                        <p className="disc">
                                            Project scope changes requested after agreement signing may incur additional costs. We typically include a specified number of revision rounds in our service agreements. Additional revisions beyond the agreed scope will be billed separately.
                                        </p>
                                        <h4>9. Termination</h4>
                                        <p className="disc">
                                            Either party may terminate a service agreement with written notice. Upon termination, the client is responsible for payment for all work completed up to the termination date. Deposits may be refundable only if no work has commenced, at our discretion.
                                        </p>
                                        <h4>10. Governing Law</h4>
                                        <p className="disc">
                                            These Terms of Use shall be governed by and construed in accordance with the laws of India. Any disputes arising from these terms shall be subject to the exclusive jurisdiction of the courts in Chennai, Tamil Nadu.
                                        </p>
                                        <p className="disc">
                                            <strong>Effective Date:</strong> March 2024<br/>
                                            <strong>Contact:</strong> Auctus, 116/1, 3rd Floor, Dr. Natesan Road, Jagadambal Colony, Othavadi, Mylapore, Chennai, Tamil Nadu, India<br/>
                                            <strong>Email:</strong> auctustech.cnn@gmail.com<br/>
                                            <strong>Phone:</strong> +91 95004 98565
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                {/* rts call to action area start */}
                <div className="rts-call-to-action-area-about rts-section-gapTop">
                    <div className="container pb--80">
                        <div className="row">
                            <div className="col-lg-12">
                                <h2 className="title">Have Questions?</h2>
                                <p className="disc">
                                    Contact us to discuss your project requirements and how Auctus can help bring your ideas to life.
                                </p>
                                <Link
                                    href="/contact"
                                    className="rts-btn btn-primary wow fadeInUp"
                                    data-wow-delay=".5s"
                                >
                                    Get in Touch
                                    <img
                                        src="assets/images/service/icons/13.svg"
                                        alt="arrow"
                                    />
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </>



            <FooterOne />
            <BackToTop />
        </div>
    );
}
