
import AboutBanner from "@/components/banner/AboutBanner";
import BackToTop from "@/components/common/BackToTop";
import FooterOne from "@/components/footer/FooterOne";
import HeaderOne from "@/components/header/HeaderOne";
import HeaderTwo from "@/components/header/HeaderTwo";
import Wedo from "@/components/whatwe-do/Wedo";
import Project from "@/components/casestudies/Project";
import FeatureOne from "@/components/feature/FeatureOne";
import FeatureTwo from "@/components/feature/FeatureTwo";
import ServiceSix from "@/components/services/ServiceSix";
import PricingFour from "@/components/pricing/PricingFour";
import TestimonialsThree from "@/components/testimonials/TestimonialsThree";
import BrandTwo from "@/components/brand/BrandTwo";
import CtaFour from "@/components/cta/CtaFour";
import AboutOne from "@/components/about/AboutOne";
import CtaOne from "@/components/cta/CtaOne";


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
                                <span className="pre">About Us</span>
                                <h1 className="title">Building Digital Futures</h1>
                            
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            {/* banner area end */}

            {/* why choose us banner area  */}
            <div className="banner-why-choose-us">
                <div className="container">
                    <div className="row g-5">
                        <div className="col-lg-4">
                            <div className="thumbnail-banner-choose-us jarallax" data-speed=".8">
                                <img
                                    src="assets/images/banner/06.webp"
                                    className="jarallax-img"
                                    alt="banner"
                                />
                            </div>
                        </div>
                        <div className="col-lg-8">
                            <div className="thumbnail-banner-choose-us jarallax" data-speed=".8">
                                <img
                                    src="assets/images/banner/07.webp"
                                    className="jarallax-img"
                                    alt="banner"
                                />
                            </div>
                        </div>
                        <div className="col-lg-9 mt--50">
                            <div className="why-choose-intro-disc">
                                <p>
                                    We're more than just a technology company – we're your dedicated
                                    partner in digital transformation. Our Chennai-based team brings expertise
                                    in web development, mobile apps, AI solutions, and comprehensive tech support,
                                    ensuring customized solutions that align perfectly with your business goals.
                                    We prioritize innovation, efficiency, and measurable results.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* why choose us banner area end */}
            <div className="luminos-solution-key-feature mt--50">
                <div className="container">
                    <div className="row">
                        <div className="col-lg-5">
                            <div className="luminos-main-solutioin-key">
                                <h3 className="title">Choose Auctus for:</h3>
                                <div className="check-wrapper">
                                    <div className="single-check">
                                        <img src="assets/images/service/01.svg" alt="service" />
                                        <p>Modern Web Development</p>
                                    </div>
                                    <div className="single-check">
                                        <img src="assets/images/service/01.svg" alt="service" />
                                        <p>Mobile App Solutions</p>
                                    </div>
                                    <div className="single-check">
                                        <img src="assets/images/service/01.svg" alt="service" />
                                        <p>AI & Automation</p>
                                    </div>
                                    <div className="single-check">
                                        <img src="assets/images/service/01.svg" alt="service" />
                                        <p>Cloud & Hosting</p>
                                    </div>
                                </div>
                                <div className="tag-wrapper">
                                    <div className="single-tag">
                                        <span>Web Development</span>
                                    </div>
                                    <div className="single-tag">
                                        <span>Mobile Apps</span>
                                    </div>
                                    <div className="single-tag">
                                        <span>AI Solutions</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="col-lg-7">
                            <div className="thumbnail-main-wrapper-choose-us">
                                <img src="assets/images/service/09.webp" alt="service" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Mission & Vision Section */}
            <div className="why-choose-us-working-process rts-section-gap">
                <div className="container">
                    <div className="row g-5">
                        <div className="col-lg-6">
                            <div className="why-choose-process-left pb--30">
                                <span className="pre-title">Our Mission & Vision</span>
                                <div className="text-left-title-bg-white">
                                    <div className="single-working-process-choose-us">
                                        <h2 className="title mb--20">Mission :</h2>
                                        <div>
                                            <ul>
                                                <li>Help businesses grow through innovative technology solutions</li>
                                                <li>Drive efficiency and digital transformation for our clients</li>
                                                <li>Deliver cutting-edge web, mobile, and AI solutions</li>
                                                <li>Provide scalable cloud infrastructure and hosting services</li>
                                                <li>Offer comprehensive tech support and maintenance</li>
                                                <li>Create custom automation bots to streamline business processes</li>
                                            </ul>
                                        </div>
                                    </div>
                                    <div className="single-working-process-choose-us">
                                        <h2 className="title mb--20">Vision :</h2>
                                        <div>
                                            <ul>
                                                <li>Become the trusted technology partner for startups and businesses</li>
                                                <li>Lead digital innovation in Chennai and beyond</li>
                                                <li>Empower businesses with scalable and modern tech solutions</li>
                                                <li>Build a community of digitally transformed enterprises</li>
                                                <li>Pioneer AI-driven business automation solutions</li>
                                                <li>Establish Auctus as a leader in end-to-end digital services</li>
                                            </ul>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="col-lg-6">
                            <div className="single-working-process-choose-us wow fadeInUp">
                                <h2 className="title">
                                    Digital Strategy & Planning
                                </h2>
                                <p>
                                    We develop comprehensive technology strategies tailored to your business goals and market needs.
                                </p>
                                <div className="tag-wrapper">
                                    <div className="single">
                                        <span>Digital Strategy</span>
                                    </div>
                                    <div className="single">
                                        <span>Tech Solutions</span>
                                    </div>
                                    <div className="single">
                                        <span>Business Growth</span>
                                    </div>
                                </div>
                            </div>
                            <div
                                className="single-working-process-choose-us wow fadeInUp"
                                data-wow-delay=".2s"
                            >
                                <h2 className="title">
                                    Innovation & Development
                                </h2>
                                <p>
                                    We build cutting-edge digital products using modern technologies and best practices.
                                </p>
                                <div className="tag-wrapper">
                                    <div className="single">
                                        <span>Web Development</span>
                                    </div>
                                    <div className="single">
                                        <span>Mobile Apps</span>
                                    </div>
                                    <div className="single">
                                        <span>AI Solutions</span>
                                    </div>
                                </div>
                            </div>
                            <div
                                className="single-working-process-choose-us wow fadeInUp"
                                data-wow-delay=".4s"
                            >
                                <h2 className="title">
                                    Support & Growth
                                </h2>
                                <p>
                                    We provide ongoing support and optimization to ensure your technology scales with your business.
                                </p>
                                <div className="tag-wrapper">
                                    <div className="single">
                                        <span>Tech Support</span>
                                    </div>
                                    <div className="single">
                                        <span>Cloud Solutions</span>
                                    </div>
                                    <div className="single">
                                        <span>Scalability</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Technologies Section */}
            <div className="keybenefits-area rts-section-gap2Bottom">
                <div className="container">
                    <div className="row">
                        <div className="col-lg-12">
                            <div className="text-center-title-bg-white">
                                <h2 className="title">Our Technologies</h2>
                                <p>Cutting-edge technologies powering modern digital solutions</p>
                            </div>
                        </div>
                    </div>
                    <div className="row g-0 mt--40">
                        <div className="col-lg-3" data-aos-duration="1000" data-aos-delay="100">
                            <div className="single-benefits-area-wrapper bg-light">
                                <div className="icon">
                                    <img src="assets/images/technologies/01.svg" alt="benefits" />
                                </div>
                                <h5 className="title">AWS</h5>
                            </div>
                        </div>
                        <div className="col-lg-3" data-aos-duration="1000" data-aos-delay="200">
                            <div className="single-benefits-area-wrapper">
                                <div className="icon">
                                    <img src="assets/images/technologies/02.svg" alt="benefits" />
                                </div>
                                <h5 className="title">HTML/CSS</h5>
                            </div>
                        </div>
                        <div className="col-lg-3" data-aos-duration="1000" data-aos-delay="300">
                            <div className="single-benefits-area-wrapper bg-light">
                                <div className="icon">
                                    <img src="assets/images/technologies/03.svg" alt="benefits" />
                                </div>
                                <h5 className="title">Python</h5>
                            </div>
                        </div>
                        <div className="col-lg-3" data-aos-duration="1000" data-aos-delay="400">
                            <div className="single-benefits-area-wrapper">
                                <div className="icon">
                                    <img src="assets/images/technologies/04.svg" alt="benefits" />
                                </div>
                                <h5 className="title">Django</h5>
                            </div>
                        </div>
                        <div className="col-lg-3" data-aos-duration="1000" data-aos-delay="100">
                            <div className="single-benefits-area-wrapper">
                                <div className="icon">
                                    <img src="assets/images/technologies/05.svg" alt="benefits" />
                                </div>
                                <h5 className="title">Next.js</h5>
                            </div>
                        </div>
                        <div className="col-lg-3" data-aos-duration="1000" data-aos-delay="200">
                            <div className="single-benefits-area-wrapper  bg-light">
                                <div className="icon">
                                    <img src="assets/images/technologies/06.svg" alt="benefits" />
                                </div>
                                <h5 className="title">Flutter</h5>
                            </div>
                        </div>
                        <div className="col-lg-3" data-aos-duration="1000" data-aos-delay="300">
                            <div className="single-benefits-area-wrapper">
                                <div className="icon">
                                    <img src="assets/images/technologies/07.svg" alt="benefits" />
                                </div>
                                <h5 className="title">PostgreSQL</h5>
                            </div>
                        </div>
                        <div className="col-lg-3" data-aos-duration="1000" data-aos-delay="400">
                            <div className="single-benefits-area-wrapper  bg-light">
                                <div className="icon">
                                    <img src="assets/images/technologies/08.svg" alt="benefits" />
                                </div>
                                <h5 className="title">Figma</h5>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <Project />

            <CtaOne />


            {/* <AboutOne /> */}
            {/* <AboutBanner />
            <Wedo />
            <FeatureOne />
            <FeatureTwo />
            <ServiceSix />
            <PricingFour />
            <BrandTwo />
            <TestimonialsThree />
            <CtaFour /> */}
            <FooterOne />
            <BackToTop />
        </div>
    );
}
