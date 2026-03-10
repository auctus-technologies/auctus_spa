
"use client"
import BackToTop from "@/components/common/BackToTop";
import FooterOne from "@/components/footer/FooterOne";
import HeaderTwo from "@/components/header/HeaderTwo";
import React, { useRef } from "react";
import emailjs from "@emailjs/browser";
import { ReactSVG } from 'react-svg';
export default function Home() {
    const form = useRef();

    const sendEmail = (e) => {
        e.preventDefault(); // Prevent default form submission

        emailjs
            .sendForm(
                "your_service_id", // Replace with your Service ID
                "your_template_id", // Replace with your Template ID
                form.current,
                "your_public_key"  // Replace with your Public Key
            )
            .then(
                (result) => {
                    console.log(result.text);
                    alert("Message sent successfully!");
                    form.current.reset(); // Reset the form after submission
                },
                (error) => {
                    console.log(error.text);
                    alert("Failed to send the message. Please try again later.");
                }
            );
    };
    return (
        <div className='#'>
            <HeaderTwo />

            <>
                {/* contact banner areas start */}
                <div className="contact-page-banner jarallax bg_iamge"></div>
                {/* contact banner areas end */}
                {/* contact area form wrapper start */}
                <div className="contact-area-form-wrapper rts-section-gapTop">
                    <div className="container-contact">
                        <div className="row">
                            <div className="col-lg-12">
                                <div className="text-center-title-bg-white">
                                    <h2 className="title">Get in Touch</h2>
                                    <p>Ready to start your next project? Contact Auctus to discuss how we can help bring your ideas to life.</p>
                                </div>
                            </div>
                            <div className="col-lg-12">
                                <form
                                    ref={form}
                                    onSubmit={sendEmail}
                                    className="contact-form"
                                    id="contact-form"
                                >
                                    <div className="half-input-wrapper">
                                        <div className="single">
                                            <label htmlFor="name">First name</label>
                                            <input
                                                type="text"
                                                id="name"
                                                name="first_name"
                                                placeholder="First name"
                                                required
                                            />
                                        </div>
                                        <div className="single">
                                            <label htmlFor="last">Last name</label>
                                            <input
                                                type="text"
                                                id="last"
                                                name="last_name"
                                                placeholder="Last name"
                                                required
                                            />
                                        </div>
                                    </div>
                                    <div className="single">
                                        <label htmlFor="email">Email</label>
                                        <input
                                            type="email"
                                            id="email"
                                            name="email"
                                            placeholder="you@email.com"
                                            required
                                        />
                                    </div>
                                    <div className="single">
                                        <label htmlFor="phone">Phone</label>
                                        <input
                                            type="text"
                                            id="phone"
                                            name="phone"
                                            placeholder="+91 00000 00000"
                                            required
                                        />
                                    </div>
                                    <div className="single">
                                        <label htmlFor="service">Service Interest</label>
                                        <select
                                            id="service"
                                            name="service"
                                            required
                                            style={{
                                                width: '100%',
                                                padding: '12px 16px',
                                                border: '1px solid #ddd',
                                                borderRadius: '4px',
                                                marginBottom: '20px'
                                            }}
                                        >
                                            <option value="">Select a service</option>
                                            <option value="web-development">Web Development</option>
                                            <option value="mobile-development">Mobile App Development</option>
                                            <option value="ecommerce">E-Commerce Development</option>
                                            <option value="hosting">Hosting & Deployment</option>
                                            <option value="bot-development">Bot Development</option>
                                            <option value="ui-ux">UI/UX Design</option>
                                            <option value="api-development">API Development</option>
                                            <option value="support">Technical Support</option>
                                        </select>
                                    </div>
                                    <div className="single">
                                        <label htmlFor="message">Project Details</label>
                                        <textarea
                                            id="message"
                                            name="message"
                                            placeholder="Tell us about your project requirements..."
                                            required
                                        />
                                    </div>
                                    <div className="form-check">
                                        <input
                                            className="form-check-input"
                                            type="checkbox"
                                            id="defaultCheck1"
                                            name="agree"
                                            required
                                        />
                                        <label className="form-check-label" htmlFor="defaultCheck1">
                                            I agree to the <a href="/terms-of-use" style={{ color: 'var(--color-primary)' }}>Terms of Use</a> and <a href="/privacy-policy" style={{ color: 'var(--color-primary)' }}>Privacy Policy</a>.
                                        </label>
                                    </div>
                                    <button type="submit" className="rts-btn btn-primary">
                                        Send Message
                                        <ReactSVG
                                            src="assets/images/service/icons/13.svg"
                                            alt="arrow"
                                        />
                                    </button>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
                {/* contact area form wrapper end */}
                <div className="rts-google-map-area rts-section-gapTop">
                    <div className="container">
                        <div className="row">
                            <div className="col-lg-12">
                                <div className="google-map-wrapper">
                                    <iframe
                                        src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d4144.982054808454!2d80.27152867530263!3d13.043970013287002!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3a5267407d3a5be9%3A0x9328cdfd5b3ed682!2sSingapore%20Hardwares%20and%20Interiors!5e1!3m2!1sen!2sin!4v1773130677078!5m2!1sen!2sin"
                                        width={600}
                                        height={500}
                                        style={{ border: 0 }}
                                        allowFullScreen=""
                                        loading="lazy"
                                        referrerPolicy="no-referrer-when-downgrade"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                {/* rts location area start */}
                <div className="rts-location-contact-area pt--70">
                    <div className="container">
                        <div className="row section-seperator-b pb--90 g-5">
                            <div className="col-lg-4 col-md-6 col-sm-12">
                                <div className="single-location-area-contact">
                                    <div className="icon">
                                        <i className="fa-sharp fa-regular fa-location-dot" />
                                    </div>
                                    <p>Chennai Office</p>
                                    <span>116/1, 3rd Floor, Dr. Natesan Road, Jagadambal Colony, Othavadi, Mylapore</span>
                                </div>
                            </div>
                            <div className="col-lg-4 col-md-6 col-sm-12">
                                <div className="single-location-area-contact">
                                    <div className="icon">
                                        <i className="fa-sharp fa-regular fa-phone" />
                                    </div>
                                    <p>Phone</p>
                                    <span>+91 95004 98565</span>
                                </div>
                            </div>
                            <div className="col-lg-4 col-md-6 col-sm-12">
                                <div className="single-location-area-contact">
                                    <div className="icon">
                                        <i className="fa-sharp fa-regular fa-envelope" />
                                    </div>
                                    <p>Email</p>
                                    <span>auctustech.cnn@gmail.com</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                {/* rts location area end */}
            </>




            <FooterOne />
            <BackToTop />
        </div>
    );
}
