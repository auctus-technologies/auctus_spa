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
                    <div className="service-single-area-banner hosting-deployment-service bg_image jarallax"></div>
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
                                        <h1 className="title">Hosting & Deployment</h1>
                                        <p className="disc">
                                            We provide reliable cloud hosting solutions and automated deployment pipelines that ensure your applications run smoothly, scale effortlessly, and remain secure 24/7.
                                        </p>
                                    </div>
                                    <div className="mid-content">
                                        <p className="disc">
                                            At Auctus, we manage the complete infrastructure lifecycle for your applications. From initial server setup to ongoing maintenance, we handle the technical complexities so you can focus on your business. We work with leading cloud providers including AWS, Google Cloud, and Azure to deliver hosting solutions that match your performance requirements and budget.
                                        </p>
                                        <p className="disc">
                                            Our deployment automation uses CI/CD pipelines to streamline your release process. Every code change undergoes automated testing before deployment, reducing the risk of production issues. We implement blue-green deployments and rollback strategies to ensure zero-downtime updates for your critical applications.
                                        </p>
                                        <p className="disc">
                                            Security and monitoring are integral to our hosting services. We configure firewalls, SSL certificates, and access controls to protect your infrastructure. Our monitoring systems track application performance, server health, and security events in real-time, with alerts that ensure rapid response to any issues.
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
                                        src="https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=1200&auto=format&fit=crop&q=80"
                                        alt="Cloud Infrastructure"
                                    />
                                </div>
                            </div>
                            <div className="col-lg-6">
                                <div className="thumbnail-area-large-service-detaile-mid jarallax jara-mask-1">
                                    <img
                                        className="jarallax-img"
                                        src="https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=1200&auto=format&fit=crop&q=80"
                                        alt="Server Room"
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
                                            We specialize in containerized deployments using Docker and Kubernetes for scalable, portable applications. Our serverless solutions help reduce costs for variable workloads, while traditional VM-based hosting remains available for legacy applications. We design architecture that scales automatically with your traffic demands.
                                        </p>
                                        <p className="disc">
                                            Database management is part of our hosting services. We configure and optimize MySQL, PostgreSQL, MongoDB, and other databases for performance and reliability. Our backup strategies ensure your data is protected with automated daily backups and point-in-time recovery options.
                                        </p>
                                        <p className="disc">
                                            Based in Chennai, we offer local expertise combined with global infrastructure standards. Whether you need shared hosting for a startup website or dedicated infrastructure for enterprise applications, we deliver hosting solutions that are reliable, cost-effective, and built for growth.
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
                                <h2 className="title">Host With Confidence</h2>
                                <p className="disc">
                                    Ready to deploy your application? Let's set up reliable hosting and automated deployment that keeps your business running smoothly.
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
