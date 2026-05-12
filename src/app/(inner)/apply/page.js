"use client"
import { useState, useEffect, useRef, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import BackToTop from "@/components/common/BackToTop";
import FooterOne from "@/components/footer/FooterOne";
import HeaderTwo from "@/components/header/HeaderTwo";
import { API_URL as API_BASE } from "@/app/dashboard/endpoint/endpoint";

const DEPARTMENT_LABELS = {
    management:  "Management",
    development: "Development",
    hr:          "Human Resources",
    finance:     "Finance",
    marketing:   "Marketing",
    sales:       "Sales",
};


const toTitleCase = (str) =>
    str ? str.replace(/\b\w/g, (c) => c.toUpperCase()) : "";

const inputStyle = {
    width: "100%",
    padding: "12px 14px",
    fontSize: "15px",
    border: "1.5px solid #e5e7eb",
    borderRadius: "8px",
    background: "#f9fafb",
    color: "#111827",
    outline: "none",
    boxSizing: "border-box",
    fontFamily: "inherit",
    display: "block",
};

const labelStyle = {
    display: "block",
    fontSize: "14px",
    fontWeight: 600,
    color: "#374151",
    marginBottom: "6px",
};

function DropZone({ label, id, name, accept, required }) {
    const [file, setFile] = useState(null);
    const inputRef = useRef(null);

    const clearFile = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setFile(null);
        if (inputRef.current) inputRef.current.value = "";
    };

    return (
        <div style={{ marginBottom: "20px" }}>
            <p style={labelStyle}>{label}</p>
            <div style={{ border: "1.5px solid #e5e7eb", borderRadius: "10px", padding: "12px 14px", background: "#f9fafb" }}>
                {/* Choose button row */}
                <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                    <label
                        htmlFor={id}
                        style={{
                            display: "inline-flex", alignItems: "center", gap: "7px",
                            background: "#00838f", color: "#fff",
                            padding: "8px 16px", borderRadius: "8px",
                            fontSize: "13px", fontWeight: 600, cursor: "pointer",
                            flexShrink: 0, userSelect: "none",
                        }}
                    >
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                            <polyline points="17,8 12,3 7,8"/>
                            <line x1="12" y1="3" x2="12" y2="15"/>
                        </svg>
                        Choose File
                        <input
                            ref={inputRef}
                            type="file"
                            id={id}
                            name={name}
                            accept={accept}
                            required={required && !file}
                            style={{ display: "none" }}
                            onChange={(e) => setFile(e.target.files[0] || null)}
                        />
                    </label>
                    <span style={{ fontSize: "13px", color: "#9ca3af" }}>
                        {file ? file.name : "No file chosen"}
                    </span>
                </div>

                {/* Selected file row */}
                {file && (
                    <div style={{
                        display: "flex", alignItems: "center", justifyContent: "space-between",
                        marginTop: "10px", background: "#fff",
                        border: "1px solid #e5e7eb", borderRadius: "8px", padding: "8px 12px",
                    }}>
                        <div style={{ display: "flex", alignItems: "center", gap: "10px", minWidth: 0 }}>
                            <div style={{
                                width: "32px", height: "32px", background: "#f0faf9",
                                borderRadius: "6px", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
                            }}>
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#00838f" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
                                </svg>
                            </div>
                            <span style={{ fontSize: "13px", fontWeight: 600, color: "#374151", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                                {file.name}
                            </span>
                        </div>
                        <button
                            type="button"
                            onClick={clearFile}
                            title="Remove"
                            style={{
                                background: "#fee2e2", border: "none", borderRadius: "50%",
                                width: "24px", height: "24px", cursor: "pointer", flexShrink: 0,
                                display: "flex", alignItems: "center", justifyContent: "center",
                                color: "#ef4444", fontSize: "12px", fontWeight: 700, marginLeft: "8px",
                            }}
                        >
                            ✕
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}

function ApplyContent() {
    const searchParams = useSearchParams();
    const openingId = searchParams.get("id");

    const [opening, setOpening] = useState(null);
    const [loading, setLoading] = useState(!!openingId);
    const [experience, setExperience] = useState("");
    const [expError, setExpError] = useState("");
    const [submitting, setSubmitting] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [submitError, setSubmitError] = useState("");
    const [formKey, setFormKey] = useState(0);

    useEffect(() => {
        if (!openingId) return;
        fetch(`${API_BASE}/openings/${openingId}`)
            .then((r) => r.ok ? r.json() : Promise.reject())
            .then((data) => setOpening(data))
            .catch(() => setOpening(null))
            .finally(() => setLoading(false));
    }, [openingId]);

    const jobTitle = opening ? toTitleCase(opening.job_title) : "Open Position";
    const dept     = opening?.department ? (DEPARTMENT_LABELS[opening.department] || opening.department) : null;
    const location = opening?.location || "Chennai, India";
    const skills   = opening?.skills_required
        ? opening.skills_required.split(",").map((s) => s.trim()).filter(Boolean)
        : [];

    return (
        <div style={{ background: "#fff", padding: "64px 0 96px" }}>
            <div className="container">
                {loading ? (
                    <div style={{ textAlign: "center", padding: "80px 0", fontSize: "18px", color: "#9ca3af" }}>
                        Loading job details…
                    </div>
                ) : (
                    <div className="row" style={{ alignItems: "flex-start" }}>

                        {/* ── Left: Job Details ── */}
                        <div className="col-lg-7 mb_md--50 mb_sm--50" style={{ paddingRight: "clamp(16px, 5vw, 60px)", overflow: "hidden" }}>

                            <h1 style={{ fontSize: "clamp(28px, 4vw, 44px)", fontWeight: 800, color: "#111827", margin: "0 0 20px", lineHeight: 1.1, letterSpacing: "-0.02em" }}>
                                {jobTitle}
                            </h1>

                            {/* Badge row */}
                            <div style={{ display: "flex", flexWrap: "wrap", gap: "10px", marginBottom: "32px", alignItems: "center" }}>
                                {opening?.required_experience != null && (
                                    <span style={{ display: "inline-flex", alignItems: "center", gap: "6px", border: "1.5px solid #b2dfdb", borderRadius: "30px", padding: "6px 14px", fontSize: "14px", color: "#00838f", fontWeight: 700, background: "#f0faf9" }}>
                                        <svg width="14" height="14" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/>
                                        </svg>
                                        {opening.required_experience}+ yrs experience
                                    </span>
                                )}
                                <span style={{ display: "inline-flex", alignItems: "center", gap: "6px", border: "1.5px solid #e5e7eb", borderRadius: "30px", padding: "6px 14px", fontSize: "14px", color: "#374151", fontWeight: 600 }}>
                                    <svg width="14" height="14" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a2 2 0 01-2.828 0l-4.243-4.243a8 8 0 1111.314 0z"/>
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/>
                                    </svg>
                                    {location}
                                </span>
                                <div style={{ display: "inline-flex", alignItems: "center", gap: "10px", flexShrink: 0 }}>
                                    {dept && (
                                        <span style={{ background: "#00838f", color: "#fff", borderRadius: "30px", padding: "6px 16px", fontSize: "14px", fontWeight: 700 }}>
                                            {dept}
                                        </span>
                                    )}
                                    <button
                                        type="button"
                                        onClick={() => navigator.share?.({ title: jobTitle, url: window.location.href })}
                                        style={{ display: "inline-flex", alignItems: "center", gap: "6px", border: "1.5px solid #e5e7eb", borderRadius: "30px", padding: "6px 14px", fontSize: "14px", color: "#374151", fontWeight: 600, background: "none", cursor: "pointer" }}
                                    >
                                        <svg width="14" height="14" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"/>
                                        </svg>
                                        Share this job
                                    </button>
                                </div>
                            </div>

                            <hr style={{ margin: "0 0 36px", border: "none", borderTop: "1.5px solid #f3f4f6" }} />

                            {/* Responsibilities → Job Description */}
                            {opening?.responsibilities && (
                                <div style={{ marginBottom: "36px" }}>
                                    <h3 style={{ fontSize: "19px", fontWeight: 700, color: "#111827", margin: "0 0 14px" }}>
                                        Job Description:
                                    </h3>
                                    <p style={{ fontSize: "15px", color: "#4b5563", lineHeight: "1.9", margin: 0, whiteSpace: "pre-line", wordBreak: "break-word", overflowWrap: "break-word" }}>
                                        {opening.responsibilities}
                                    </p>
                                </div>
                            )}

                            {/* Qualification → Requirements */}
                            {opening?.qualification_required && (
                                <div style={{ marginBottom: "36px" }}>
                                    <h3 style={{ fontSize: "19px", fontWeight: 700, color: "#111827", margin: "0 0 14px" }}>
                                        Requirements:
                                    </h3>
                                    <p style={{ fontSize: "15px", color: "#4b5563", lineHeight: "1.9", margin: 0, whiteSpace: "pre-line", wordBreak: "break-word", overflowWrap: "break-word" }}>
                                        {opening.qualification_required}
                                    </p>
                                </div>
                            )}

                            {/* Skills */}
                            {skills.length > 0 && (
                                <div>
                                    <h3 style={{ fontSize: "19px", fontWeight: 700, color: "#111827", margin: "0 0 14px" }}>
                                        Skills Required:
                                    </h3>
                                    <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
                                        {skills.map((skill, i) => (
                                            <span key={i} style={{ fontSize: "14px", padding: "6px 16px", borderRadius: "30px", border: "1.5px solid #e5e7eb", background: "#f9fafb", color: "#374151", fontWeight: 600 }}>
                                                {skill.charAt(0).toUpperCase() + skill.slice(1)}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {!opening && (
                                <p style={{ fontSize: "16px", color: "#9ca3af", padding: "40px 0" }}>
                                    No specific position selected. You can still apply using the form.
                                </p>
                            )}
                        </div>

                        {/* ── Success Modal ── */}
                        {showModal && (
                            <div
                                onClick={() => setShowModal(false)}
                                style={{
                                    position: "fixed", inset: 0, background: "rgba(0,0,0,0.45)",
                                    display: "flex", alignItems: "center", justifyContent: "center",
                                    zIndex: 9999, animation: "fadeInOverlay 0.25s ease",
                                }}
                            >
                                <style>{`
                                    @keyframes fadeInOverlay { from { opacity:0 } to { opacity:1 } }
                                    @keyframes popUp { from { opacity:0; transform:scale(0.7) } to { opacity:1; transform:scale(1) } }
                                    @keyframes drawCheck {
                                        from { stroke-dashoffset: 60 }
                                        to   { stroke-dashoffset: 0 }
                                    }
                                    @keyframes scaleCircle {
                                        0%   { transform: scale(0) }
                                        60%  { transform: scale(1.1) }
                                        100% { transform: scale(1) }
                                    }
                                `}</style>
                                <div
                                    onClick={(e) => e.stopPropagation()}
                                    style={{
                                        background: "#fff", borderRadius: "20px", padding: "48px 36px",
                                        maxWidth: "420px", width: "90%", textAlign: "center",
                                        boxShadow: "0 20px 60px rgba(0,0,0,0.15)",
                                        animation: "popUp 0.35s cubic-bezier(0.34,1.56,0.64,1)",
                                    }}
                                >
                                    {/* Animated circle + checkmark */}
                                    <svg width="80" height="80" viewBox="0 0 80 80" style={{ marginBottom: "20px" }}>
                                        <circle
                                            cx="40" cy="40" r="36"
                                            fill="none" stroke="#00838f" strokeWidth="4"
                                            style={{ animation: "scaleCircle 0.4s ease forwards" }}
                                        />
                                        <polyline
                                            points="24,42 35,53 56,30"
                                            fill="none" stroke="#00838f" strokeWidth="4"
                                            strokeLinecap="round" strokeLinejoin="round"
                                            strokeDasharray="60" strokeDashoffset="60"
                                            style={{ animation: "drawCheck 0.4s ease 0.3s forwards" }}
                                        />
                                    </svg>
                                    <h3 style={{ fontSize: "22px", fontWeight: 800, color: "#111827", marginBottom: "10px" }}>
                                        Application Submitted!
                                    </h3>
                                    <p style={{ fontSize: "15px", color: "#6b7280", lineHeight: 1.6, marginBottom: "28px" }}>
                                        We've received your application and will get back to you soon. Good luck!
                                    </p>
                                    <button
                                        onClick={() => setShowModal(false)}
                                        style={{
                                            background: "#00838f", color: "#fff", border: "none",
                                            borderRadius: "10px", padding: "12px 32px",
                                            fontSize: "15px", fontWeight: 700, cursor: "pointer",
                                        }}
                                    >
                                        Close
                                    </button>
                                </div>
                            </div>
                        )}

                        {/* ── Right: Application Form ── */}
                        <div className="col-lg-5">
                            <form key={formKey} onSubmit={async (e) => {
                                e.preventDefault();
                                const val = parseInt(experience, 10);
                                if (!experience || isNaN(val) || val < 0 || val > 50) {
                                    setExpError("Please enter a valid experience (0–50 years).");
                                    return;
                                }
                                if (opening?.required_experience != null && val < opening.required_experience) {
                                    setExpError(`This role requires at least ${opening.required_experience} year${opening.required_experience !== 1 ? 's' : ''} of experience. You entered ${val}.`);
                                    return;
                                }
                                setExpError("");
                                setSubmitError("");
                                setSubmitting(true);
                                const fd = new FormData(e.target);
                                fd.set("experience", String(val));
                                if (openingId) fd.set("opening_id", openingId);
                                try {
                                    const res = await fetch(`${API_BASE}/applications`, {
                                        method: "POST",
                                        body: fd,
                                    });
                                    if (res.ok) {
                                        setShowModal(true);
                                        setExperience("");
                                        setFormKey((k) => k + 1);
                                    } else {
                                        const err = await res.json();
                                        if (res.status === 409) {
                                            setSubmitError(err?.detail || "You've already applied for this job. Please wait 6 months before reapplying.");
                                        } else {
                                            setSubmitError(err?.detail || "Submission failed. Please try again.");
                                        }
                                    }
                                } catch {
                                    setSubmitError("Network error. Please try again.");
                                } finally {
                                    setSubmitting(false);
                                }
                            }}>
                                {/* Full Name */}
                                <div style={{ marginBottom: "16px" }}>
                                    <label htmlFor="fullname" style={labelStyle}>Full Name *</label>
                                    <input type="text" id="fullname" name="full_name" placeholder="Full name" required style={inputStyle} />
                                </div>

                                {/* Email + Phone */}
                                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "14px", marginBottom: "16px" }}>
                                    <div>
                                        <label htmlFor="email" style={labelStyle}>Email *</label>
                                        <input type="email" id="email" name="email" placeholder="Email Address" required style={inputStyle} />
                                    </div>
                                    <div>
                                        <label htmlFor="phone" style={labelStyle}>Phone number</label>
                                        <input type="text" id="phone" name="phone" placeholder="Phone number" style={inputStyle} />
                                    </div>
                                </div>

                                {/* City */}
                                <div style={{ marginBottom: "16px" }}>
                                    <label htmlFor="city" style={labelStyle}>City</label>
                                    <input type="text" id="city" name="city" placeholder="City" style={inputStyle} />
                                </div>

                                {/* Experience */}
                                <div style={{ marginBottom: "16px" }}>
                                    <label htmlFor="experience" style={labelStyle}>
                                        Years of Experience *
                                        {opening?.required_experience != null && (
                                            <span style={{ fontWeight: 400, color: "#6b7280", marginLeft: "6px" }}>
                                                (min. {opening.required_experience} yr{opening.required_experience !== 1 ? 's' : ''} required)
                                            </span>
                                        )}
                                    </label>
                                    <input
                                        type="number"
                                        id="experience"
                                        name="experience"
                                        placeholder="e.g. 3"
                                        min="0"
                                        max="50"
                                        value={experience}
                                        onChange={(e) => { setExperience(e.target.value); setExpError(""); }}
                                        onBlur={(e) => {
                                            const val = parseInt(e.target.value, 10);
                                            if (e.target.value === '') return;
                                            if (isNaN(val) || val < 0 || val > 50) {
                                                setExpError("Please enter a valid experience (0–50 years).");
                                            } else if (opening?.required_experience != null && val < opening.required_experience) {
                                                setExpError(`This role requires at least ${opening.required_experience} year${opening.required_experience !== 1 ? 's' : ''} of experience. You entered ${val}.`);
                                            }
                                        }}
                                        style={{ ...inputStyle, borderColor: expError ? "#ef4444" : "#e5e7eb" }}
                                    />
                                    {expError && <p style={{ color: "#ef4444", fontSize: "13px", margin: "4px 0 0" }}>{expError}</p>}
                                </div>

                                {/* Resume drop zone */}
                                <DropZone label="Resume" id="cv_input" name="resume" accept=".pdf,.doc,.docx" required />

                                {submitError && (
                                    <p style={{ color: "#ef4444", fontSize: "14px", marginBottom: "12px", textAlign: "center" }}>{submitError}</p>
                                )}

                                {/* Submit */}
                                <button
                                    type="submit"
                                    disabled={submitting}
                                    style={{ width: "100%", background: submitting ? "#7bb8be" : "#00838f", color: "#fff", border: "none", borderRadius: "10px", padding: "17px", fontSize: "18px", fontWeight: 700, cursor: submitting ? "not-allowed" : "pointer", letterSpacing: "0.01em" }}
                                >
                                    {submitting ? "Submitting…" : "Apply"}
                                </button>
                            </form>
                        </div>

                    </div>
                )}
            </div>
        </div>
    );
}

export default function ApplyPage() {
    return (
        <div className="#">
            <HeaderTwo />
            <Suspense fallback={<div style={{ padding: "80px", textAlign: "center", fontSize: "18px", color: "#9ca3af" }}>Loading…</div>}>
                <ApplyContent />
            </Suspense>
            <FooterOne />
            <BackToTop />
        </div>
    );
}
