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
                    <div className="service-single-area-banner bot-development-service bg_image jarallax"></div>
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
                                        <h1 className="title">Bot Development</h1>
                                        <p className="disc">
                                            We build intelligent AI chatbots and automation solutions that streamline customer interactions, reduce response times, and handle routine tasks so your team can focus on what matters most.
                                        </p>
                                    </div>
                                    <div className="mid-content">
                                        <p className="disc">
                                            At Auctus, we develop custom bots that integrate seamlessly with your existing systems. Whether you need a customer support chatbot for your website, a WhatsApp business bot, or internal automation for task management, we create solutions that understand context and deliver meaningful interactions. Our bots leverage natural language processing to handle queries intelligently.
                                        </p>
                                        <p className="disc">
                                            Our bot development covers multiple platforms and use cases. We build conversational interfaces for websites, mobile apps, Slack, Telegram, and Facebook Messenger. For businesses, we create automation bots that handle appointment scheduling, order tracking, FAQ responses, and lead qualification—reducing manual workload while improving customer satisfaction.
                                        </p>
                                        <p className="disc">
                                            We integrate with leading AI platforms and can incorporate custom machine learning models when needed. Our bots connect to your CRM, knowledge bases, and backend systems to provide accurate, personalized responses. We also implement analytics dashboards so you can monitor bot performance and continuously improve interactions based on real user data.
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
                                        src="https://images.unsplash.com/photo-1677442136019-21780ecad995?w=1200&auto=format&fit=crop&q=80"
                                        alt="AI Chatbot Technology"
                                    />
                                </div>
                            </div>
                            <div className="col-lg-6">
                                <div className="thumbnail-area-large-service-detaile-mid jarallax jara-mask-1">
                                    <img
                                        className="jarallax-img"
                                        src="https://images.unsplash.com/photo-1531746790731-6c087fecd65a?w=1200&auto=format&fit=crop&q=80"
                                        alt="Automation Technology"
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
                                            Our development process starts with understanding your workflow and identifying automation opportunities. We design conversation flows that feel natural and handle edge cases gracefully. Every bot undergoes extensive testing to ensure it responds appropriately to varied user inputs and escalates complex issues to human agents when necessary.
                                        </p>
                                        <p className="disc">
                                            Security and compliance are built into our bot solutions. We implement authentication mechanisms, data encryption, and access controls to protect sensitive information. For industries with specific requirements, we ensure our bots meet relevant standards and can maintain audit trails of all interactions.
                                        </p>
                                        <p className="disc">
                                            Based in Chennai, we help businesses across India adopt AI-powered automation. Whether you're a startup looking to scale customer support or an enterprise seeking internal process automation, we deliver bot solutions that are reliable, scalable, and aligned with your business objectives.
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
                                <h2 className="title">Automate With AI</h2>
                                <p className="disc">
                                    Ready to streamline your operations with intelligent bots? Let's discuss how AI automation can transform your customer interactions and workflows.
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
