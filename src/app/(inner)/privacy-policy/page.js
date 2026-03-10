
import BackToTop from "@/components/common/BackToTop";
import FooterOne from "@/components/footer/FooterOne";
import HeaderTwo from "@/components/header/HeaderTwo";
import FeatureTwo from "@/components/feature/FeatureTwo";
import ServiceSingle from "@/components/banner-service/ServiceSingle";
import TestimonialsFive from "@/components/testimonials/TestimonialsFive";
import CtaFour from "@/components/cta/CtaFour";
import MoreSolutions from "@/components/service-component/MoreSolution";

export default function Home() {
    return (
        <div className='#'>
            <HeaderTwo />
            <ServiceSingle />
            <div>

                <div className="service-area-details-wrapper">
                    <div className="container">
                        <div className="row">
                            <div className="col-lg-12">
                                <div className="inner-content">
                                    <div className="top">
                                        <h1 className="title">Privacy Policy</h1>
                                        <p className="disc">
                                            At Auctus, we respect your privacy and are committed to protecting your personal data. This Privacy Policy explains how we collect, use, and safeguard your information.
                                        </p>
                                    </div>
                                    <div className="mid-content">
                                        <h4>1. Information We Collect</h4>
                                        <p className="disc">
                                            We collect information you provide directly to us, including name, email address, phone number, and company details when you contact us or request our services. We also collect technical data such as IP addresses, browser type, and usage patterns when you visit our website.
                                        </p>
                                        <h4>2. How We Use Your Information</h4>
                                        <p className="disc">
                                            We use your information to respond to inquiries, provide our services, improve our website, send relevant updates, and comply with legal obligations. We do not sell or rent your personal data to third parties.
                                        </p>
                                        <h4>3. Data Security</h4>
                                        <p className="disc">
                                            We implement appropriate technical and organizational measures to protect your data against unauthorized access, alteration, or destruction. Our systems are regularly monitored and updated to maintain security standards.
                                        </p>
                                        <h4>4. Cookies and Tracking</h4>
                                        <p className="disc">
                                            Our website uses cookies to enhance user experience and analyze traffic. You can modify your browser settings to decline cookies, though this may affect certain functionalities of our site.
                                        </p>
                                        <h4>5. Third-Party Services</h4>
                                        <p className="disc">
                                            We may use trusted third-party services for hosting, analytics, and communication. These providers have access to limited data necessary to perform their functions and are obligated to protect your information.
                                        </p>
                                        <h4>6. Your Rights</h4>
                                        <p className="disc">
                                            You have the right to access, correct, or delete your personal data. To exercise these rights or for any privacy-related concerns, please contact us at auctustech.cnn@gmail.com.
                                        </p>
                                        <h4>7. Updates to This Policy</h4>
                                        <p className="disc">
                                            We may update this Privacy Policy periodically. Changes will be posted on this page with the updated effective date. We encourage you to review this policy regularly.
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
                <div className="service-image-mid-iamge-jarallax-area">
                    <div className="container-large">
                        <div className="row g-5">
                            <div className="col-lg-6">
                                <div className="thumbnail-area-large-service-detaile-mid jarallax jara-mask-1">
                                    <img
                                        className="jarallax-img"
                                        src="https://images.unsplash.com/photo-1563986768609-322da13575f3?w=1200&auto=format&fit=crop&q=80"
                                        alt="Data Security"
                                    />
                                </div>
                            </div>
                            <div className="col-lg-6">
                                <div className="thumbnail-area-large-service-detaile-mid jarallax jara-mask-1">
                                    <img
                                        className="jarallax-img"
                                        src="https://images.unsplash.com/photo-1553877522-43269d4ea984?w=1200&auto=format&fit=crop&q=80"
                                        alt="Privacy Protection"
                                    />
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
                                    <div className="mid-content">
                                        <h4>Data Retention</h4>
                                        <p className="disc">
                                            We retain your personal information only for as long as necessary to fulfill the purposes outlined in this Privacy Policy, unless a longer retention period is required by law. Project-related data is retained according to our contractual obligations with clients.
                                        </p>
                                        <h4>International Transfers</h4>
                                        <p className="disc">
                                            As a Chennai-based company, your data is primarily processed in India. If we transfer data internationally, we ensure appropriate safeguards are in place to protect your information in compliance with applicable data protection laws.
                                        </p>
                                        <h4>Children's Privacy</h4>
                                        <p className="disc">
                                            Our services are not directed to individuals under 16. We do not knowingly collect personal data from children. If you believe we have inadvertently collected such information, please contact us immediately.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>


            </div>

            <CtaFour />
            <FooterOne />
            <BackToTop />
        </div>
    );
}
