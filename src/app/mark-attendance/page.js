'use client';

import { useState, useEffect, useRef } from 'react';

import { API_URL } from '@/app/dashboard/endpoint/endpoint';

// ─── Helpers ──────────────────────────────────────────────────────────────────

function fmt12(dateObj) {
  if (!dateObj) return '';
  const p = (n) => String(n).padStart(2, '0');
  const h = dateObj.getHours();
  return `${p(h % 12 || 12)}:${p(dateObj.getMinutes())}:${p(dateObj.getSeconds())} ${h >= 12 ? 'PM' : 'AM'}`;
}

function fmtDate(dateObj) {
  if (!dateObj) return '';
  const p = (n) => String(n).padStart(2, '0');
  return `${p(dateObj.getDate())}/${p(dateObj.getMonth() + 1)}/${dateObj.getFullYear()}`;
}

// ─── Success Modal ────────────────────────────────────────────────────────────

function SuccessModal({ data, onClose }) {
  const isCheckIn = data.action === 'check_in';

  return (
    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm overflow-hidden">
      {/* Header band */}
      <div className={`px-6 pt-7 pb-5 text-center ${isCheckIn ? 'bg-emerald-50' : 'bg-blue-50'}`}>
        <div className={`w-14 h-14 rounded-full mx-auto mb-3 flex items-center justify-center ${isCheckIn ? 'bg-emerald-100' : 'bg-blue-100'}`}>
          {isCheckIn ? (
            <svg width="28" height="28" fill="none" stroke="#10b981" strokeWidth="2.2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
          ) : (
            <svg width="28" height="28" fill="none" stroke="#3b82f6" strokeWidth="2.2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
          )}
        </div>
        <p className={`text-sm font-semibold mb-1 ${isCheckIn ? 'text-emerald-600' : 'text-blue-600'}`}>
          {isCheckIn ? 'Checked in successfully' : 'Checked out successfully'}
        </p>
        <h2 className="text-xl font-bold text-gray-900">{data.user_name}</h2>
      </div>

      {/* Details */}
      <div className="px-6 py-4 space-y-3">
        {/* Badges row */}
        <div className="flex flex-wrap gap-2">
          <span className="text-xs bg-gray-100 text-gray-700 px-2.5 py-1 rounded-full font-medium">
            {data.employee_id}
          </span>
          <span className="text-xs bg-purple-50 text-purple-700 px-2.5 py-1 rounded-full font-medium">
            {data.designation}
          </span>
          <span className="text-xs bg-indigo-50 text-indigo-700 px-2.5 py-1 rounded-full font-medium">
            {data.department}
          </span>
          {data.match_confidence != null && (
            <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${
              data.match_confidence >= 60 ? 'bg-emerald-50 text-emerald-700' :
              data.match_confidence >= 40 ? 'bg-yellow-50 text-yellow-700' :
              'bg-orange-50 text-orange-700'
            }`}>
              {data.match_confidence}% match
            </span>
          )}
        </div>

        <div className="border-t border-gray-100 pt-3 space-y-2.5">
          {/* Check-in row */}
          <div className="flex items-start gap-2.5">
            <div className="w-7 h-7 rounded-md bg-emerald-50 flex items-center justify-center shrink-0 mt-0.5">
              <svg width="14" height="14" fill="none" stroke="#10b981" strokeWidth="2" viewBox="0 0 24 24">
                <circle cx="12" cy="12" r="10" /><path strokeLinecap="round" d="M12 6v6l4 2" />
              </svg>
            </div>
            <div>
              <p className="text-xs text-gray-400 leading-none mb-0.5">Check-in</p>
              <p className="text-sm font-semibold text-gray-800">{data.check_in_time}</p>
              <p className="text-xs text-gray-500">{data.check_in_date}</p>
            </div>
          </div>

          {/* Check-out row (only shown after check-out) */}
          {isCheckIn ? null : (
            <div className="flex items-start gap-2.5">
              <div className="w-7 h-7 rounded-md bg-blue-50 flex items-center justify-center shrink-0 mt-0.5">
                <svg width="14" height="14" fill="none" stroke="#3b82f6" strokeWidth="2" viewBox="0 0 24 24">
                  <circle cx="12" cy="12" r="10" /><path strokeLinecap="round" d="M12 6v6l4 2" />
                </svg>
              </div>
              <div>
                <p className="text-xs text-gray-400 leading-none mb-0.5">Check-out</p>
                <p className="text-sm font-semibold text-gray-800">{data.check_out_time}</p>
                <p className="text-xs text-gray-500">{data.check_out_date}</p>
              </div>
            </div>
          )}

          {/* Address row */}
          {(isCheckIn ? data.check_in_address : data.check_out_address) && (
            <div className="flex items-start gap-2.5">
              <div className="w-7 h-7 rounded-md bg-orange-50 flex items-center justify-center shrink-0 mt-0.5">
                <svg width="14" height="14" fill="none" stroke="#f97316" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z" />
                  <circle cx="12" cy="9" r="2.5" />
                </svg>
              </div>
              <div className="min-w-0">
                <p className="text-xs text-gray-400 leading-none mb-0.5">Location</p>
                <p className="text-xs text-gray-600 leading-snug break-words">
                  {(isCheckIn ? data.check_in_address : data.check_out_address)
                    .split(',').slice(0, 3).join(',')}
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Action button */}
      <div className="px-6 pb-6">
        <button
          onClick={onClose}
          className={`w-full py-2.5 rounded-xl text-sm font-semibold text-white transition-all active:scale-[0.98] ${isCheckIn ? 'bg-emerald-500 hover:bg-emerald-600' : 'bg-blue-500 hover:bg-blue-600'}`}
        >
          Done
        </button>
      </div>
    </div>
  );
}

// ─── Error Modal ──────────────────────────────────────────────────────────────

function ErrorModal({ message, onClose }) {
  return (
    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-xs p-6 text-center">
      <div className="w-14 h-14 rounded-full bg-red-50 flex items-center justify-center mx-auto mb-4">
        <svg width="28" height="28" fill="none" stroke="#ef4444" strokeWidth="2.2" viewBox="0 0 24 24">
          <circle cx="12" cy="12" r="10" />
          <path strokeLinecap="round" d="M15 9l-6 6M9 9l6 6" />
        </svg>
      </div>
      <h3 className="text-base font-bold text-gray-900 mb-1">{message}</h3>
      <p className="text-xs text-gray-500 mb-5">Please try again or contact admin.</p>
      <button
        onClick={onClose}
        className="w-full py-2.5 rounded-xl bg-red-500 hover:bg-red-600 text-white text-sm font-semibold transition-all active:scale-[0.98]"
      >
        Try Again
      </button>
    </div>
  );
}

// ─── Already-completed Modal ──────────────────────────────────────────────────

function AlreadyDoneModal({ message, onClose }) {
  return (
    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-xs p-6 text-center">
      <div className="w-14 h-14 rounded-full bg-yellow-50 flex items-center justify-center mx-auto mb-4">
        <svg width="28" height="28" fill="none" stroke="#f59e0b" strokeWidth="2.2" viewBox="0 0 24 24">
          <circle cx="12" cy="12" r="10" />
          <path strokeLinecap="round" d="M12 8v4m0 4h.01" />
        </svg>
      </div>
      <h3 className="text-base font-bold text-gray-900 mb-1">Already Recorded</h3>
      <p className="text-xs text-gray-500 mb-5">{message}</p>
      <button
        onClick={onClose}
        className="w-full py-2.5 rounded-xl bg-yellow-400 hover:bg-yellow-500 text-white text-sm font-semibold transition-all active:scale-[0.98]"
      >
        OK
      </button>
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function MarkAttendancePage() {
  const videoRef  = useRef(null);
  const canvasRef = useRef(null);
  const streamRef = useRef(null);

  const [mobile,      setMobile]      = useState('');
  const [mobileError, setMobileError] = useState('');
  const [timestamp,   setTimestamp]   = useState('');
  const [camError,    setCamError]    = useState('');
  const [camReady,    setCamReady]    = useState(false);
  const [loading,     setLoading]     = useState(false);
  const [address,     setAddress]     = useState('Fetching location…');
  const [modal,       setModal]       = useState(null);

  // ── Live clock ──────────────────────────────────────────────────────────
  useEffect(() => {
    const tick = () => {
      const now = new Date();
      setTimestamp(`${fmt12(now)}  ${fmtDate(now)}`);
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  // ── Webcam ──────────────────────────────────────────────────────────────
  useEffect(() => {
    let cancelled = false;
    navigator.mediaDevices
      .getUserMedia({
        video: {
          facingMode: 'user',
          width:  { ideal: 1280 },
          height: { ideal: 720 },
          frameRate: { ideal: 30 },
        },
        audio: false,
      })
      .then((stream) => {
        if (cancelled) { stream.getTracks().forEach((t) => t.stop()); return; }
        streamRef.current = stream;
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          videoRef.current.onloadedmetadata = () => {
            videoRef.current.play();
            setCamReady(true);
          };
        }
      })
      .catch((err) => {
        if (!cancelled)
          setCamError(
            err.name === 'NotAllowedError'
              ? 'Camera access denied. Please allow permission and reload.'
              : 'Unable to start camera.'
          );
      });
    return () => {
      cancelled = true;
      streamRef.current?.getTracks().forEach((t) => t.stop());
    };
  }, []);

  // ── Geolocation + reverse-geocode ──────────────────────────────────────
  useEffect(() => {
    if (!navigator.geolocation) { setAddress('Location unavailable'); return; }
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        try {
          const { latitude: lat, longitude: lon } = pos.coords;
          const res  = await fetch(
            `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lon}&format=json`,
            { headers: { 'Accept-Language': 'en' } }
          );
          const data = await res.json();
          setAddress(data.display_name || `${lat.toFixed(5)}, ${lon.toFixed(5)}`);
        } catch {
          const { latitude: lat, longitude: lon } = pos.coords;
          setAddress(`${lat.toFixed(5)}, ${lon.toFixed(5)}`);
        }
      },
      () => setAddress('Location unavailable')
    );
  }, []);

  // ── Capture live frame and immediately verify ───────────────────────────
  const handleContinue = async () => {
    if (!mobile.trim())           { setMobileError('Mobile number is required'); return; }
    if (!/^\d{10}$/.test(mobile)) { setMobileError('Enter a valid 10-digit mobile number'); return; }
    if (!camReady)                { setMobileError('Camera is not ready. Please wait.'); return; }

    setMobileError('');
    const video  = videoRef.current;
    const canvas = canvasRef.current;
    if (!video || !canvas) return;

    // Resize to 640×480 — optimal for DeepFace/ArcFace
    canvas.width  = 640;
    canvas.height = 480;
    const ctx = canvas.getContext('2d');
    // Raw (non-mirrored) frame — correct orientation for ArcFace
    ctx.drawImage(video, 0, 0, 640, 480);
    const base64 = canvas.toDataURL('image/jpeg', 0.95).split(',')[1];

    setLoading(true);
    try {
      const res  = await fetch(`${API_URL}/attendance/mark-face`, {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone: mobile, photo_base64: base64, address }),
      });
      const data = await res.json();

      if (res.status === 404 || data.error === 'user_not_found') {
        setModal({ type: 'error', message: 'User not found' });
      } else if (data.error === 'face_not_recognized') {
        setModal({ type: 'error', message: 'Your face is not recognized' });
      } else if (res.status === 409 || data.error === 'already_completed') {
        setModal({ type: 'already_done', message: data.message });
      } else if (!res.ok) {
        setModal({ type: 'error', message: data.message || 'Something went wrong. Please try again.' });
      } else {
        setModal({ type: 'success', ...data });
      }
    } catch {
      setModal({ type: 'error', message: 'Network error. Please try again.' });
    } finally {
      setLoading(false);
    }
  };

  const closeModal = () => { setModal(null); setMobile(''); };

  // ── Overlay location (truncated to first 2 segments for readability) ────
  const shortAddress = address === 'Fetching location…' || address === 'Location unavailable'
    ? address
    : address.split(',').slice(0, 2).join(',');

  // ── Render ──────────────────────────────────────────────────────────────
  return (
    <div className="h-dvh md:h-screen flex flex-col md:flex-row overflow-hidden">

      {/* Hidden canvas for frame capture */}
      <canvas ref={canvasRef} className="hidden" />

      {/* ══ LEFT BRAND PANEL — desktop only ══════════════════════════════ */}
      <div className="hidden md:flex md:w-[42%] lg:w-2/5 flex-col relative overflow-hidden bg-primary">

        {/* Decorative blobs */}
        <div className="absolute -top-28 -left-28 w-80 h-80 rounded-full bg-white/5" />
        <div className="absolute top-1/2 -translate-y-1/2 -right-16 w-56 h-56 rounded-full bg-white/5" />
        <div className="absolute -bottom-24 -right-24 w-96 h-96 rounded-full bg-white/5" />
        <div className="absolute bottom-1/3 -left-8 w-28 h-28 rounded-full bg-white/10" />

        {/* Dot grid */}
        <div className="absolute inset-0 opacity-[0.06]"
          style={{ backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)', backgroundSize: '24px 24px' }}
        />

        <div className="relative z-10 flex-1 flex flex-col items-center justify-center px-10 py-12">
          <img
            src="/assets/images/logo/logo-1.svg"
            alt="Auctus"
            className="h-9 mb-10"
            style={{ filter: 'brightness(0) invert(1)' }}
          />
          <h1 className="text-2xl lg:text-3xl font-bold text-white text-center leading-snug mb-3">
            Attendance Portal
          </h1>
          <p className="text-white/60 text-sm text-center leading-relaxed max-w-[260px] mb-10">
            Position your face in the frame and enter your registered mobile number to mark attendance.
          </p>

          <div className="w-full max-w-[280px] space-y-3">
            <div className="bg-white/10 rounded-xl p-4 flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-white/20 flex items-center justify-center shrink-0">
                <svg width="18" height="18" fill="none" stroke="white" strokeWidth="1.8" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 10l4.553-2.276A1 1 0 0121 8.723v6.554a1 1 0 01-1.447.894L15 14M4 8h8a2 2 0 012 2v4a2 2 0 01-2 2H4a2 2 0 01-2-2v-4a2 2 0 012-2z" />
                </svg>
              </div>
              <div>
                <p className="text-white text-sm font-semibold">Face Recognition</p>
                <p className="text-white/55 text-xs mt-0.5">Face verification</p>
              </div>
            </div>

            <div className="bg-white/10 rounded-xl p-4 flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-white/20 flex items-center justify-center shrink-0">
                <svg width="18" height="18" fill="none" stroke="white" strokeWidth="1.8" viewBox="0 0 24 24">
                  <rect x="5" y="2" width="14" height="20" rx="2" />
                  <line x1="12" y1="18" x2="12" y2="18" strokeLinecap="round" strokeWidth="2" />
                </svg>
              </div>
              <div>
                <p className="text-white text-sm font-semibold">Mobile Verification</p>
                <p className="text-white/55 text-xs mt-0.5">Enter your registered number</p>
              </div>
            </div>

            <div className="bg-white/10 rounded-xl p-4 flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-white/20 flex items-center justify-center shrink-0">
                <svg width="18" height="18" fill="none" stroke="white" strokeWidth="1.8" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z" />
                  <circle cx="12" cy="9" r="2.5" />
                </svg>
              </div>
              <div>
                <p className="text-white text-sm font-semibold">Location Tagged</p>
                <p className="text-white/55 text-xs mt-0.5">GPS address recorded</p>
              </div>
            </div>
          </div>
        </div>

        <div className="relative z-10 pb-6 text-center">
          <p className="text-white/30 text-xs">© {new Date().getFullYear()} Auctus Technologies</p>
        </div>
      </div>

      {/* ══ RIGHT CAMERA PANEL ════════════════════════════════════════════ */}
      <div className="flex-1 flex flex-col items-center justify-center bg-gray-50 overflow-y-auto p-4 md:p-6">

        {/* Logo — mobile only */}
        <img
          src="/assets/images/logo/logo-1.svg"
          alt="Auctus"
          className="h-10 mb-5 shrink-0 md:hidden"
        />

        <div className="
          w-full bg-white overflow-hidden flex flex-col
          flex-1 min-h-0
          md:flex-none md:max-w-sm md:rounded-xl md:border md:border-gray-100 md:shadow-sm
        ">

          {/* ── Camera area ── */}
          <div className="relative flex-1 min-h-0 w-full md:flex-none md:h-[480px] bg-black">

            {/* Placeholder / error */}
            {!camReady && (
              <div className="absolute inset-0 bg-primary/5 flex flex-col items-center justify-center gap-3">
                {camError ? (
                  <>
                    <div className="w-14 h-14 rounded-full bg-red-50 flex items-center justify-center">
                      <svg width="26" height="26" fill="none" stroke="#ef4444" strokeWidth="1.5" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 10l4.553-2.276A1 1 0 0121 8.723v6.554a1 1 0 01-1.447.894L15 14M4 8h8a2 2 0 012 2v4a2 2 0 01-2 2H4a2 2 0 01-2-2v-4a2 2 0 012-2z" />
                        <line x1="2" y1="2" x2="22" y2="22" strokeLinecap="round" />
                      </svg>
                    </div>
                    <p className="text-xs text-red-500 text-center px-8 leading-relaxed">{camError}</p>
                  </>
                ) : (
                  <>
                    <div className="w-10 h-10 rounded-full border-2 border-gray-200 border-t-primary animate-spin" />
                    <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center">
                      <svg width="26" height="26" fill="none" stroke="var(--color-primary)" strokeWidth="1.5" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 10l4.553-2.276A1 1 0 0121 8.723v6.554a1 1 0 01-1.447.894L15 14M4 8h8a2 2 0 012 2v4a2 2 0 01-2 2H4a2 2 0 01-2-2v-4a2 2 0 012-2z" />
                      </svg>
                    </div>
                    <p className="text-xs text-gray-400">Starting camera…</p>
                  </>
                )}
              </div>
            )}

            {/* Live feed — always visible when camera is ready */}
            <video
              ref={videoRef}
              muted
              playsInline
              className="absolute inset-0 w-full h-full object-cover"
              style={{
                transform: 'scaleX(-1)',
                display: camReady ? 'block' : 'none',
              }}
            />

            {/* Face guide overlay */}
            {camReady && (
              <div
                className="absolute pointer-events-none"
                style={{
                  top: '10%', left: '13%', right: '13%', bottom: '12%',
                  border: '2px dashed rgba(255,255,255,0.85)',
                  borderRadius: '6px',
                  opacity: 0.75,
                }}
              />
            )}

            {/* Verifying overlay */}
            {loading && (
              <div className="absolute inset-0 bg-black/55 flex flex-col items-center justify-center gap-3">
                <div className="w-10 h-10 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                <p className="text-white text-xs font-medium">Verifying face…</p>
              </div>
            )}

            {/* Timestamp + location overlay */}
            {!loading && camReady && (
              <div className="absolute bottom-3 left-3 right-3 pointer-events-none">
                <span className="text-xs font-medium" style={{
                  color: '#f87171',
                  textShadow: '0 1px 3px rgba(0,0,0,0.65)',
                }}>
                  {timestamp}&nbsp;&nbsp;{shortAddress}
                </span>
              </div>
            )}
          </div>

          {/* ── Form ── */}
          <div className="shrink-0 p-4 md:p-5 bg-white space-y-3 md:space-y-4">

            <div>
              <div className="relative">
                <input
                  type="tel"
                  value={mobile}
                  onChange={(e) => {
                    setMobile(e.target.value.replace(/\D/g, '').slice(0, 10));
                    setMobileError('');
                  }}
                  placeholder="Enter mobile number to mark attendance."
                  className="w-full px-4 py-3 pr-24 border border-gray-200 rounded-lg text-sm text-gray-700 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                  disabled={loading}
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-gray-400 pointer-events-none whitespace-nowrap">
                  (required)
                </span>
              </div>
              {mobileError && <p className="mt-1.5 text-xs text-red-500">{mobileError}</p>}
            </div>

            {loading ? (
              <button disabled className="w-full py-3 bg-primary text-white text-sm font-semibold rounded-lg opacity-60 flex items-center justify-center gap-2">
                <span className="w-4 h-4 rounded-full border-2 border-white/40 border-t-white animate-spin" />
                Verifying…
              </button>
            ) : (
              <button
                onClick={handleContinue}
                disabled={!camReady}
                className="w-full py-3 bg-primary text-white text-sm font-semibold rounded-lg hover:bg-primary-dark active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                Continue &rsaquo;
              </button>
            )}
          </div>

        </div>
      </div>

      {/* ══ Modal overlay ════════════════════════════════════════════════ */}
      {modal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          {modal.type === 'success'      && <SuccessModal    data={modal}            onClose={closeModal} />}
          {modal.type === 'error'        && <ErrorModal      message={modal.message} onClose={closeModal} />}
          {modal.type === 'already_done' && <AlreadyDoneModal message={modal.message} onClose={closeModal} />}
        </div>
      )}

    </div>
  );
}
