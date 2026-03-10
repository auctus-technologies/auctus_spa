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
                    <div className="service-single-area-banner ecommerce-development-service bg_image jarallax"></div>
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
                                        <h1 className="title">E-Commerce Development</h1>
                                        <p className="disc">
                                            We build secure, scalable online stores with integrated payment systems, inventory management, and seamless user experiences that drive sales and customer satisfaction.
                                        </p>
                                    </div>
                                    <div className="mid-content">
                                        <p className="disc">
                                            At Auctus, we develop custom e-commerce solutions tailored to your business model and customer needs. Whether you're launching a new online store or upgrading an existing platform, we create solutions that handle everything from product catalog management to secure checkout processes. We work with modern e-commerce frameworks and can build headless solutions or integrate with platforms like Shopify or WooCommerce when appropriate.
                                        </p>
                                        <p className="disc">
                                            Our e-commerce development covers essential features including user authentication, shopping cart functionality, multiple payment gateway integrations, order tracking, and customer account management. We ensure your store is mobile-responsive, fast-loading, and optimized for search engines to help you reach more customers and convert visits into sales.
                                        </p>
                                        <p className="disc">
                                            Security is paramount in e-commerce. We implement SSL certificates, PCI-DSS compliance measures, data encryption, and secure payment processing to protect both your business and your customers. Our solutions include fraud detection capabilities and regular security updates to keep your store protected against evolving threats.
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
                                        src="https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=1200&auto=format&fit=crop&q=80"
                                        alt="E-Commerce Shopping"
                                    />
                                </div>
                            </div>
                            <div className="col-lg-6">
                                <div className="thumbnail-area-large-service-detaile-mid jarallax jara-mask-1">
                                    <img
                                        className="jarallax-img"
                                        src="https://images.unsplash.com/photo-1557821552-17105176677c?w=1200&auto=format&fit=crop&q=80"
                                        alt="Online Store Development"
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
                                            We integrate with popular payment providers including Razorpay, Stripe, PayPal, and major Indian payment gateways to ensure smooth transactions for your customers. Our solutions support multiple currencies, discount codes, tax calculations, and shipping integrations to provide a complete e-commerce experience.
                                        </p>
                                        <p className="disc">
                                            Beyond the storefront, we build powerful admin dashboards that give you control over inventory, orders, customer data, and analytics. You can track sales performance, manage stock levels, process refunds, and generate reports to make informed business decisions. We can also integrate with ERP systems and accounting software to streamline your operations.
                                        </p>
                                        <p className="disc">
                                            Based in Chennai, we understand the Indian e-commerce landscape and the unique requirements of businesses operating in this market. Whether you're a startup launching your first online store or an established retailer expanding digitally, we deliver e-commerce solutions that are reliable, scalable, and positioned for growth.
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
                                <h2 className="title">Launch Your Online Store</h2>
                                <p className="disc">
                                    Ready to sell online? Let's build an e-commerce solution that drives revenue and delights your customers.
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
