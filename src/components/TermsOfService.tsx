import { useEffect } from "react";

interface TermsOfServiceProps {
  onClose: () => void;
}

export default function TermsOfService({ onClose }: TermsOfServiceProps) {
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    document.addEventListener("keydown", handleEsc);
    return () => document.removeEventListener("keydown", handleEsc);
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-[200] flex items-center justify-center p-4 pointer-events-auto"
      style={{ background: "rgba(0,0,0,0.7)", backdropFilter: "blur(8px)" }}
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-3xl max-h-[85vh] rounded-xl overflow-hidden"
        style={{ background: "#111827", border: "1px solid rgba(59,130,246,0.15)" }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="sticky top-0 z-10 px-8 py-5 flex items-center justify-between" style={{ background: "#111827", borderBottom: "1px solid rgba(59,130,246,0.1)" }}>
          <div>
            <h2 className="text-xl font-bold text-white">Terms of Service</h2>
            <p className="text-xs text-slate-500 mt-0.5">Effective: August 2026 - Ferrivox Ltd.</p>
          </div>
          <button onClick={onClose} className="w-8 h-8 rounded-full flex items-center justify-center text-slate-500 hover:text-white hover:bg-white/10 transition-all">
            ✕
          </button>
        </div>

        {/* Content */}
        <div className="px-8 py-6 overflow-y-auto" style={{ height: "calc(85vh - 80px)" }}>
          <div className="flex flex-col gap-6 text-sm text-slate-300 leading-relaxed">

            <Section num="1" title="Introduction">
              <p>These Terms of Service ("Terms") govern your access to and use of the Ferrivox website (ferrivox.com) and any services provided by Ferrivox Ltd. ("Ferrivox," "we," "us," or "our"). By accessing or using this website, you agree to be bound by these Terms.</p>
              <p>Ferrivox Ltd. is a technology company registered in the Republic of Rwanda. These Terms constitute a binding agreement between you ("User," "you," or "your") and Ferrivox.</p>
            </Section>

            <Section num="2" title="Definitions">
              <ul className="list-disc pl-5 flex flex-col gap-1">
                <li><strong>"Ferrivox"</strong> — Ferrivox Ltd., a company registered in Rwanda.</li>
                <li><strong>"Website"</strong> — ferrivox.com and all associated subdomains and services.</li>
                <li><strong>"Services"</strong> — Software engineering, AI development, data services, cybersecurity, consulting, and any other professional services offered by Ferrivox.</li>
                <li><strong>"User"</strong> — Any individual or entity accessing the Website.</li>
                <li><strong>"Client"</strong> — A User who has entered into a formal project agreement with Ferrivox.</li>
                <li><strong>"Content"</strong> — All text, images, code, designs, documentation, and materials on the Website.</li>
                <li><strong>"AI Assistant"</strong> — The Ferrivox AI chatbot ("FERI") available on the Website.</li>
                <li><strong>"Project"</strong> — Any engagement between Ferrivox and a Client governed by a signed agreement.</li>
                <li><strong>"Intellectual Property"</strong> — Patents, copyrights, trademarks, trade secrets, and all proprietary rights.</li>
              </ul>
            </Section>

            <Section num="3" title="Acceptance of Terms">
              <p>By accessing or using this Website, you acknowledge that you have read, understood, and agree to be bound by these Terms. If you do not agree, you must not use this Website.</p>
              <p>For contractual services, Ferrivox requires explicit written acceptance through a project agreement or Statement of Work. These Website Terms alone do not create a contractual obligation for service delivery.</p>
            </Section>

            <Section num="4" title="Ferrivox Services">
              <p>Ferrivox provides technology solutions across the following categories:</p>
              <div className="grid grid-cols-2 gap-1 pl-5">
                {["Software Engineering", "Web Applications", "Mobile Applications", "Data Training & Annotation", "AI Solutions & Machine Learning", "Business Process Automation", "Cybersecurity", "Network & Infrastructure Engineering", "Digital Platforms", "Technical Consulting", "Research & Development", "Custom Technology Products"].map((s) => (
                  <li key={s} className="list-disc">{s}</li>
                ))}
              </div>
              <p className="mt-2">Not every service is automatically available at all times. Service availability depends on Ferrivox's current capacity, team allocation, and technical feasibility.</p>
            </Section>

            <Section num="5" title="Project Requests">
              <p>Submitting a project request through the Website, AI Assistant, or any other channel does not automatically establish a contractual relationship with Ferrivox.</p>
              <p>Ferrivox reviews all project requests and may contact you for further information. A formal project agreement or Statement of Work will define: scope, deliverables, timeline, pricing, milestones, responsibilities, and acceptance criteria.</p>
            </Section>

            <Section num="6" title="Quotes & Payments">
              <p>All pricing is determined individually per project unless explicitly stated otherwise. Key payment terms include:</p>
              <ul className="list-disc pl-5 flex flex-col gap-1">
                <li>Quotations are valid for the period stated in the quotation document.</li>
                <li>Payments are denominated in USD unless otherwise agreed.</li>
                <li>Deposits and milestone payments are required as specified in the project agreement.</li>
                <li>Invoices are payable within the timeframe specified (typically 14–30 days).</li>
                <li>Late payments may incur fees as outlined in the project agreement.</li>
                <li>All applicable taxes are the Client's responsibility unless otherwise stated.</li>
                <li>Refund and cancellation terms are governed by the individual project agreement.</li>
              </ul>
            </Section>

            <Section num="7" title="Intellectual Property">
              <p>Intellectual property is divided into three categories:</p>
              <div className="flex flex-col gap-2 mt-1">
                <div className="p-3 rounded-lg" style={{ background: "rgba(59,130,246,0.06)", border: "1px solid rgba(59,130,246,0.12)" }}>
                  <strong className="text-white text-xs uppercase tracking-wider">Ferrivox IP</strong>
                  <p className="mt-1 text-xs">Frameworks, reusable components, internal tools, libraries, methodologies, templates, pre-existing code, and proprietary technology. These remain Ferrivox's property at all times.</p>
                </div>
                <div className="p-3 rounded-lg" style={{ background: "rgba(59,130,246,0.06)", border: "1px solid rgba(59,130,246,0.12)" }}>
                  <strong className="text-white text-xs uppercase tracking-wider">Client IP</strong>
                  <p className="mt-1 text-xs">Client data, client trademarks, and client-provided materials remain the Client's property.</p>
                </div>
                <div className="p-3 rounded-lg" style={{ background: "rgba(59,130,246,0.06)", border: "1px solid rgba(59,130,246,0.12)" }}>
                  <strong className="text-white text-xs uppercase tracking-wider">Project Deliverables</strong>
                  <p className="mt-1 text-xs">Custom code, designs, systems, documentation, models, and datasets created for a specific project. Ownership of deliverables is determined in the individual project agreement upon full payment.</p>
                </div>
              </div>
            </Section>

            <Section num="8" title="Client Content">
              <p>Clients must have the legal right and necessary permissions to provide Ferrivox with datasets, images, documents, software, customer information, and proprietary information. Clients must not upload data they are not legally authorized to share.</p>
            </Section>

            <Section num="9" title="Acceptable Use">
              <p>You agree not to use the Website or Ferrivox systems for:</p>
              <ul className="list-disc pl-5 flex flex-col gap-1">
                <li>Illegal activities or fraud</li>
                <li>Distributing malware or harmful code</li>
                <li>Unauthorized access to systems or data</li>
                <li>Attacks against Ferrivox or third-party systems</li>
                <li>Harassment or distribution of unlawful content</li>
                <li>Bypassing security measures</li>
                <li>Infringing intellectual property rights</li>
                <li>Abusing APIs or automated services</li>
              </ul>
            </Section>

            <Section num="10" title="AI Services">
              <p>The Ferrivox AI Assistant ("FERI") is provided as an informational tool. Please note:</p>
              <ul className="list-disc pl-5 flex flex-col gap-1">
                <li>AI responses may contain errors and should not be treated as legal, financial, or medical advice.</li>
                <li>AI output is not guaranteed to be accurate or complete.</li>
                <li>Do not submit confidential or sensitive information through the AI Assistant unless specifically requested through an authorized Ferrivox process.</li>
                <li>Conversations with the AI do not automatically establish a client relationship.</li>
                <li>AI responses do not constitute binding quotations unless explicitly confirmed by an authorized Ferrivox representative.</li>
              </ul>
            </Section>

            <Section num="11" title="Third-Party Services">
              <p>The Website may use third-party services including hosting providers, analytics, email services, payment processors, AI APIs, cloud storage, and authentication providers. These services are subject to their own terms and privacy policies. Ferrivox is not responsible for third-party service availability or practices.</p>
            </Section>

            <Section num="12" title="Website Availability">
              <p>Ferrivox may update, modify, temporarily suspend, or discontinue features of the Website at any time without prior notice. Ferrivox does not guarantee 100% uptime. Scheduled maintenance will be performed with reasonable effort to minimize disruption.</p>
            </Section>

            <Section num="13" title="Security">
              <p>Ferrivox implements reasonable technical and organizational measures to protect its systems, data, and infrastructure. However, no system is completely secure. Ferrivox cannot guarantee absolute security of any data transmitted through the Website.</p>
            </Section>

            <Section num="14" title="Confidentiality">
              <p>Confidentiality for project work is governed by separate agreements including Non-Disclosure Agreements (NDAs), Master Services Agreements, and Statements of Work. These Website Terms do not serve as a confidentiality mechanism for project work.</p>
            </Section>

            <Section num="15" title="Disclaimers">
              <p>The Website and all Content are provided "as is" without warranties of any kind. Ferrivox disclaims all warranties including implied warranties of merchantability, fitness for a particular purpose, and non-infringement. Ferrivox is not responsible for: third-party services, AI output accuracy, temporary downtime, information accuracy on external links, or user-provided content.</p>
            </Section>

            <Section num="16" title="Limitation of Liability">
              <p>To the maximum extent permitted by applicable law, Ferrivox shall not be liable for any indirect, incidental, special, consequential, or punitive damages arising from your use of the Website or Services. Ferrivox's total liability shall not exceed the amount paid by you to Ferrivox in the twelve (12) months preceding the claim.</p>
            </Section>

            <Section num="17" title="Indemnification">
              <p>You agree to indemnify and hold harmless Ferrivox, its directors, employees, and agents from any claims, losses, or damages arising from your misuse of the Website, violation of these Terms, or infringement of any third-party rights.</p>
            </Section>

            <Section num="18" title="Suspension & Termination">
              <p>Ferrivox reserves the right to suspend or terminate your access to the Website at any time for: abusive behavior, illegal activity, security threats, non-payment of fees, or breach of these Terms.</p>
            </Section>

            <Section num="19" title="Dispute Resolution">
              <p>Any disputes arising from these Terms shall be governed by the laws of the Republic of Rwanda. Disputes shall first be addressed through good-faith negotiation. If unresolved, disputes shall be submitted to the competent courts of Kigali, Rwanda.</p>
            </Section>

            <Section num="20" title="Changes to Terms">
              <p>Ferrivox may update these Terms at any time. Changes will be posted on this page with an updated effective date. Continued use of the Website after changes constitutes acceptance of the revised Terms.</p>
            </Section>

            <Section num="21" title="Contact">
              <p>For questions about these Terms:</p>
              <div className="mt-2 p-3 rounded-lg" style={{ background: "rgba(59,130,246,0.06)", border: "1px solid rgba(59,130,246,0.12)" }}>
                <p className="text-white font-medium">Ferrivox Ltd.</p>
                <p className="text-xs text-slate-400 mt-1">Kigali, Rwanda</p>
                <p className="text-xs text-slate-400">legal@ferrivox.com</p>
                <p className="text-xs text-slate-400">ferrivox.com</p>
              </div>
            </Section>

          </div>
        </div>
      </div>
    </div>
  );
}

function Section({ num, title, children }: { num: string; title: string; children: React.ReactNode }) {
  return (
    <div>
      <h3 className="text-sm font-semibold text-white mb-2 flex items-center gap-2">
        <span className="text-blue-400 text-xs font-mono">{num}.</span>
        {title}
      </h3>
      {children}
    </div>
  );
}
