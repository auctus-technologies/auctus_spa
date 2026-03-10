"use client"
import BackToTop from "@/components/common/BackToTop";
import FooterOne from "@/components/footer/FooterOne";
import HeaderTwo from "@/components/header/HeaderTwo";
import CtaSeven from "@/components/cta/CtaSeven";
import Accordion from "react-bootstrap/Accordion";
export default function Home() {
    const styling = {
        backgroundImage: `url(assets/images/career/03.webp)`,
    };
    return (
        <div className='#'>
            <HeaderTwo />

            <>
                {/* rts career banner area start */}
                <div className="rts-career-banner-area rts-section-gap">
                    <div className="container">
                        <div className="row">
                            <div className="col-lg-6">
                                <div className="career-banner-wrapper">
                                    <h1 className="title">
                                        Join Auctus - Build the Future of Technology
                                    </h1>
                                    <p className="disc">
                                        At Auctus, we believe our people are our greatest asset. We're a growing 
                                        technology company in Chennai looking for passionate individuals who want 
                                        to make an impact. Join us to work on exciting projects, learn new skills, 
                                        and grow your career in a collaborative environment.
                                    </p>
                                    <a href="#openings" className="rts-btn btn-primary btn-bold">
                                        View Openings
                                    </a>
                                </div>
                            </div>
                            <div className="col-lg-6 mt_md--30 mt_sm--30 wow fadeInRight">
                                <div className="thumbnail-top">
                                    <img src="assets/images/career/01.webp" alt="career" />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                {/* rts career banner area send */}
                <div className="rts-section-gap-top career-two-section">
                    <div className="container">
                        <div className="row">
                            <div className="col-lg-6">
                                <div className="thumbnail-career-two wow fadeInLeft">
                                    <img src="assets/images/career/02.webp" alt="career" />
                                </div>
                            </div>
                            <div className="col-lg-6 pl--50 pl_md--15 pl_sm--10 mt_md--30 pt_sm--30">
                                <div className="career-right-two-wrapper">
                                    <h2 className="title">Why Work With Us?</h2>
                                    <p>
                                        Auctus offers a supportive work environment where you can develop 
                                        your skills and advance your career. We're committed to helping our 
                                        team members grow both personally and professionally.
                                    </p>
                                    <div className="check-wrapper-main">
                                        <div className="single-wrapper">
                                            <div className="check-wrapper">
                                                <div className="single-check">
                                                    <img src="assets/images/service/01.svg" alt="service" />
                                                    <p>Growth Opportunities</p>
                                                </div>
                                                <div className="single-check">
                                                    <img src="assets/images/service/01.svg" alt="service" />
                                                    <p>Work-Life Balance</p>
                                                </div>
                                                <div className="single-check">
                                                    <img src="assets/images/service/01.svg" alt="service" />
                                                    <p>Modern Tech Stack</p>
                                                </div>
                                                <div className="single-check">
                                                    <img src="assets/images/service/01.svg" alt="service" />
                                                    <p>Collaborative Team</p>
                                                </div>
                                                <div className="single-check">
                                                    <img src="assets/images/service/01.svg" alt="service" />
                                                    <p>Competitive Compensation</p>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="single-wrapper">
                                            <div className="check-wrapper">
                                                <div className="single-check">
                                                    <img src="assets/images/service/01.svg" alt="service" />
                                                    <p>Learning & Development</p>
                                                </div>
                                                <div className="single-check">
                                                    <img src="assets/images/service/01.svg" alt="service" />
                                                    <p>Flexible Work Hours</p>
                                                </div>
                                                <div className="single-check">
                                                    <img src="assets/images/service/01.svg" alt="service" />
                                                    <p>Diverse Projects</p>
                                                </div>
                                                <div className="single-check">
                                                    <img src="assets/images/service/01.svg" alt="service" />
                                                    <p>Recognition & Rewards</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                {/* company values area start */}
                <div className="company-values-area rts-section-gap">
                    <div className="container">
                        <div className="row">
                            <div className="col-lg-12">
                                <div className="title-between-area-wrapper-main">
                                    <div className="title-left-area">
                                        <h2 className="title">Our Values in Action</h2>
                                    </div>
                                    <p className="disc">
                                        Our values are the foundation of our culture and guide every
                                        decision we make. We believe that a strong set of principles
                                        fosters a positive work environment, enhances client
                                        relationships, and drives our success.
                                    </p>
                                </div>
                            </div>
                        </div>
                        <div className="row g-5 mt--30">
                            <div className="col-lg-4 wow fadeInUp" data-wow-delay=".1s">
                                <div className="single-values-in-action">
                                    <div className="icon">
                                        <img src="assets/images/career/01.svg" alt="icon" />
                                    </div>
                                    <div className="information">
                                        <h6 className="title">Integrity</h6>
                                        <p>
                                            We operate with honesty and transparency in all our dealings with clients and team members.
                                        </p>
                                    </div>
                                </div>
                            </div>
                            <div className="col-lg-4 wow fadeInUp" data-wow-delay=".3s">
                                <div className="single-values-in-action">
                                    <div className="icon">
                                        <img src="assets/images/career/02.svg" alt="icon" />
                                    </div>
                                    <div className="information">
                                        <h6 className="title">Innovation</h6>
                                        <p>
                                            We embrace new ideas and technologies to deliver creative solutions for our clients.
                                        </p>
                                    </div>
                                </div>
                            </div>
                            <div className="col-lg-4 wow fadeInUp" data-wow-delay=".5s">
                                <div className="single-values-in-action">
                                    <div className="icon">
                                        <img src="assets/images/career/03.svg" alt="icon" />
                                    </div>
                                    <div className="information">
                                        <h6 className="title">Collaboration</h6>
                                        <p>
                                            We believe teamwork and open communication lead to the best outcomes.
                                        </p>
                                    </div>
                                </div>
                            </div>
                            <div className="col-lg-4 wow fadeInUp" data-wow-delay=".1s">
                                <div className="single-values-in-action">
                                    <div className="icon">
                                        <img src="assets/images/career/04.svg" alt="icon" />
                                    </div>
                                    <div className="information">
                                        <h6 className="title">Excellence</h6>
                                        <p>
                                            We strive for quality in every project and continuously improve our skills.
                                        </p>
                                    </div>
                                </div>
                            </div>
                            <div className="col-lg-4 wow fadeInUp" data-wow-delay=".3s">
                                <div className="single-values-in-action">
                                    <div className="icon">
                                        <img src="assets/images/career/05.svg" alt="icon" />
                                    </div>
                                    <div className="information">
                                        <h6 className="title">Customer Focus</h6>
                                        <p>
                                            We put our clients first and work to understand and meet their needs.
                                        </p>
                                    </div>
                                </div>
                            </div>
                            <div className="col-lg-4 wow fadeInUp" data-wow-delay=".5s">
                                <div className="single-values-in-action">
                                    <div className="icon">
                                        <img src="assets/images/career/06.svg" alt="icon" />
                                    </div>
                                    <div className="information">
                                        <h6 className="title">Accountability</h6>
                                        <p>
                                            We take ownership of our work and deliver on our commitments.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                {/* company values area end */}
                {/* job opening area start */}
                <div className="job-opening-area rts-section-gapBottom" id="openings">
                    <div className="container">
                        <div className="row">
                            <div className="col-lg-12">
                                <div className="title-center-style-two">
                                    <h2 className="title">Current Openings</h2>
                                </div>
                            </div>
                        </div>
                        <div className="row g-5 mt--30">
                            <div className="col-lg-6 wow fadeInUp" data-wow-delay=".1s">
                                <div className="single-job-opening-card">
                                    <h4 className="title">Sales Person</h4>
                                    <p>
                                        <span>Responsibilities:</span> Identify and engage potential clients, understand their technology needs, present Auctus services effectively, and close deals. Build and maintain strong client relationships.
                                    </p>
                                    <p>
                                        <span>Qualifications:</span> Proven sales experience, excellent communication and negotiation skills, understanding of IT services, ability to work independently and meet targets.
                                    </p>
                                    <div className="tag-wrapper">
                                        <div className="single">
                                            <span>Sales</span>
                                        </div>
                                        <div className="single">
                                            <span>Business Development</span>
                                        </div>
                                        <div className="single">
                                            <span>Client Relations</span>
                                        </div>
                                    </div>
                                    <div className="bottom-area">
                                        <div className="selary-range">
                                            <p>
                                                Competitive <span>+ Commission</span>
                                            </p>
                                        </div>
                                        <a href="/apply" className="rts-btn btn-primary btn-bold">
                                            Apply Now
                                        </a>
                                    </div>
                                </div>
                            </div>
                            <div className="col-lg-6 wow fadeInUp" data-wow-delay=".3s">
                                <div className="single-job-opening-card">
                                    <h4 className="title">HR (Human Resources)</h4>
                                    <p>
                                        <span>Responsibilities:</span> Handle recruitment and onboarding, manage employee relations, oversee performance management, coordinate training programs, and ensure compliance with labor laws.
                                    </p>
                                    <p>
                                        <span>Qualifications:</span> Experience in HR management, strong interpersonal skills, knowledge of Indian labor laws, ability to handle confidential information with discretion.
                                    </p>
                                    <div className="tag-wrapper">
                                        <div className="single">
                                            <span>Human Resources</span>
                                        </div>
                                        <div className="single">
                                            <span>Recruitment</span>
                                        </div>
                                        <div className="single">
                                            <span>Employee Relations</span>
                                        </div>
                                    </div>
                                    <div className="bottom-area">
                                        <div className="selary-range">
                                            <p>
                                                Competitive <span>Based on Experience</span>
                                            </p>
                                        </div>
                                        <a href="/apply" className="rts-btn btn-primary btn-bold">
                                            Apply Now
                                        </a>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                {/* job opening area end */}
                {/* why choose us sectiona area start */}
                <div className="faqs-section rts-section-gapBottom">
                    <div className="container">
                        <div className="row">
                            <div className="col-lg-6">
                                <h2 className="title">FAQs</h2>
                            </div>
                            <div className="col-lg-6">
                                <div className="faq-why-choose-left-accordion">
                                <Accordion defaultActiveKey="0">
                                    <Accordion.Item eventKey="0">
                                        <Accordion.Header>
                                        What is the hiring process at Auctus?
                                        </Accordion.Header>
                                        <Accordion.Body>
                                        Our hiring process typically involves an initial application review, followed by a phone or video interview, and a final in-person or virtual meeting. We look for candidates who align with our values and have the skills to contribute to our team.
                                        </Accordion.Body>
                                    </Accordion.Item>
                                    <Accordion.Item eventKey="1">
                                        <Accordion.Header>
                                        What benefits do you offer employees?
                                        </Accordion.Header>
                                        <Accordion.Body>
                                        We offer competitive salaries, performance-based incentives, flexible work arrangements, opportunities for professional development, and a supportive work environment that encourages growth and learning.
                                        </Accordion.Body>
                                    </Accordion.Item>
                                    <Accordion.Item eventKey="2">
                                        <Accordion.Header>Do you offer remote work options?</Accordion.Header>
                                        <Accordion.Body>
                                        Yes, we offer flexible work arrangements including remote work options depending on the role and project requirements. We believe in giving our team the flexibility to work effectively.
                                        </Accordion.Body>
                                    </Accordion.Item>
                                </Accordion>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                {/* why choose us sectiona area end */}
            </>
            <CtaSeven />
            <FooterOne />
            <BackToTop />
        </div>
    );
}
