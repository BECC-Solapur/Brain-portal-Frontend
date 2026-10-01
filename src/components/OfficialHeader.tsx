"use client";

import React from "react";

interface OfficialHeaderProps {
  pillTitle?: string;
  showTitleBar?: boolean;
  dateStr?: string;
  regNo?: string;
  className?: string;
}

export default function OfficialHeader({
  pillTitle = "Counselling Form",
  showTitleBar = true,
  dateStr = new Date().toLocaleDateString("en-GB"),
  regNo = "585",
  className = "",
}: OfficialHeaderProps) {
  return (
    <header className={`brain-header ${className}`}>
      <style jsx>{`
        .brain-header {
          --purple: #3c246f;
          --red: #c61619;

          width: 100%;
          max-width: 1100px;
          margin: 0 auto;
          background: #fff;
          font-family: Arial, Helvetica, sans-serif;
          color: #111;
        }

        .header-top {
          min-height: 180px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 20px;
          padding: 14px 20px 10px;
        }

        .brand-area {
          display: flex;
          align-items: center;
          min-width: 0;
        }

        .brain-logo {
          width: 90px;
          height: 105px;
          object-fit: contain;
          flex: 0 0 auto;
        }

        .brand-content {
          margin-left: 12px;
        }

        .tagline {
          margin: 0 0 4px 2px;
          color: var(--purple);
          font-family: Georgia, "Times New Roman", serif;
          font-size: 16px;
          line-height: 1;
          font-weight: 700;
          font-style: italic;
        }

        .brand-line {
          display: flex;
          align-items: center;
          gap: 14px;
        }

        .brain-name {
          color: var(--red);
          font-family: Georgia, "Times New Roman", serif;
          font-size: 46px;
          font-weight: 700;
          line-height: 0.92;
          letter-spacing: -1px;
        }

        .brain-subtitle {
          margin-top: 5px;
          color: #111;
          font-family: Georgia, "Times New Roman", serif;
          font-size: 17px;
          line-height: 1.1;
          font-weight: 700;
        }

        .brain-globe {
          width: 70px;
          height: 60px;
          object-fit: contain;
          align-self: center;
          margin-top: 4px;
        }

        .contact-area {
          min-width: 310px;
          text-align: right;
          align-self: flex-start;
          padding-top: 6px;
        }

        .person-name {
          color: var(--purple);
          font-size: 17px;
          line-height: 1.15;
          font-weight: 800;
          font-family: Georgia, "Times New Roman", serif;
        }

        .person-role {
          margin-top: 3px;
          color: #111;
          font-size: 12.5px;
          line-height: 1.1;
          font-weight: 700;
        }

        .director {
          margin-top: 1px;
        }

        .contact-row {
          display: flex;
          align-items: center;
          justify-content: flex-end;
          gap: 10px;
          margin-top: 5px;
          color: #191919;
          font-size: 12px;
          line-height: 1.05;
          white-space: nowrap;
          font-weight: 600;
        }

        .contact-icon {
          width: 17px;
          height: 17px;
          flex: 0 0 17px;
          display: inline-flex;
        }

        .contact-icon svg {
          width: 100%;
          height: 100%;
          fill: var(--purple);
        }

        .contact-icon svg path,
        .contact-icon svg rect {
          fill: #fff;
        }

        .contact-icon :global(.icon-stroke) {
          fill: none;
          stroke: #fff;
          stroke-width: 1.2;
          stroke-linecap: round;
          stroke-linejoin: round;
        }

        .contact-icon :global(.icon-cut) {
          fill: #fff;
        }

        .service-strip,
        .office-strip {
          width: 100%;
          text-align: center;
          color: var(--purple);
          font-weight: 700;
        }

        .service-strip {
          border-top: 3px solid var(--purple);
          border-bottom: 2px solid var(--purple);
          padding: 6px 12px 5px;
          font-size: 13.5px;
          line-height: 1.1;
        }

        .office-strip {
          border-bottom: 2px solid var(--purple);
          padding: 5px 12px 5px;
          font-size: 12px;
          line-height: 1.1;
        }

        .dot {
          display: inline-block;
          padding: 0 10px;
          font-size: 9px;
          vertical-align: middle;
        }

        .titlebar {
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          margin-top: 14px;
          gap: 10px;
          padding: 0 10px;
        }
        .reg {
          font-size: 12px;
          font-weight: 700;
          color: #1c1c1c;
          white-space: nowrap;
          padding-top: 6px;
        }
        .reg span {
          color: var(--red);
          font-size: 18px;
          font-weight: 800;
          margin-left: 4px;
        }
        .titleblock {
          text-align: center;
          flex: 1;
        }
        .titleblock h1 {
          font-size: 26px;
          font-weight: 800;
          color: #2b2e83;
          margin: 0;
          letter-spacing: 0.3px;
        }
        .pill {
          display: inline-block;
          margin-top: 4px;
          padding: 3px 20px;
          border: 2px solid var(--purple);
          border-radius: 20px;
          font-size: 12px;
          font-weight: 700;
          color: var(--purple);
          background: #efeaf9;
        }
        .datefield {
          font-size: 12px;
          font-weight: 700;
          white-space: nowrap;
          padding-top: 6px;
        }
        .datefield .u {
          display: inline-block;
          border-bottom: 1px solid #9a9a9a;
          width: 85px;
          margin-left: 4px;
          text-align: center;
          color: var(--purple);
        }

        @media (max-width: 850px) {
          .header-top {
            padding: 14px 16px 10px;
            gap: 14px;
          }

          .brain-logo {
            width: 70px;
            height: 85px;
          }

          .tagline {
            font-size: 13px;
          }

          .brain-name {
            font-size: 34px;
          }

          .brain-subtitle {
            font-size: 14px;
          }

          .brain-globe {
            width: 55px;
            height: 48px;
          }

          .contact-area {
            min-width: 240px;
          }

          .person-name {
            font-size: 15px;
          }

          .person-role,
          .contact-row {
            font-size: 11px;
          }
        }

        @media (max-width: 680px) {
          .header-top {
            flex-direction: column;
            align-items: stretch;
          }

          .brand-area {
            justify-content: center;
          }

          .contact-area {
            width: 100%;
            min-width: 0;
            text-align: center;
          }

          .contact-row {
            justify-content: center;
            white-space: normal;
          }

          .service-strip,
          .office-strip {
            line-height: 1.3;
          }
        }
      `}</style>

      {/* TOP HEADER */}
      <div className="header-top">
        <div className="brand-area">
          <svg
            className="brain-logo"
            viewBox="50 55 220 300"
            xmlns="http://www.w3.org/2000/svg"
          >
            <defs>
              <linearGradient id="navy-hdr" x1="0" y1="0" x2="0.86" y2="1">
                <stop offset="0" stopColor="#06266b" />
                <stop offset="0.58" stopColor="#082b72" />
                <stop offset="1" stopColor="#06215e" />
              </linearGradient>
              <linearGradient id="red-hdr" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0" stopColor="#e5141d" />
                <stop offset="1" stopColor="#df0d15" />
              </linearGradient>
            </defs>

            {/* Screen / Top Frame */}
            <path fill="url(#navy-hdr)" fillRule="evenodd" d="M99 65h120v73H99V65Zm7 7v59h106V72H106Z" />
            <rect x="118" y="81" width="83" height="45" rx="22.5" fill="url(#red-hdr)" />

            {/* Horizontal bar */}
            <path fill="url(#navy-hdr)" d="M62 143h195v28H62z" />

            {/* Geometric figure */}
            <path fill="url(#navy-hdr)" d="M62 179h59l17 28-34 52v-37L62 179Z" />
            <path fill="url(#navy-hdr)" d="M257 179h-57l-17 28 34 52v-37l40-43Z" />
            <path fill="url(#navy-hdr)" d="m160 186 80 145 31 19h-70l10-15-51-93-51 93 10 15H52l29-19 79-145Z" />
          </svg>

          <div className="brand-content">
            <div className="tagline">Use Brain to make Career !</div>

            <div className="brand-line">
              <div className="brand-text">
                <div className="brain-name">BRAIN</div>
                <div className="brain-subtitle">
                  Educational Counselling<br />
                  &amp; Consultancy Center
                </div>
              </div>

              <img src="/globe_in_hand.png" alt="Globe in hand" className="brain-globe" />
            </div>
          </div>
        </div>

        <div className="contact-area">
          <div className="person-name">Mrs. Shalaka Kiran Kulkarni</div>
          <div className="person-role">Child &amp; Adolescent Psychologist</div>
          <div className="person-role director">Director</div>

          <div className="contact-row">
            <span className="contact-icon">
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <circle cx="12" cy="12" r="12" />
                <path d="M8.2 6.5h2l1.3 3.2-1.5 1a9.5 9.5 0 0 0 3.3 3.3l1-1.5 3.2 1.3v2c0 .7-.6 1.3-1.3 1.3C10.8 17.1 6.9 13.2 6.9 7.8c0-.7.6-1.3 1.3-1.3Z" />
              </svg>
            </span>
            <span>020 - 26030545 / 9837060831</span>
          </div>

          <div className="contact-row">
            <span className="contact-icon">
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <circle cx="12" cy="12" r="12" />
                <rect x="8.3" y="5.7" width="7.4" height="12.6" rx="1.2" />
                <circle cx="12" cy="16.4" r=".7" className="icon-cut" />
              </svg>
            </span>
            <span>9822408185 / 9673920308</span>
          </div>

          <div className="contact-row">
            <span className="contact-icon">
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <circle cx="12" cy="12" r="12" />
                <circle cx="12" cy="12" r="6.1" className="icon-stroke" />
                <path d="M6.2 12h11.6M12 5.9c2 1.8 3.1 3.8 3.1 6.1S14 16.3 12 18.1c-2-1.8-3.1-3.8-3.1-6.1S10 7.7 12 5.9Z" className="icon-stroke" />
              </svg>
            </span>
            <span>www.braincounsellingcenter.com</span>
          </div>

          <div className="contact-row">
            <span className="contact-icon">
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <circle cx="12" cy="12" r="12" />
                <path d="M6.3 8.2h11.4v7.6H6.3z" className="icon-stroke" />
                <path d="m6.7 8.8 5.3 4 5.3-4" className="icon-stroke" />
              </svg>
            </span>
            <span>braincounsellingcenter@gmail.com</span>
          </div>
        </div>
      </div>

      <div className="service-strip">
        Professional / Career Counselling of Students / Parents
        <span className="dot">●</span>
        Admissions to National / International Universities
      </div>

      <div className="office-strip">
        Office 1 : U-502, Madhuvanti, Nanded City, Sinhgad Road
        <span className="dot">●</span>
        Solapur Office : ‘Shalaka’, 28, Govind Vihar, Jule Solapur, Solapur
      </div>

      {showTitleBar && (
        <div className="titlebar">
          <div className="reg">
            Reg. No. : <span>{regNo}</span>
          </div>
          <div className="titleblock">
            <h1>Disha Career Guidance</h1>
            <div className="pill">{pillTitle}</div>
          </div>
          <div className="datefield">
            Date : <span className="u">{dateStr}</span>
          </div>
        </div>
      )}
    </header>
  );
}
