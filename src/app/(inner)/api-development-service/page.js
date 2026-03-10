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
                    <div className="service-single-area-banner api-development-service bg_image jarallax"></div>
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
                                        <h1 className="title">API Development & Integration</h1>
                                        <p className="disc">
                                            We build robust REST APIs and seamless integrations that connect your systems, enable data flow, and power your applications with reliable backend services.
                                        </p>
                                    </div>
                                    <div className="mid-content">
                                        <p className="disc">
                                            At Auctus, we develop APIs that serve as the backbone of modern applications. Whether you need a public API for third-party developers, internal APIs for microservices, or integration with external platforms, we create solutions that are secure, well-documented, and built for scale. We work with Node.js, Python, and other technologies to match your technical requirements.
                                        </p>
                                        <p className="disc">
                                            Our API development follows industry best practices including RESTful design principles, proper HTTP status codes, versioning strategies, and comprehensive documentation. We implement authentication using JWT, OAuth, or API keys based on your security needs. Every API we build includes rate limiting, input validation, and error handling to ensure reliability under production loads.
                                        </p>
                                        <p className="disc">
                                            Integration is where our expertise truly shines. We connect applications with payment gateways, CRMs, ERPs, marketing tools, and custom third-party systems. Our team handles the complexities of data mapping, transformation, and synchronization to ensure information flows seamlessly between platforms without manual intervention.
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
                                        src="https://images.unsplash.com/photo-1555949963-aa79dcee981c?w=1200&auto=format&fit=crop&q=80"
                                        alt="API Code Development"
                                    />
                                </div>
                            </div>
                            <div className="col-lg-6">
                                <div className="thumbnail-area-large-service-detaile-mid jarallax jara-mask-1">
                                    <img
                                        className="jarallax-img"
                                        src="https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=1200&auto=format&fit=crop&q=80"
                                        alt="System Integration"
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
                                            We specialize in webhook implementations, real-time data streaming, and batch processing for high-volume scenarios. Our solutions support various data formats including JSON, XML, and GraphQL when appropriate. We design APIs with caching strategies and database optimization to deliver fast response times.
                                        </p>
                                        <p className="disc">
                                            Security is paramount in API development. We implement HTTPS, CORS policies, request signing, and payload encryption as needed. Our APIs undergo security testing to identify vulnerabilities before deployment. We also help clients achieve compliance with standards like GDPR and SOC 2 when handling sensitive data.
                                        </p>
                                        <p className="disc">
                                            Based in Chennai, we serve businesses across India and internationally. Whether you're building a new API from scratch, modernizing legacy integrations, or need help with complex multi-system orchestration, we bring technical depth and practical experience to ensure your integrations work reliably.
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
                                <h2 className="title">Connect Your Systems</h2>
                                <p className="disc">
                                    Ready to build powerful APIs or integrate your platforms? Let's create connections that drive your business forward.
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
