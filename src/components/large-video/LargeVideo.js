"use client"
import Link from 'next/link';
import React, { useEffect, useState } from 'react';
import ModalVideo from 'react-modal-video';
import 'react-modal-video/css/modal-video.min.css';
import { ReactSVG } from 'react-svg';
function LargeVideo() {

    const [isOpen, setIsOpen] = useState(false);
    const videoLink = 'https://www.youtube.com/watch?v=tVbtTL_sJHI'; // Define the video link here
    const [videoId, setVideoId] = useState(null);
    useEffect(() => {
        // Extract the video ID from the video link
        if (videoLink) {
            const urlParts = videoLink.split('v='); // Assuming YouTube URL with 'v=' param
            const id = urlParts.length > 1 ? urlParts[1].split('&')[0] : null;
            setVideoId(id);
        }
    }, [videoLink]);
    // Console log to debug
    console.log('Video ID:', videoId);

    return (
        <div>
            {/* large video area start */}
            <div className="alrge-video-area rts-section-gap">
                <div className="shape-top">
                    <img
                        loading="lazy"
                        rel="preload"
                        src="assets/images/video/shape/01.png"
                        alt=""
                        className="wow move-right"
                        data-wow-offset={120}
                    />
                </div>
                <div className="shape-bottom">
                    <img
                        loading="lazy"
                        rel="preload"
                        src="assets/images/video/shape/02.png"
                        alt=""
                        className="wow move-left"
                        data-wow-offset={120}
                    />
                </div>
                <div className="container-large">
                    <div className="row">
                        <div className="col-lg-12">
                            <div className="title-video-top">
                                <p className="large">
                                    We have built a{" "}
                                    <span className="move-right" data-aos="move-right">
                                        {" "}
                                        purpose-driven
                                    </span>
                                    platform in the Metaverse to drive action and cooperation and to{" "}
                                    <span data-aos="move-left">
                                        revolutionize
                                    </span>{" "}
                                    progress.
                                </p>
                                <p className="disc">
                                    We have built a purpose-driven platform in the Metaverse to drive
                                    action and cooperation and to revolutionize progress.
                                </p>
                            </div>
                        </div>
                        <div className="col-lg-12 mt--70">
                            <div className="image--large-video jarallax">
                                <img
                                    className="jarallax-img"
                                    src="assets/images/video/01.webp"
                                    alt="large"
                                />
                                <div className="vedio-icone">
                                    <Link href={'#'} className="vedio-icone">
                                        <span id="play-video" className="video-play-button" onClick={() => setIsOpen(true)}>
                                            {/* <img
                                                    src="assets/images/about/shape/play-btn.png"
                                                    alt="Play btn"
                                                /> */}
                                            <span />
                                        </span>
                                    </Link>
                                </div>
                            </div>
                        </div>
                        <div className="col-lg-12">
                            <div className="large-video-bottom">
                                <h2 className="title wow fadeInUp" data-wow-delay=".1s">
                                    Download our Cloud Migration Guide
                                </h2>
                                <p className="disc wow fadeInUp" data-wow-delay=".3s">
                                    Learn best practices, avoid common pitfalls, and discover how to
                                    maximize the benefits of cloud computing for your business.
                                </p>
                                <a
                                    href="service-single.html"
                                    className="rts-btn btn-primary wow fadeInUp"
                                    data-wow-delay=".5s"
                                    style={{
                                        visibility: "visible",
                                        animationDelay: "0.7s",
                                        animationName: "fadeInUp"
                                    }}
                                >
                                    View Solutions
                                    <ReactSVG
                                        src="assets/images/service/icons/13.svg"
                                        alt="arrow"
                                    />
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            {/* large video area end */}
            {videoId && (
                <ModalVideo
                    channel="youtube"
                    isOpen={isOpen}
                    videoId={videoId} // Pass the dynamic video ID here
                    onClose={() => setIsOpen(false)}
                />
            )}
        </div>
    )
}

export default LargeVideo