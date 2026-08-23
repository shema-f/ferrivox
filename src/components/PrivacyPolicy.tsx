import { useEffect } from "react";

interface PrivacyPolicyProps {
  onClose: () => void;
}

export default function PrivacyPolicy({ onClose }: PrivacyPolicyProps) {
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
            <h2 className="text-xl font-bold text-white">Privacy Policy</h2>
            <p className="text-xs text-slate-500 mt-0.5">Effective: August 2026 - Compliant with Rwanda Law No. 058/2021</p>
          </div>
          <button onClick={onClose} className="w-8 h-8 rounded-full flex items-center justify-center text-slate-500 hover:text-white hover:bg-white/10 transition-all">
            ✕
          </button>
        </div>

        {/* Content */}
        <div className="px-8 py-6 overflow-y-auto" style={{ height: "calc(85vh - 80px)" }}>
          <div className="flex flex-col gap-6 text-sm text-slate-300 leading-relaxed">

            <Section num="1" title="Who We Are">
              <p>Ferrivox Ltd. ("Ferrivox," "we," "us," or "our") is a technology company registered in the Republic of Rwanda. Ferrivox acts as the <strong>Data Controller</strong> for personal data it determines the purposes and means of processing through this Website.</p>
              <p>When Ferrivox processes personal data on behalf of a client under a service agreement, Ferrivox acts as a <strong>Data Processor</strong>. This distinction is made in accordance with Rwanda's Law No. 058/2021 relating to the Protection of Personal Data and Privacy.</p>
            </Section>

            <Section num="2" title="What Information We Collect">
              <div className="flex flex-col gap-3">
                <InfoBox title="Information You Provide Voluntarily">
                  <ul className="list-disc pl-5 flex flex-col gap-1">
                    <li>Name and contact details (email, phone)</li>
                    <li>Company/organization and job title</li>
                    <li>Project requirements and descriptions</li>
                    <li>Messages and communications</li>
                    <li>Files uploaded through project forms</li>
                    <li>Account information (if applicable)</li>
                  </ul>
                </InfoBox>
                <InfoBox title="Automatically Collected Information">
                  <ul className="list-disc pl-5 flex flex-col gap-1">
                    <li>IP address</li>
                    <li>Browser type and version</li>
                    <li>Device type and operating system</li>
                    <li>Pages visited and interaction patterns</li>
                    <li>Approximate location derived from IP address</li>
                    <li>Timestamps and session duration</li>
                    <li>Error logs and performance data</li>
                  </ul>
                </InfoBox>
                <InfoBox title="AI Chatbot Information">
                  <p>FERRI (the Ferrivox AI Assistant) may process the following during conversations:</p>
                  <ul className="list-disc pl-5 flex flex-col gap-1 mt-1">
                    <li>Conversation messages you send</li>
                    <li>Project inquiry details you choose to share</li>
                    <li>Contact information you provide during lead qualification</li>
                  </ul>
                  <p className="mt-2 text-xs text-slate-400">Conversations are processed to provide responses. Chat logs may be retained for service improvement and quality assurance. Conversations are reviewed by Ferrivox staff for quality purposes. Data may be processed by external AI providers (see Section 6). Do not submit passwords, payment credentials, or confidential client data through the chatbot.</p>
                </InfoBox>
              </div>
            </Section>

            <Section num="3" title="Why We Collect Data">
              <div className="overflow-x-auto">
                <table className="w-full text-xs">
                  <thead>
                    <tr style={{ borderBottom: "1px solid rgba(59,130,246,0.15)" }}>
                      <th className="text-left py-2 pr-4 text-slate-400 font-medium">Data</th>
                      <th className="text-left py-2 text-slate-400 font-medium">Purpose</th>
                    </tr>
                  </thead>
                  <tbody className="text-slate-300">
                    {[
                      ["Name", "Identify and contact you"],
                      ["Email", "Respond to inquiries and project requests"],
                      ["Phone", "Project communication"],
                      ["Company", "Understand enterprise requirements"],
                      ["Project details", "Assess and prepare project proposals"],
                      ["IP / device data", "Security, analytics, and technical operation"],
                      ["Chat messages", "Provide AI assistance and qualify leads"],
                      ["Analytics data", "Understand website usage and improve services"],
                    ].map(([data, purpose]) => (
                      <tr key={data} style={{ borderBottom: "1px solid rgba(59,130,246,0.06)" }}>
                        <td className="py-2 pr-4 text-white font-medium whitespace-nowrap">{data}</td>
                        <td className="py-2">{purpose}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <p className="mt-2 text-xs text-slate-400">Personal data is collected for explicit, specified, and legitimate purposes and is not retained longer than necessary for those purposes.</p>
            </Section>

            <Section num="4" title="Legal Basis for Processing">
              <p>Ferrivox processes personal data under the following legal bases as recognized by Rwanda's data protection framework:</p>
              <ul className="list-disc pl-5 flex flex-col gap-1 mt-2">
                <li><strong>Consent</strong> - Where you have freely given, specific, informed, and unambiguous consent (e.g., newsletter signup, chatbot usage).</li>
                <li><strong>Contractual Necessity</strong> - Where processing is necessary to fulfill a contract with you or to take pre-contractual steps at your request.</li>
                <li><strong>Legal Obligation</strong> - Where processing is required by Rwandan law or regulation.</li>
                <li><strong>Legitimate Interests</strong> - Where processing is necessary for Ferrivox's legitimate business interests (e.g., security, fraud prevention) and does not override your fundamental rights.</li>
              </ul>
            </Section>

            <Section num="5" title="Who We Share Data With">
              <p>Ferrivox may share personal data with the following categories of recipients, only as necessary for the stated purposes:</p>
              <ul className="list-disc pl-5 flex flex-col gap-1">
                <li>Hosting and cloud infrastructure providers</li>
                <li>Email and communication providers</li>
                <li>AI service providers (for FERI chatbot functionality)</li>
                <li>Analytics providers (for website usage insights)</li>
                <li>Payment processors (for invoicing and transactions)</li>
                <li>Professional advisers (legal, accounting)</li>
                <li>Government and regulatory authorities where legally required</li>
              </ul>
              <p className="mt-2 text-xs text-slate-400">Ferrivox does not sell personal data to third parties. Service providers are contractually bound to protect your data and use it only for the purposes Ferrivox specifies.</p>
            </Section>

            <Section num="6" title="International Data Transfers">
              <p>Some of Ferrivox's service providers (including AI and cloud infrastructure providers) may process data in countries outside Rwanda. When international transfers occur:</p>
              <ul className="list-disc pl-5 flex flex-col gap-1 mt-2">
                <li>Ferrivox ensures appropriate safeguards are in place.</li>
                <li>Service providers must comply with data protection standards equivalent to Rwanda's Law No. 058/2021.</li>
                <li>You have the right to request information about which countries your data may be transferred to and what safeguards apply.</li>
              </ul>
            </Section>

            <Section num="7" title="Data Retention">
              <p>Ferrivox retains personal data only as long as necessary for the purposes it was collected:</p>
              <div className="flex flex-col gap-1 mt-2">
                {[
                  ["Contact inquiries", "Up to 24 months from last communication"],
                  ["Project records", "Duration of the project + 7 years (legal requirement)"],
                  ["AI chat sessions", "Up to 12 months for service improvement"],
                  ["Security logs", "Up to 12 months"],
                  ["Analytics data", "Up to 26 months (anonymized after 12 months)"],
                  ["Marketing consent", "Until consent is withdrawn"],
                ].map(([type, period]) => (
                  <div key={type} className="flex justify-between text-xs py-1" style={{ borderBottom: "1px solid rgba(59,130,246,0.06)" }}>
                    <span className="text-white font-medium">{type}</span>
                    <span className="text-slate-400">{period}</span>
                  </div>
                ))}
              </div>
            </Section>

            <Section num="8" title="Security Measures">
              <p>Ferrivox implements the following technical and organizational measures to protect personal data:</p>
              <ul className="list-disc pl-5 flex flex-col gap-1">
                <li>Encryption of data in transit (TLS/SSL)</li>
                <li>Access controls and authentication</li>
                <li>Principle of least privilege for system access</li>
                <li>Activity logging and monitoring</li>
                <li>Regular backups and disaster recovery procedures</li>
                <li>Secure software development practices</li>
                <li>Vulnerability management and patching</li>
              </ul>
              <p className="mt-2 text-xs text-slate-400">While Ferrivox takes reasonable measures, no system is completely secure. We continuously evaluate and improve our security practices.</p>
            </Section>

            <Section num="9" title="Cookies & Tracking">
              <p>Ferrivox uses cookies and similar technologies for the following purposes:</p>
              <ul className="list-disc pl-5 flex flex-col gap-1 mt-2">
                <li><strong>Essential cookies</strong> — Required for basic website functionality.</li>
                <li><strong>Analytics cookies</strong> — Help understand how visitors use the website.</li>
                <li><strong>Preference cookies</strong> — Remember your settings and choices.</li>
              </ul>
              <p className="mt-2 text-xs text-slate-400">Ferrivox does not use marketing or advertising cookies. You can manage cookie preferences through your browser settings.</p>
            </Section>

            <Section num="10" title="Your Rights">
              <p>Under Rwanda's data protection framework, you have the following rights regarding your personal data:</p>
              <ul className="list-disc pl-5 flex flex-col gap-1 mt-2">
                <li><strong>Access</strong> — Request a copy of the personal data Ferrivox holds about you.</li>
                <li><strong>Correction</strong> — Request correction of inaccurate or incomplete data.</li>
                <li><strong>Deletion</strong> — Request erasure of your personal data where no legal retention obligation applies.</li>
                <li><strong>Restriction</strong> — Request restriction of processing in certain circumstances.</li>
                <li><strong>Objection</strong> — Object to processing based on legitimate interests.</li>
                <li><strong>Withdrawal of Consent</strong> — Withdraw consent at any time where processing is based on consent.</li>
                <li><strong>Data Portability</strong> — Request your data in a structured, machine-readable format.</li>
              </ul>
              <p className="mt-2">To exercise any of these rights, contact: <strong className="text-white">privacy@ferrivox.com</strong></p>
            </Section>

            <Section num="11" title="Automated Decision-Making & AI">
              <p>The Ferrivox AI Assistant (FERI) provides informational responses and does not make automated decisions about users regarding eligibility, employment, creditworthiness, legal status, or other significant matters.</p>
              <p>If Ferrivox introduces automated decision-making that produces legal or similarly significant effects, users will be informed and provided with the right to request human intervention.</p>
            </Section>

            <Section num="12" title="Children's Privacy">
              <p>Ferrivox's Website and Services are intended for business and professional use. Ferrivox does not knowingly collect personal data from children under 18. If Ferrivox discovers that a child's data has been collected, it will be deleted promptly.</p>
            </Section>

            <Section num="13" title="Data Breaches">
              <p>In the event of a security incident involving personal data, Ferrivox will:</p>
              <ul className="list-disc pl-5 flex flex-col gap-1 mt-2">
                <li>Immediately contain and investigate the incident.</li>
                <li>Assess the risk to affected individuals.</li>
                <li>Notify the Rwanda Data Protection Office as required by law.</li>
                <li>Notify affected individuals without undue delay where the breach poses a high risk to their rights and freedoms.</li>
                <li>Document the incident and implement corrective measures.</li>
              </ul>
            </Section>

            <Section num="14" title="Contact">
              <p>For privacy-related inquiries, data subject requests, or complaints:</p>
              <div className="mt-2 p-3 rounded-lg" style={{ background: "rgba(59,130,246,0.06)", border: "1px solid rgba(59,130,246,0.12)" }}>
                <p className="text-white font-medium">Privacy & Data Protection</p>
                <p className="text-xs text-slate-400 mt-1">Ferrivox Ltd.</p>
                <p className="text-xs text-slate-400">Kigali, Rwanda</p>
                <p className="text-xs text-slate-400">privacy@ferrivox.com</p>
              </div>
              <p className="mt-2 text-xs text-slate-400">You also have the right to lodge a complaint with the Rwanda Data Protection Office (DPO) if you believe your data protection rights have been infringed.</p>
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

function InfoBox({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="p-3 rounded-lg" style={{ background: "rgba(59,130,246,0.05)", border: "1px solid rgba(59,130,246,0.1)" }}>
      <strong className="text-white text-xs uppercase tracking-wider">{title}</strong>
      <div className="mt-1.5">{children}</div>
    </div>
  );
}
