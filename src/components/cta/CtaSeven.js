"use client"
import { useEffect } from "react";
import Link from "next/link";

function CtaSeven() {
    useEffect(() => {
        // Add class to body when the page is mounted
        document.body.classList.add("index-five");

        // Cleanup by removing the class when the component unmounts
        return () => {
            document.body.classList.remove("index-five");
        };
    }, []);
    return (

        <div className="rts-call-to-action-area">
            <div className="container">
                <div className="row">
                    <div className="col-lg-12">
                        <div className="cta-two-wrapper">
                            <div className="inner">
                                <h2 className="title">Ready to Join Our Team?</h2>
                                <p>Take the next step in your career with Auctus. Send us your resume and let's discuss how you can contribute to our growing team.</p>
                                <Link
                                    href="/apply"
                                    className="rts-btn btn-primary wow fadeInUp"
                                    data-wow-delay=".5s"
                                    style={{
                                        visibility: "visible",
                                        animationDelay: "0.5s",
                                        animationName: "fadeInUp"
                                    }}
                                >
                                    Apply Now
                                    <svg
                                        width={32}
                                        height={32}
                                        viewBox="0 0 32 32"
                                        fill="none"
                                        xmlns="http://www.w3.org/2000/svg"
                                        data-inject-url="http://localhost:3000/assets/images/service/icons/13.svg"
                                        className="injectable"
                                    >
                                        <path
                                            d="M9.3335 22.6667L22.6668 9.33337M22.6668 9.33337H9.3335M22.6668 9.33337V22.6667"
                                            stroke="#999999"
                                            strokeWidth="1.5"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                        />
                                    </svg>
                                </Link>
                            </div>
                            <div className="shape-area">
                                <img
                                    src="assets/images/cta/05.png"
                                    alt="cta"
                                    className="one wow toBottomLeft"
                                    style={{ visibility: "visible", animationName: "toBottomLeft" }}
                                />
                                <img
                                    src="assets/images/cta/06.png"
                                    alt="cta"
                                    className="two wow toTopRight"
                                    style={{ visibility: "visible", animationName: "toTopRight" }}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

    )
}

export default CtaSeven