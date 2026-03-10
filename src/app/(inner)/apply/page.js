
import BackToTop from "@/components/common/BackToTop";
import FooterOne from "@/components/footer/FooterOne";
import HeaderTwo from "@/components/header/HeaderTwo";

export default function Home() {
    return (
        <div className='#'>
            <HeaderTwo />
            <>
                {/* career single banner area start */}
                <div className="career-single-banner-area ptb--60 bg-light">
                    <div className="container">
                        <div className="row">
                            <div className="col-lg-12">
                                <div className="career-page-single-banner center-aligh" style={{ textAlign: 'center' }}>
                                    <span className="pre">We're Hiring</span>
                                    <h1 className="title">Join Our Team</h1>
                                    <p className="disc">
                                        We're looking for talented individuals to join Auctus. Currently hiring for Sales Person and HR positions.
                                    </p>
                                    <div className="single-career-wrapper">
                                        <div className="single">
                                            <h5 className="title">Open Positions</h5>
                                            <span>Sales Person, HR</span>
                                        </div>
                                        <div className="single">
                                            <h5 className="title">Location</h5>
                                            <span>Chennai, India</span>
                                        </div>
                                        <div className="single">
                                            <h5 className="title">Employment Type</h5>
                                            <span>Full-time</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                {/* career single banner area end */}
                {/* apply form here */}
                <div className="apply-form-area-start rts-section-gapTop">
                    <div className="container-contact">
                        <div className="row">
                            <div className="col-lg-12">
                                <div className="text-center-title-bg-white">
                                    <h2 className="title">Apply for a Position</h2>
                                    <p>Fill out the form below to apply for Sales Person or HR position at Auctus.</p>
                                </div>
                            </div>
                            <div className="col-lg-12">
                                <div className="apply-job-form">
                                    <form
                                        className="contact-form"
                                        action="mailto:auctustech.cnn@gmail.com"
                                        method="post"
                                        encType="text/plain"
                                    >
                                        <div className="single">
                                            <label htmlFor="position">Position Applying For *</label>
                                            <select
                                                id="position"
                                                name="position"
                                                required
                                                style={{
                                                    width: '100%',
                                                    padding: '12px 16px',
                                                    border: '1px solid #ddd',
                                                    borderRadius: '4px',
                                                    marginBottom: '20px'
                                                }}
                                            >
                                                <option value="">Select a position</option>
                                                <option value="Sales Person">Sales Person</option>
                                                <option value="HR">HR (Human Resources)</option>
                                            </select>
                                        </div>
                                        <div className="half-input-wrapper">
                                            <div className="single">
                                                <label htmlFor="name">First name *</label>
                                                <input
                                                    type="text"
                                                    id="name"
                                                    name="first_name"
                                                    placeholder="First name"
                                                    required
                                                />
                                            </div>
                                            <div className="single">
                                                <label htmlFor="last">Last name *</label>
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
                                            <label htmlFor="email">Email *</label>
                                            <input
                                                type="email"
                                                id="email"
                                                name="email"
                                                placeholder="you@email.com"
                                                required
                                            />
                                        </div>
                                        <div className="single">
                                            <label htmlFor="phone">Phone *</label>
                                            <input
                                                type="text"
                                                id="phone"
                                                name="phone"
                                                placeholder="+91 00000 00000"
                                                required
                                            />
                                        </div>
                                        <div className="single">
                                            <label htmlFor="location">Current Location (Optional)</label>
                                            <input
                                                type="text"
                                                id="location"
                                                name="location"
                                                placeholder="Your Location"
                                            />
                                        </div>
                                        <div className="single">
                                            <label htmlFor="experience">Years of Experience *</label>
                                            <input
                                                type="text"
                                                id="experience"
                                                name="experience"
                                                placeholder="e.g., 2 years"
                                                required
                                            />
                                        </div>
                                        <div className="single">
                                            <label htmlFor="message">Cover Letter / Summary (Optional)</label>
                                            <textarea
                                                id="message"
                                                name="message"
                                                placeholder="Tell us why you're a good fit for this role"
                                                rows={4}
                                                defaultValue={""}
                                            />
                                        </div>
                                        <label className="filelabel">
                                            <i className="fa fa-paperclip"></i>
                                            <span className="title">Upload Your CV (Required)</span>
                                            <input
                                                className="FileUpload1"
                                                id="FileInput"
                                                name="cv_attachment"
                                                type="file"
                                                accept=".pdf,.doc,.docx"
                                                required
                                            />
                                        </label>
                                        <button type="submit" className="rts-btn btn-primary">
                                            Submit Application
                                        </button>
                                    </form>
                                </div>
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
