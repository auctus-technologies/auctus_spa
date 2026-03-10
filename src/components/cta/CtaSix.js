"use client"
import React from 'react'
import { ReactSVG } from 'react-svg';
function CtaSix() {
    return (
        <>
            {/* have you a questions area start */}
            <div className="have-you-any-questions-area-service rts-section-gapTop position-relative">
                <div className="container">
                    <div className="row">
                        <div className="col-lg-12">
                            <div className="get-quote-area-service-wrapper">
                                <h3 className="title">Have questions?</h3>
                                <p>
                                    Call us +1 328 713 349 or click the button below to get in touch
                                </p>
                                <a
                                    href="#"
                                    className="rts-btn btn-primary wow fadeInUp"
                                    data-wow-delay=".5s"
                                >
                                    Contact sales
                                    <ReactSVG
                                        src="assets/images/service/icons/13.svg"
                                        alt="arrow"
                                    />
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="shape-left-right">
                    <img src="assets/images/cta/11.png" alt="left-area" className="left" />
                    <img src="assets/images/cta/12.png" alt="left-area" className="right" />
                </div>
            </div>
            {/* have you a questions area end */}
        </>
    )
}

export default CtaSix