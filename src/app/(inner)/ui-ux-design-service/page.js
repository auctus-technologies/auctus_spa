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
                    <div className="service-single-area-banner ui-ux-design-service bg_image jarallax"></div>
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
                                        <h1 className="title">UI/UX Design</h1>
                                        <p className="disc">
                                            We create intuitive, visually compelling interfaces that delight users and drive engagement, combining research-driven design with modern aesthetics for web and mobile applications.
                                        </p>
                                    </div>
                                    <div className="mid-content">
                                        <p className="disc">
                                            At Auctus, we believe great design is the foundation of successful digital products. Our UI/UX team focuses on understanding your users through research and usability testing before putting pixels on screen. We create designs that are not only beautiful but also functional, ensuring users can navigate your application intuitively and accomplish their goals with minimal friction.
                                        </p>
                                        <p className="disc">
                                            Our design process begins with discovery—learning about your business, users, and competitors. We then move to wireframing and prototyping, allowing you to visualize the user flow before development begins. Using tools like Figma, we create interactive prototypes that simulate the final experience, enabling early feedback and iteration without costly code changes.
                                        </p>
                                        <p className="disc">
                                            We design for consistency and scalability. Our design systems include component libraries, style guides, and documentation that ensure your product maintains visual coherence as it grows. We consider accessibility standards, responsive breakpoints, and platform conventions to deliver experiences that work for all users across all devices.
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
                                        src="https://images.unsplash.com/photo-1561070791-2526d30994b5?w=1200&auto=format&fit=crop&q=80"
                                        alt="UI Design Workspace"
                                    />
                                </div>
                            </div>
                            <div className="col-lg-6">
                                <div className="thumbnail-area-large-service-detaile-mid jarallax jara-mask-1">
                                    <img
                                        className="jarallax-img"
                                        src="https://images.unsplash.com/photo-1581291518633-83b4ebd1d83e?w=1200&auto=format&fit=crop&q=80"
                                        alt="UX Wireframing"
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
                                            Our UX expertise covers user research, journey mapping, information architecture, and usability testing. We validate design decisions with real users to ensure we're solving the right problems in the right way. This evidence-based approach reduces risk and increases the likelihood of product success.
                                        </p>
                                        <p className="disc">
                                            For UI design, we create visually striking interfaces that reflect your brand identity. We stay current with design trends while prioritizing timeless usability principles. Our designs are developer-ready, with specifications for spacing, typography, colors, and interactions that ensure accurate implementation.
                                        </p>
                                        <p className="disc">
                                            Based in Chennai, we work with startups and established businesses to elevate their digital presence. Whether you need a complete product design, a redesign of an existing application, or a design system for your team, we deliver creative solutions that balance aesthetic appeal with practical functionality.
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
                                <h2 className="title">Design That Delivers</h2>
                                <p className="disc">
                                    Ready to create exceptional user experiences? Let's design interfaces that your users will love and remember.
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
