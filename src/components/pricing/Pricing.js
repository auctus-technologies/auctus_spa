"use client"
import React from 'react'
import { ReactSVG } from 'react-svg';
function Pricing() {
    return (
        <div>
            {/* pricing area start */}
            <div className="rts-pricing-area rts-section-gapTop bg-gradient-pricing">
                <div className="bg-shape-area">
                    <img
                        loading="lazy"
                        rel="preload"
                        src="assets/images/pricing/01.png"
                        alt="shape"
                    />
                </div>
                <div className="container">
                    <div className="row">
                        <div className="col-lg-12">
                            <div className="text-center-title-bg-white">
                                <h2 className="title" style={{ fontSize: 64 }}>
                                    Pricing
                                </h2>
                                <p>
                                    HOffers a unified platform that fosters innovation while providing
                                    end-to-end data management. See how we help your team solve
                                    today’s biggest challenges.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="container-pricing">
                    <div className="row mt--80 g-0">
                        <div className="col-lg-6 col-md-6 col-sm-6 col-12">
                            <div className="single-pricing-area border-left">
                                <div className="head">
                                    <span className="pre">Starter</span>
                                    <h3 className="title">Free</h3>
                                    <p>Free Forever, Free Consultation.</p>
                                </div>
                                <div className="body">
                                    <a href="#" className="rts-btn btn-border">
                                        View case study
                                        <ReactSVG
                                            className="injectable"
                                            src="assets/images/service/icons/13.svg"
                                            alt="arrow"
                                        />
                                    </a>
                                    <span>No credit card required!</span>
                                </div>
                            </div>
                        </div>
                        <div className="col-lg-6 col-md-6 col-sm-6 col-12">
                            <div className="single-pricing-area">
                                <div className="head">
                                    <span className="pre">Pro</span>
                                    <h3 className="title">$79 mo</h3>
                                    <p>Billed annually.</p>
                                </div>
                                <div className="body">
                                    <a href="#" className="rts-btn btn-border">
                                        View case study
                                        <ReactSVG
                                            className="injectable"
                                            src="assets/images/service/icons/13.svg"
                                            alt="arrow"
                                        />
                                    </a>
                                    <span>No credit card required!</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <span className="moneyback d-block m-auto pt--80">
                    No credit cards required, 30 days money-back guarantee*
                </span>
            </div>
            {/* pricing area end */}
        </div>
    )
}

export default Pricing