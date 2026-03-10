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
                    <div className="service-single-area-banner web-development-service bg_image jarallax"></div>
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
                                        <h1 className="title">Web Development</h1>
                                        <p className="disc">
                                            We build modern, scalable web applications using cutting-edge technologies that help businesses grow their digital presence and engage customers effectively.
                                        </p>
                                    </div>
                                    <div className="mid-content">
                                        <p className="disc">
                                            At Auctus, we specialize in crafting custom web solutions tailored to your business needs. From responsive corporate websites to complex web applications, our team delivers robust, user-friendly solutions that drive results. We leverage modern frameworks like React, Next.js, and Node.js to ensure your web presence is fast, secure, and scalable.
                                        </p>
                                        <p className="disc">
                                            Our development process emphasizes clean code, performance optimization, and responsive design. Whether you need a simple landing page, an e-commerce platform, or a sophisticated dashboard, we approach each project with attention to detail and a focus on achieving your business objectives. We work closely with startups and established businesses in Chennai and beyond.
                                        </p>
                                        <p className="disc">
                                            Security and maintainability are at the core of our development practices. We implement best practices for data protection, follow SEO guidelines, and ensure your website performs well across all devices. Our solutions are built to evolve with your business, making future enhancements seamless.
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
                                        src="https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=1200&auto=format&fit=crop&q=80"
                                        alt="Web Development Workspace"
                                    />
                                </div>
                            </div>
                            <div className="col-lg-6">
                                <div className="thumbnail-area-large-service-detaile-mid jarallax jara-mask-1">
                                    <img
                                        className="jarallax-img"
                                        src="https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=1200&auto=format&fit=crop&q=80"
                                        alt="Web Application Development"
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
                                            Our expertise spans across frontend and backend development. We create intuitive user interfaces with React and modern CSS frameworks, while our backend solutions using Node.js and Python ensure reliable data handling and API integration. Every project undergoes rigorous testing before deployment.
                                        </p>
                                        <p className="disc">
                                            We understand that every business has unique requirements. Our team takes time to understand your goals, target audience, and technical needs before proposing a solution. This collaborative approach ensures the final product aligns perfectly with your vision and delivers measurable business value.
                                        </p>
                                        <p className="disc">
                                            Based in Chennai, we combine local market understanding with global technology standards. Our developers stay current with industry trends to deliver solutions that are not just functional today, but future-ready for tomorrow's digital landscape.
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
                                <h2 className="title">Start Your Web Project</h2>
                                <p className="disc">
                                    Ready to build your digital presence? Let's discuss your web development needs and create a solution that drives your business forward.
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
