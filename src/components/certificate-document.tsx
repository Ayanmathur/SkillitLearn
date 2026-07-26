"use client";

import React, { useRef } from "react";
import Image from "next/image";
import Link from "next/link";

export interface CertificateData {
  id: string;
  uniqueCertificateId: string;
  recipientName: string;
  pathName: string;
  careerName: string;
  issuedAt: string;
  verificationUrl: string;
  qrCodeUrl?: string;
  signatoryName?: string;
  signatoryTitle?: string;
  signatureUrl?: string;
}

interface Props {
  certificate: CertificateData;
  isPublic?: boolean;
}

export function CertificateDocument({ certificate, isPublic = true }: Props) {
  const printRef = useRef<HTMLDivElement>(null);

  const handlePrint = () => {
    window.print();
  };

  const issueDate = new Date(certificate.issuedAt);
  const year = issueDate.getFullYear();
  const month = issueDate.getMonth() + 1;

  // LinkedIn Certification Add URL
  const linkedInUrl = `https://www.linkedin.com/profile/add?startTask=CERTIFICATION_NAME&name=${encodeURIComponent(
    certificate.pathName
  )}&organizationName=${encodeURIComponent(
    "SkillItLearn"
  )}&issueYear=${year}&issueMonth=${month}&certUrl=${encodeURIComponent(
    certificate.verificationUrl
  )}&certId=${encodeURIComponent(certificate.uniqueCertificateId)}`;

  return (
    <div className="flex flex-col items-center gap-6 w-full max-w-5xl mx-auto py-6 px-4">
      {/* ── Action Bar ────────────────────────────────────────── */}
      <div className="no-print flex flex-wrap items-center justify-between gap-4 w-full bg-surface border border-border-color rounded-2xl p-4 shadow-sm">
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-full bg-green-500 animate-pulse" />
          <span className="text-sm font-semibold text-text-primary">
            Official Verifiable Credential
          </span>
          <span className="text-xs text-text-muted px-2.5 py-0.5 rounded-full bg-gray-100 dark:bg-gray-800 font-mono">
            {certificate.uniqueCertificateId}
          </span>
        </div>

        <div className="flex items-center gap-3">
          {/* LinkedIn Add Button */}
          <a
            href={linkedInUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 bg-[#0a66c2] hover:bg-[#084e96] text-white
                       font-semibold rounded-full px-5 py-2.5 text-sm transition-all shadow-sm"
          >
            <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
              <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37h2.77z" />
            </svg>
            Add to LinkedIn
          </a>

          {/* Download PDF / Print Button */}
          <button
            onClick={handlePrint}
            className="inline-flex items-center gap-2 bg-accent hover:bg-accent-hover text-white
                       font-semibold rounded-full px-5 py-2.5 text-sm transition-all shadow-sm"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="7 10 12 15 17 10" /><line x1="12" y1="15" x2="12" y2="3" />
            </svg>
            Download / Print
          </button>
        </div>
      </div>

      {/* ── Printable Certificate Canvas ───────────────────────── */}
      <div
        ref={printRef}
        id="certificate-canvas"
        className="relative w-full aspect-[1.414/1] bg-white text-[#1a1a2e] rounded-2xl shadow-2xl overflow-hidden border-8 border-[#1a1a2e] p-8 md:p-12 flex flex-col justify-between"
        style={{
          backgroundImage: "radial-gradient(#f0f2f5 1px, transparent 1px)",
          backgroundSize: "24px 24px",
        }}
      >
        {/* Decorative Corner Accents */}
        <div className="absolute top-0 left-0 w-24 h-24 border-t-8 border-l-8 border-[#5bbd72]" />
        <div className="absolute top-0 right-0 w-24 h-24 border-t-8 border-r-8 border-[#5bbd72]" />
        <div className="absolute bottom-0 left-0 w-24 h-24 border-b-8 border-l-8 border-[#5bbd72]" />
        <div className="absolute bottom-0 right-0 w-24 h-24 border-b-8 border-r-8 border-[#5bbd72]" />

        {/* Header Logo */}
        <div className="flex items-center justify-between z-10">
          <div className="flex items-center gap-3">
            <img src="/logo.png" alt="SkillItLearn Logo" className="h-12 w-auto rounded" />
            <span className="text-xs tracking-widest text-gray-500 uppercase font-bold">
              Official Certificate of Mastery
            </span>
          </div>
          <div className="text-right">
            <span className="text-xs text-gray-400 block uppercase tracking-wider font-semibold">ID</span>
            <span className="font-mono text-sm font-bold text-[#1a1a2e]">
              {certificate.uniqueCertificateId}
            </span>
          </div>
        </div>

        {/* Certificate Main Title & Body */}
        <div className="text-center my-auto py-6 z-10">
          <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight text-[#1a1a2e] mb-4 uppercase">
            Certificate of Completion
          </h1>
          <p className="text-sm md:text-base text-gray-600 uppercase tracking-widest font-semibold mb-6">
            This is proudly presented to
          </p>

          {/* Student Full Name */}
          <div className="text-3xl md:text-5xl lg:text-6xl font-black text-[#5bbd72] mb-6 tracking-tight border-b-2 border-[#5bbd72]/30 pb-3 inline-block px-8">
            {certificate.recipientName}
          </div>

          <p className="text-sm md:text-base text-gray-700 max-w-2xl mx-auto leading-relaxed">
            for successfully mastering all required skills and competencies in the professional career path
          </p>

          {/* Path Name */}
          <div className="text-xl md:text-3xl font-bold text-[#1a1a2e] mt-4 mb-2">
            {certificate.pathName}
          </div>
          <div className="text-xs md:text-sm font-semibold text-[#5bbd72] uppercase tracking-wider">
            {certificate.careerName}
          </div>
        </div>

        {/* Footer Signatures, QR Code & Date */}
        <div className="grid grid-cols-3 items-end pt-6 border-t border-gray-200 z-10">
          {/* Issue Date */}
          <div>
            <div className="text-xs text-gray-400 uppercase tracking-wider font-bold">Issued Date</div>
            <div className="text-sm font-semibold text-gray-800 mt-1">
              {new Date(certificate.issuedAt).toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </div>
          </div>

          {/* Founder Signature */}
          <div className="text-center flex flex-col items-center">
            <div className="relative h-14 w-40 mb-1">
              <img
                src={certificate.signatureUrl || "/signature.png"}
                alt="Founder Signature"
                className="h-full w-auto mx-auto object-contain filter contrast-125"
              />
            </div>
            <div className="text-sm font-bold text-[#1a1a2e]">
              {certificate.signatoryName || "Ayan Mathur"}
            </div>
            <div className="text-xs text-gray-500 font-medium">
              {certificate.signatoryTitle || "Founder & CEO, SkillItLearn"}
            </div>
          </div>

          {/* Verification QR Code */}
          <div className="flex flex-col items-end">
            <div className="bg-white p-1.5 rounded-lg border border-gray-200 shadow-sm mb-1">
              <img
                src={
                  certificate.qrCodeUrl ||
                  `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(
                    certificate.verificationUrl
                  )}`
                }
                alt="Verification QR Code"
                className="w-16 h-16"
              />
            </div>
            <span className="text-[10px] text-gray-400 tracking-tight">Scan to Verify Credential</span>
          </div>
        </div>
      </div>

      {/* CSS Print Styles */}
      <style jsx global>{`
        @media print {
          body * {
            visibility: hidden;
          }
          .no-print {
            display: none !important;
          }
          #certificate-canvas,
          #certificate-canvas * {
            visibility: visible;
          }
          #certificate-canvas {
            position: absolute;
            left: 0;
            top: 0;
            width: 100vw !important;
            height: 100vh !important;
            border-radius: 0 !important;
            box-shadow: none !important;
          }
          @page {
            size: landscape;
            margin: 0;
          }
        }
      `}</style>
    </div>
  );
}
