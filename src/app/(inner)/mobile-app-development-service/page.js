import BackToTop from "@/components/common/BackToTop";
import FooterOne from "@/components/footer/FooterOne";
import HeaderTwo from "@/components/header/HeaderTwo";
import FeatureTwo from "@/components/feature/FeatureTwo";
import MoreSolutions from "@/components/service-component/MoreSolution";

export default function Home() {
    return (
        <div className='#'>
            <HeaderTwo />
            <div>
                <div className="container-large">
                    {/* service area start */}
                    <div className="service-single-area-banner mobile-app-development-service bg_image jarallax"></div>
                    {/* service area end */}
                </div>

            </div>
            <div>

                <div className="service-area-details-wrapper">
                    <div className="container">
                        <div className="row">
                            <div className="col-lg-12">
                                <div className="inner-content">
                                    <div className="top">
                                        <h1 className="title">Mobile App Development</h1>
                                        <p className="disc">
                                            We build native and cross-platform mobile applications that deliver seamless user experiences across iOS and Android devices, helping businesses connect with their customers on the go.
                                        </p>
                                    </div>
                                    <div className="mid-content">
                                        <p className="disc">
                                            At Auctus, we develop mobile applications that combine intuitive design with powerful functionality. Whether you need a native iOS app using Swift, an Android solution with Kotlin, or a cross-platform application using React Native or Flutter, our team delivers apps that perform exceptionally across all devices.
                                        </p>
                                        <p className="disc">
                                            Our mobile development process starts with understanding your users and business goals. We create wireframes and prototypes to validate ideas early, then move to development with a focus on clean architecture and responsive interfaces. Every app we build undergoes thorough testing for performance, security, and usability before launch.
                                        </p>
                                        <p className="disc">
                                            We handle the complete app lifecycle from concept to deployment on the App Store and Google Play. Our solutions include backend integration, API connectivity, push notifications, and ongoing maintenance to ensure your app stays current with platform updates and user expectations.
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
                                        src="https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=1200&auto=format&fit=crop&q=80"
                                        alt="Mobile App Development"
                                    />
                                </div>
                            </div>
                            <div className="col-lg-6">
                                <div className="thumbnail-area-large-service-detaile-mid jarallax jara-mask-1">
                                    <img
                                        className="jarallax-img"
                                        src="https://images.unsplash.com/photo-1551650975-87deedd944c3?w=1200&auto=format&fit=crop&q=80"
                                        alt="Smartphone Applications"
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
                                        <p className="disc">
                                            Our expertise covers both native and cross-platform development. Native apps provide the best performance and access to platform-specific features, while cross-platform solutions offer faster development and cost efficiency. We help you choose the right approach based on your requirements, timeline, and budget.
                                        </p>
                                        <p className="disc">
                                            We integrate essential mobile features like biometric authentication, offline capabilities, real-time synchronization, and analytics. Our apps are built with scalability in mind, allowing your mobile presence to grow alongside your business. We also ensure compliance with platform guidelines and data protection regulations.
                                        </p>
                                        <p className="disc">
                                            Based in Chennai, we serve clients across India and internationally. Our team stays updated with the latest mobile technologies and platform updates to deliver apps that feel modern and perform reliably. From MVPs for startups to enterprise mobile solutions, we bring technical expertise and practical business insight to every project.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>


            </div>
            <MoreSolutions />
            <FeatureTwo />
            <>
                {/* rts call to action area start */}
                <div className="rts-call-to-action-area-about rts-section-gapTop">
                    <div className="container">
                        <div className="row">
                            <div className="col-lg-12">
                                <h2 className="title">Build Your Mobile App</h2>
                                <p className="disc">
                                    Ready to reach your customers on mobile? Let's discuss your app idea and create a solution that drives engagement and growth.
                                </p>
                                <a
                                    href="/contact"
                                    className="rts-btn btn-primary wow fadeInUp"
                                    data-wow-delay=".5s"
                                >
                                    Get in Touch
                                    <img
                                        className="injectable"
                                        src="assets/images/service/icons/13.svg"
                                        alt="arrow"
                                    />
                                </a>
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
