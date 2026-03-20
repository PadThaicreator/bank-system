import { useEffect, useState } from "react";
import { Compass, ArrowLeft, Home, Wifi } from "lucide-react";
import "./NotFoundPage.css";

export default function NotFoundPage() {
  const [glitch, setGlitch] = useState(false);
//   const [dots, setDots] = useState(".");

  useEffect(() => {
    const glitchInterval = setInterval(() => {
      setGlitch(true);
      setTimeout(() => setGlitch(false), 150);
    }, 3000);

    // const dotsInterval = setInterval(() => {
    //   setDots((d) => (d.length >= 3 ? "." : d + "."));
    // }, 500);

    return () => {
      clearInterval(glitchInterval);
    //   clearInterval(dotsInterval);
    };
  }, []);

  return (
    <div className="nf-container">
      {/* Scanline overlay */}
      <div className="nf-scanlines" />

      {/* Noise grid background */}
      <div className="nf-grid" />

      {/* Top status bar */}
      <div className="nf-status-bar">
        <div className="nf-status-left">
          <Wifi size={12} color="#00ff88" />
          <span className="nf-status-text">SYS_NET</span>
        </div>
        <div>
          <span className="nf-status-text">ERROR_LOG :: 0x404</span>
        </div>
      </div>

      {/* Main content */}
      <div className="nf-content">
        {/* Giant 404 */}
        <div className="nf-code-wrapper">
          <span
            className={`nf-error-code${glitch ? " glitch" : ""}`}
            data-text="404"
          >
            404
          </span>
        </div>

        {/* Compass icon spinning */}
        <div className="nf-icon-wrapper">
          <div className="nf-icon-ring" />
          <Compass
            size={40}
            color="#00ff88"
            className="nf-compass-icon"
            strokeWidth={1.5}
          />
        </div>

        {/* Message */}
        <p className="nf-headline">PAGE NOT FOUND</p>
        {/* <p className="nf-subtext">
          เส้นทางที่คุณตามหาไม่มีอยู่ในระบบ{dots}
        </p> */}

        {/* Terminal block */}
        <div className="nf-terminal">
          <div className="nf-terminal-header">
            <span className="nf-terminal-dot" />
            <span className="nf-terminal-dot yellow" />
            <span className="nf-terminal-dot green" />
            <span className="nf-terminal-title">terminal</span>
          </div>
          <div className="nf-terminal-body">
            <span className="nf-prompt">$ </span>
            <span className="nf-cmd">
              resolve_path --url=&quot;{window.location.pathname}&quot;
            </span>
            <br />
            <span className="nf-error-line">
              ✗ PathResolutionError: route not registered
            </span>
            <br />
            <span className="nf-hint">→ try navigating back or return home</span>
            <span className="nf-cursor">▌</span>
          </div>
        </div>

        {/* Buttons */}
        <div className="nf-btn-group">
          <button
            className="nf-btn nf-btn-outline"
            onClick={() => window.history.back()}
          >
            <ArrowLeft size={14} strokeWidth={2} />
            Back
          </button>

          <button
            className="nf-btn nf-btn-fill"
            onClick={() => (window.location.href = "/vite")}
          >
            <Home size={14} strokeWidth={2} />
            Home
          </button>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="nf-bottom-bar">
        <span className="nf-status-text">
          HTTP 404 · PAGE_NOT_FOUND · {new Date().toISOString()}
        </span>
      </div>
    </div>
  );
}