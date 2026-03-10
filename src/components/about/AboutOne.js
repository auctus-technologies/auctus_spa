"use client"

function AboutOne() {
    return (
        <div className="#">

            <div className="rts-career-banner-area rts-section-gap2">
                <div className="container">
                    <div className="row align-items-center">
                        <div className="col-lg-6">
                            <div className="career-banner-wrapper">
                                <h1 className="pre-title">About Us</h1>
                                <h1 className="title">Building Modern Digital Solutions</h1>
                                <p className="disc">
                                    Auctus is a technology startup based in Chennai focused on 
                                    building modern digital solutions for businesses and startups. 
                                    We specialize in web development, mobile applications, hosting 
                                    services, AI bot development, and technical support to help 
                                    organizations transform their ideas into scalable digital products.
                                </p>
                                <a href="/contact" className="rts-btn btn-primary btn-bold">
                                    Get in Touch
                                </a>
                            </div>
                        </div>
                        <div className="col-lg-6 pl--30 pl_md--15 pl_sm--10 pt_md--30 pt_sm--30">
                            <div
                                className="thumbnail-top jarallax thumbnail-consultancy"
                                data-speed=".85"
                            >
                                <img
                                    className="jarallax-img"
                                    src="assets/images/about/04.jpg"
                                    alt="career"
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className="bg-gradient-one-industry">
                <div className="consultancy-bottom rts-section-gap2 career-two-section">
                    <div className="container">
                        <div className="row align-items-center">
                            <div className="col-lg-6 pr--40 pr_md--10 pr_sm--10 mb_md--30 mb_sm--25">
                                <div className="thumbnail-consultancy jarallax">
                                    <img
                                        className="jarallax-img"
                                        src="assets/images/about/05.jpg"
                                        alt="consultancy"
                                    />
                                </div>
                            </div>
                            <div className="col-lg-6">
                                <div className="career-right-two-wrapper">
                                    <h2 className="title">
                                        Clean, Reliable, and Scalable Solutions
                                    </h2>
                                    <p>
                                        We focus on delivering end-to-end technology services tailored 
                                        to client needs. From custom websites and mobile apps to 
                                        automation tools and cloud infrastructure, we help businesses 
                                        grow in the digital world.
                                    </p>
                                    <div className="check-wrapper-main">
                                        <div className="single-wrapper">
                                            <div className="check-wrapper">
                                                <div className="single-check">
                                                    <img src="assets/images/service/01.svg" alt="service" />
                                                    <p>Web & Mobile Development</p>
                                                </div>
                                                <div className="single-check">
                                                    <img src="assets/images/service/01.svg" alt="service" />
                                                    <p>E-Commerce Solutions</p>
                                                </div>
                                                <div className="single-check">
                                                    <img src="assets/images/service/01.svg" alt="service" />
                                                    <p>Cloud Hosting & Deployment</p>
                                                </div>
                                                <div className="single-check">
                                                    <img src="assets/images/service/01.svg" alt="service" />
                                                    <p>AI Bot Development</p>
                                                </div>
                                                <div className="single-check">
                                                    <img src="assets/images/service/01.svg" alt="service" />
                                                    <p>Technical Support & Maintenance</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default AboutOne