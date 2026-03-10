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
                    <div className="service-single-area-banner tech-support-service bg_image jarallax"></div>
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
                                        <h1 className="title">Tech Support & Maintenance</h1>
                                        <p className="disc">
                                            We provide reliable ongoing support, proactive monitoring, and regular maintenance to keep your applications running smoothly, secure, and up-to-date with evolving requirements.
                                        </p>
                                    </div>
                                    <div className="mid-content">
                                        <p className="disc">
                                            At Auctus, we understand that launching an application is just the beginning. Our tech support and maintenance services ensure your digital products continue to perform optimally long after deployment. We offer flexible support plans tailored to your needs, from occasional assistance to dedicated 24/7 coverage for critical business systems.
                                        </p>
                                        <p className="disc">
                                            Our maintenance services cover everything your application needs to stay healthy. We handle security updates, dependency upgrades, performance optimization, and bug fixes. Our team monitors your systems for issues before they impact users, applying patches and improvements during low-traffic windows to minimize disruption to your business.
                                        </p>
                                        <p className="disc">
                                            When issues do arise, our support team responds quickly with clear communication and effective solutions. We provide multiple support channels including ticketing systems, email, and phone for urgent matters. Every issue is tracked, analyzed, and documented to prevent recurrence and build institutional knowledge about your systems.
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
                                        src="https://images.unsplash.com/photo-1531482615713-2afd69097998?w=1200&auto=format&fit=crop&q=80"
                                        alt="Technical Support Team"
                                    />
                                </div>
                            </div>
                            <div className="col-lg-6">
                                <div className="thumbnail-area-large-service-detaile-mid jarallax jara-mask-1">
                                    <img
                                        className="jarallax-img"
                                        src="https://images.unsplash.com/photo-1553877522-43269d4ea984?w=1200&auto=format&fit=crop&q=80"
                                        alt="System Maintenance"
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
                                            We provide comprehensive system monitoring using modern tools that track uptime, performance metrics, error rates, and security events. Our dashboards give you visibility into your application health, while our alerting systems ensure we know about problems immediately. We generate regular reports on system performance, incidents, and improvement recommendations.
                                        </p>
                                        <p className="disc">
                                            Our maintenance includes database optimization, log management, backup verification, and disaster recovery testing. We help you plan for growth by identifying scalability bottlenecks and recommending infrastructure improvements. When you're ready to add new features, our familiarity with your codebase enables faster, safer development.
                                        </p>
                                        <p className="disc">
                                            Based in Chennai, we offer local support with global standards. Our clients range from startups needing occasional help to enterprises requiring dedicated support teams. Whether you need help with an application we built or support for existing systems, we bring technical expertise, clear communication, and genuine commitment to your success.
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
                                <h2 className="title">Stay Running Smoothly</h2>
                                <p className="disc">
                                    Need reliable support for your applications? Let's discuss a maintenance plan that keeps your systems secure and performing at their best.
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
