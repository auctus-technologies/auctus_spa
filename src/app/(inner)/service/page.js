
import BackToTop from "@/components/common/BackToTop";
import FooterOne from "@/components/footer/FooterOne";
import HeaderTwo from "@/components/header/HeaderTwo";
import CtaOne from "@/components/cta/CtaOne";
import Link from 'next/link';

export default function Home() {
    return (
        <div className='#'>
            <HeaderTwo />
            {/* banner area start */}
            <div className="career-single-banner-area ptb--80 mb--20 bg-light">
                <div className="container">
                    <div className="row">
                        <div className="col-lg-12">
                            <div className="career-page-single-banner center-aligh">
                                <span className="pre">Services</span>
                                <h1 className="title">Our Expert Solutions</h1>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* service area start */}
            <div className="service-main-wrapper-area-service pb--80">
                <div className="container">
                    <div className="row">
                        <div className="row g-5 mt--0">
                            <div
                                className="col-lg-3 mt--0 wow fadeInUp"
                                data-wow-offset={120}
                                data-wow-delay=".2s"
                            >
                                <div className="single-service-border-top">
                                    <div className="icon">
                                        <img src="assets/images/service/icons/31.svg" alt="service" />
                                    </div>
                                    <p className="disc">
                                        We build modern and scalable websites tailored to business needs,
                                        helping companies establish a strong and reliable digital presence.
                                    </p>
                                </div>
                            </div>

                            <div
                                className="col-lg-3 mt--0 wow fadeInUp"
                                data-wow-offset={120}
                                data-wow-delay=".4s"
                            >
                                <div className="single-service-border-top">
                                    <div className="icon">
                                        <img src="assets/images/service/icons/32.svg" alt="service" />
                                    </div>
                                    <p className="disc">
                                        Our team develops powerful mobile applications for Android and iOS,
                                        delivering smooth user experiences and high-performance solutions.
                                    </p>
                                </div>
                            </div>

                            <div
                                className="col-lg-3 mt--0 wow fadeInUp"
                                data-wow-offset={120}
                                data-wow-delay=".6s"
                            >
                                <div className="single-service-border-top">
                                    <div className="icon">
                                        <img src="assets/images/service/icons/33.svg" alt="service" />
                                    </div>
                                    <p className="disc">
                                        We provide secure cloud hosting and deployment solutions to ensure
                                        applications run reliably, scale easily, and remain accessible anytime.
                                    </p>
                                </div>
                            </div>

                            <div
                                className="col-lg-3 mt--0 wow fadeInUp"
                                data-wow-offset={120}
                                data-wow-delay=".8s"
                            >
                                <div className="single-service-border-top">
                                    <div className="icon">
                                        <img src="assets/images/service/icons/34.svg" alt="service" />
                                    </div>
                                    <p className="disc">
                                        From automation tools to AI-powered chatbots, we create smart bot
                                        solutions that streamline workflows and improve customer engagement.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            {/* service area end */}

            {/* service-we-provice-area start */}
            <div className="rts-service-provide-area rts-section-gap2">
                <div className="container-s-float">
                    <div className="row">
                        <div className="col-lg-12">

                            <div
                                className="single-service-list wow fadeInUp"
                                data-wow-offset={120}
                                data-wow-delay=".2s"
                            >
                                <div className="icon">
                                    <img src="assets/images/service/icons/46.svg" alt="service" />
                                </div>
                                <div className="main-information-area">
                                    <h3 className="title">Web Development</h3>
                                    <p className="disc">
                                        We build modern, scalable, and high-performance websites and web
                                        applications tailored to business needs using the latest technologies.
                                    </p>
                                </div>
                                <Link href="/web-development-service" className="arrow-btn">
                                    <img src="assets/images/service/icons/13.svg" alt="service" />
                                </Link>
                            </div>

                            <div
                                className="single-service-list wow fadeInUp"
                                data-wow-offset={120}
                                data-wow-delay=".4s"
                            >
                                <div className="icon">
                                    <img src="assets/images/service/icons/47.svg" alt="service" />
                                </div>
                                <div className="main-information-area">
                                    <h3 className="title">Mobile App Development</h3>
                                    <p className="disc">
                                        Our team develops powerful Android and iOS mobile applications with
                                        smooth performance and intuitive user experiences.
                                    </p>
                                </div>
                                <Link href="/mobile-app-development-service" className="arrow-btn">
                                    <img src="assets/images/service/icons/13.svg" alt="service" />
                                </Link>
                            </div>

                            <div
                                className="single-service-list wow fadeInUp"
                                data-wow-offset={120}
                                data-wow-delay=".6s"
                            >
                                <div className="icon">
                                    <img src="assets/images/service/icons/49.svg" alt="service" />
                                </div>
                                <div className="main-information-area">
                                    <h3 className="title">Hosting & Deployment</h3>
                                    <p className="disc">
                                        We provide secure cloud hosting, server configuration, and reliable
                                        deployment solutions to ensure your applications run smoothly.
                                    </p>
                                </div>
                                <Link href="/hosting-deployment-service" className="arrow-btn">
                                    <img src="assets/images/service/icons/13.svg" alt="service" />
                                </Link>
                            </div>

                            <div
                                className="single-service-list wow fadeInUp"
                                data-wow-offset={120}
                                data-wow-delay=".8s"
                            >
                                <div className="icon">
                                    <img src="assets/images/service/icons/50.svg" alt="service" />
                                </div>
                                <div className="main-information-area">
                                    <h3 className="title">AI Bot Development</h3>
                                    <p className="disc">
                                        We create intelligent automation bots and AI chatbots that help
                                        businesses improve efficiency and automate repetitive tasks.
                                    </p>
                                </div>
                                <Link href="/bot-development-service" className="arrow-btn">
                                    <img src="assets/images/service/icons/13.svg" alt="service" />
                                </Link>
                            </div>

                            <div
                                className="single-service-list wow fadeInUp"
                                data-wow-offset={120}
                                data-wow-delay="1s"
                            >
                                <div className="icon">
                                    <img src="assets/images/service/icons/51.svg" alt="service" />
                                </div>
                                <div className="main-information-area">
                                    <h3 className="title">UI / UX Design</h3>
                                    <p className="disc">
                                        Our design team creates clean, modern, and user-friendly interfaces
                                        that enhance user experience and product usability.
                                    </p>
                                </div>
                                <Link href="/ui-ux-design-service" className="arrow-btn">
                                    <img src="assets/images/service/icons/13.svg" alt="service" />
                                </Link>
                            </div>

                            <div
                                className="single-service-list wow fadeInUp"
                                data-wow-offset={120}
                                data-wow-delay="1.2s"
                            >
                                <div className="icon">
                                    <img src="assets/images/service/icons/52.svg" alt="service" />
                                </div>
                                <div className="main-information-area">
                                    <h3 className="title">API Development & Integration</h3>
                                    <p className="disc">
                                        We develop secure APIs and integrate third-party services to connect
                                        applications, automate workflows, and extend functionality.
                                    </p>
                                </div>
                                <Link href="/api-development-service" className="arrow-btn">
                                    <img src="assets/images/service/icons/13.svg" alt="service" />
                                </Link>
                            </div>

                            <div
                                className="single-service-list wow fadeInUp"
                                data-wow-offset={120}
                                data-wow-delay="1.4s"
                            >
                                <div className="icon">
                                    <img src="assets/images/service/icons/48.svg" alt="service" />
                                </div>
                                <div className="main-information-area">
                                    <h3 className="title">E-Commerce Development</h3>
                                    <p className="disc">
                                        We build powerful e-commerce platforms with secure payment systems,
                                        product management, and scalable online store solutions.
                                    </p>
                                </div>
                                <Link href="/ecommerce-development-service" className="arrow-btn">
                                    <img src="assets/images/service/icons/13.svg" alt="service" />
                                </Link>
                            </div>

                            <div
                                className="single-service-list wow fadeInUp"
                                data-wow-offset={120}
                                data-wow-delay="1.6s"
                            >
                                <div className="icon">
                                    <img src="assets/images/service/icons/53.svg" alt="service" />
                                </div>
                                <div className="main-information-area">
                                    <h3 className="title">Tech Support & Maintenance</h3>
                                    <p className="disc">
                                        We provide ongoing technical support, bug fixing, monitoring, and
                                        maintenance services to keep your applications running smoothly.
                                    </p>
                                </div>
                                <Link href="/tech-support-service" className="arrow-btn">
                                    <img src="assets/images/service/icons/13.svg" alt="service" />
                                </Link>
                            </div>

                        </div>
                    </div>
                </div>
            </div>
            {/* service-we-provice-area end */}

            <>
                <div className="rts-solution-area rts-section-gap2Bottom rts-section-gapTop">
                    <div className="container">
                        <div className="row">
                            <div className="col-lg-12">
                                <div className="text-center-title-bg-white">
                                    <h2 className="title">How We Work</h2>
                                    <p>Comprehensive technology solutions tailored to your business needs</p>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="container-consulting mt--80 mt_sm--30">
                        <div className="row">
                            <div className="col-lg-12">
                                <div className="consulting-step">
                                    <div className="timeline-line" />
                                    <div className="single-consulting-one">
                                        <div className="thumbnail">
                                            <img src="assets/images/process/01.jpg" alt="consulting" />
                                        </div>
                                        <div className="right-area">
                                            <h4 className="title">Requirement Discussion</h4>
                                            <p>
                                                Understanding your business <br /> requirements and objectives.
                                            </p>
                                        </div>
                                        <div className="timeline-dot">
                                            <div className="time-line-circle" />
                                        </div>
                                    </div>
                                    <div className="single-consulting-one">
                                        <div className="thumbnail">
                                            <img src="assets/images/process/02.jpg" alt="consulting" />
                                        </div>
                                        <div className="right-area">
                                            <h4 className="title">Planning & Design</h4>
                                            <p>
                                                Creating detailed project plans <br /> and design specifications.
                                            </p>
                                        </div>
                                        <div className="timeline-dot">
                                            <div className="time-line-circle" />
                                        </div>
                                    </div>
                                    <div className="single-consulting-one">
                                        <div className="thumbnail">
                                            <img src="assets/images/process/03.jpg" alt="consulting" />
                                        </div>
                                        <div className="right-area">
                                            <h4 className="title">Development</h4>
                                            <p>Building and implementing the solution.</p>
                                        </div>
                                        <div className="timeline-dot">
                                            <div className="time-line-circle" />
                                        </div>
                                    </div>
                                    <div className="single-consulting-one">
                                        <div className="thumbnail">
                                            <img src="assets/images/process/04.jpg" alt="consulting" />
                                        </div>
                                        <div className="right-area">
                                            <h4 className="title">Testing</h4>
                                            <p>Quality assurance and performance validation.</p>
                                        </div>
                                        <div className="timeline-dot">
                                            <div className="time-line-circle" />
                                        </div>
                                    </div>
                                    <div className="single-consulting-one">
                                        <div className="thumbnail">
                                            <img src="assets/images/process/05.jpg" alt="consulting" />
                                        </div>
                                        <div className="right-area">
                                            <h4 className="title">Launch & Support</h4>
                                            <p>
                                                Deployment and ongoing maintenance support.
                                            </p>
                                        </div>
                                        <div className="timeline-dot">
                                            <div className="time-line-circle" />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </>
            <CtaOne />
            <FooterOne />
            <BackToTop />
        </div>
    );
}
