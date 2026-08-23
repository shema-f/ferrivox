import { useState, useRef, useEffect } from "react";

interface Message {
  role: "bot" | "user";
  text: string;
  timestamp: number;
}

interface LeadData {
  name: string;
  email: string;
  company: string;
  projectType: string;
  problem: string;
  users: string;
  features: string;
  integrations: string;
  timeline: string;
  budget: string;
  notes: string;
}

interface FeriChatbotProps {
  onClose: () => void;
}

/* ── Knowledge Base ──────────────────────────────── */

const KB: Record<string, { answer: string; confidence: "high" | "medium" }> = {
  // Company
  "what is ferrivox": {
    answer: "Ferrivox is a technology company based in Kigali, Rwanda. We build enterprise software, AI solutions, data platforms, and cybersecurity systems — engineered in Africa, built for the world.",
    confidence: "high",
  },
  "what does ferrivox do": {
    answer: "Ferrivox provides end-to-end technology solutions: software engineering, AI & machine learning, data analytics & annotation, cybersecurity, business automation, and technical consulting. We work with startups, enterprises, and government institutions.",
    confidence: "high",
  },
  "where is ferrivox based": {
    answer: "Ferrivox is headquartered in Kigali, Rwanda. We serve clients locally and internationally across 12+ countries.",
    confidence: "high",
  },
  "mission": {
    answer: "Ferrivox's mission is to build technology that powers tomorrow - delivering world-class software, AI, and cybersecurity solutions from Africa to the global market.",
    confidence: "high",
  },
  "what makes ferrivox different": {
    answer: "Three things set Ferrivox apart: (1) We combine deep technical expertise with entrepreneurial thinking, (2) We're based in Rwanda with a global delivery model, and (3) We focus on building long-term technology partnerships, not just delivering projects.",
    confidence: "high",
  },
  "ferrivox meaning": {
    answer: '"Ferrivox" combines "ferro" (iron) and "vox" (voice) — representing "Iron Will, Infinite Dreams." It reflects our determination to build powerful technology from Africa.',
    confidence: "high",
  },

  // Services
  "websites": {
    answer: "Yes. Ferrivox builds modern web applications using React, Next.js, Vue, and other current frameworks. We handle everything from design to deployment.",
    confidence: "high",
  },
  "mobile apps": {
    answer: "Yes. We build mobile applications for iOS and Android using React Native, Flutter, and native development. Cross-platform and native approaches depending on your needs.",
    confidence: "high",
  },
  "api": {
    answer: "Yes. Ferrivox designs and builds RESTful APIs, GraphQL APIs, and real-time APIs. We handle architecture, development, documentation, and deployment.",
    confidence: "high",
  },
  "ai development": {
    answer: "Yes. Our AI team builds machine learning models, natural language processing systems, computer vision solutions, and custom AI integrations. We also provide AI consulting to help you identify the right approach.",
    confidence: "high",
  },
  "data annotation": {
    answer: "Yes. Ferrivox provides data training and annotation services for machine learning datasets. We work with text, image, audio, and video data.",
    confidence: "high",
  },
  "cybersecurity": {
    answer: "Yes. Our cybersecurity services include infrastructure assessment, application security, penetration testing, security monitoring, incident response, and ongoing security consulting.",
    confidence: "high",
  },
  "automation": {
    answer: "Yes. Ferrivox automates business processes using custom software, AI-driven workflows, and integration between existing systems. We identify repetitive processes and build intelligent automation.",
    confidence: "high",
  },
  "infrastructure": {
    answer: "Yes. We design and build network infrastructure, cloud systems, DevOps pipelines, and scalable architectures. We work with AWS, GCP, Azure, and on-premise solutions.",
    confidence: "high",
  },
  "consulting": {
    answer: "Yes. Ferrivox provides technical consulting including technology strategy, architecture review, digital transformation planning, and CTO-as-a-service for startups.",
    confidence: "high",
  },
  "custom software": {
    answer: "Yes. Custom software development is our core strength. We build platforms, systems, and tools tailored to your specific business requirements.",
    confidence: "high",
  },

  // Projects
  "projects built": {
    answer: "Ferrivox has delivered 50+ projects across various industries including fintech, healthtech, edtech, logistics, and government services. Our portfolio includes enterprise platforms, mobile apps, AI systems, and data pipelines.",
    confidence: "high",
  },
  "ishami": {
    answer: "Ishami is one of Ferrivox's projects. For detailed case studies and project information, I'd recommend contacting the Ferrivox team directly. Would you like to start a project inquiry?",
    confidence: "medium",
  },

  // Business
  "start a project": {
    answer: "To start a project with Ferrivox, describe what you're building and I'll help gather the key requirements. Then I can prepare a project brief and connect you with the team. What are you looking to build?",
    confidence: "high",
  },
  "how long": {
    answer: "Project timelines depend on scope and complexity. A simple web application might take 4-8 weeks, while a complex enterprise platform could take 3-6 months. I can help you estimate once I understand your requirements.",
    confidence: "high",
  },
  "how much": {
    answer: "Ferrivox projects are scoped individually. Pricing depends on the technology, complexity, integrations, and timeline. Tell me what you're building and I can help gather the requirements for a project request.",
    confidence: "high",
  },
  "startups": {
    answer: "Yes, Ferrivox works with startups. We understand the need for fast iteration, cost efficiency, and scalable architecture from day one. Many of our clients are startups building their first product.",
    confidence: "high",
  },
  "enterprises": {
    answer: "Yes, Ferrivox serves enterprise clients. We handle large-scale platforms, complex integrations, security requirements, and ongoing maintenance. Our enterprise projects include multi-system platforms and AI-driven operations.",
    confidence: "high",
  },
  "government": {
    answer: "Yes, Ferrivox works with government institutions. We understand the security, compliance, and documentation requirements of public sector projects.",
    confidence: "high",
  },
  "international": {
    answer: "Yes, Ferrivox serves international clients across 12+ countries. We work across time zones and have experience with cross-border projects.",
    confidence: "high",
  },
  "quotation": {
    answer: "I can help you prepare a project brief right now. Tell me what you're building, who will use it, and your timeline — I'll structure it into a brief that the Ferrivox team can turn into a formal quotation.",
    confidence: "high",
  },
  "partner": {
    answer: "Ferrivox is open to strategic partnerships. For partnership inquiries, please contact the team directly at hello@ferrivox.com or through the contact form.",
    confidence: "high",
  },

  // Technical
  "technologies": {
    answer: "Ferrivox works with modern technology stacks including: React, Next.js, Node.js, Python, TypeScript, PostgreSQL, MongoDB, AWS, GCP, Docker, Kubernetes, TensorFlow, PyTorch, and many more. We choose the right tools for each project.",
    confidence: "high",
  },
  "cloud": {
    answer: "Yes. Ferrivox builds cloud-native systems on AWS, Google Cloud Platform, and Microsoft Azure. We handle architecture, deployment, scaling, and monitoring.",
    confidence: "high",
  },
  "ai integration": {
    answer: "Yes. We integrate AI capabilities into existing systems including LLMs, computer vision, recommendation engines, and predictive analytics. We can work with OpenAI, custom models, or on-premise AI.",
    confidence: "high",
  },

  // Data
  "data pipeline": {
    answer: "Yes. Ferrivox builds end-to-end data pipelines including ingestion, transformation, storage, and visualization. We work with real-time and batch processing architectures.",
    confidence: "high",
  },
  "protect client data": {
    answer: "Ferrivox takes data protection seriously. We implement encryption in transit and at rest, access controls, audit logging, and follow the principle of least privilege. Our practices align with Rwanda's data protection law (Law No. 058/2021).",
    confidence: "high",
  },

  // Security
  "security services": {
    answer: "Our cybersecurity services include: infrastructure security assessment, application penetration testing, security architecture review, ongoing monitoring and incident response, compliance consulting, and security training.",
    confidence: "high",
  },
  "assess infrastructure": {
    answer: "Yes. Ferrivox conducts comprehensive security assessments of your infrastructure including network configuration, access controls, vulnerability scanning, and compliance review.",
    confidence: "high",
  },

  // Contact
  "contact ferrivox": {
    answer: "You can reach Ferrivox through: this chat (I can prepare a project brief), the Contact page on the website, or directly at hello@ferrivox.com. We typically respond within 24 hours.",
    confidence: "high",
  },
  "email": {
    answer: "You can reach Ferrivox at hello@ferrivox.com. For privacy matters, contact privacy@ferrivox.com.",
    confidence: "high",
  },
};

/* ── Intent Detection ────────────────────────────── */

function findAnswer(input: string): { answer: string; confidence: "high" | "medium" | "low" } {
  const lower = input.toLowerCase().trim();

  // Direct KB match
  for (const [key, val] of Object.entries(KB)) {
    if (lower.includes(key)) return { answer: val.answer, confidence: val.confidence };
  }

  // Fuzzy keyword matching
  const keywords: Array<{ patterns: string[]; key: string }> = [
    { patterns: ["website", "web app", "web application", "frontend", "landing page"], key: "websites" },
    { patterns: ["mobile", "app", "ios", "android", "phone"], key: "mobile apps" },
    { patterns: ["api", "rest", "graphql", "backend"], key: "api" },
    { patterns: ["ai", "machine learning", "ml", "llm", "chatbot", "neural"], key: "ai development" },
    { patterns: ["data annotation", "labeling", "training data", "dataset"], key: "data annotation" },
    { patterns: ["security", "cyber", "penetration", "vulnerability", "hack"], key: "cybersecurity" },
    { patterns: ["automate", "automation", "workflow", "pipeline"], key: "automation" },
    { patterns: ["infrastructure", "network", "server", "devops", "cloud"], key: "infrastructure" },
    { patterns: ["consult", "strategy", "advisory", "review"], key: "consulting" },
    { patterns: ["custom", "build", "develop", "platform", "system"], key: "custom software" },
    { patterns: ["cost", "price", "pricing", "budget", "how much", "quote", "quotation"], key: "how much" },
    { patterns: ["time", "long", "timeline", "deadline", "when"], key: "how long" },
    { patterns: ["startup", "small business"], key: "startups" },
    { patterns: ["enterprise", "large company", "corporate"], key: "enterprises" },
    { patterns: ["government", "public sector", "ministry"], key: "government" },
    { patterns: ["international", "global", "abroad", "outside rwanda"], key: "international" },
    { patterns: ["contact", "reach", "email", "get in touch"], key: "contact ferrivox" },
    { patterns: ["partner", "partnership", "collaborate"], key: "partner" },
    { patterns: ["technology", "tech stack", "framework", "language"], key: "technologies" },
    { patterns: ["pipeline", "etl", "data flow"], key: "data pipeline" },
    { patterns: ["protect", "data protection", "privacy", "secure data"], key: "protect client data" },
    { patterns: ["project", "start", "begin", "building"], key: "start a project" },
    { patterns: ["about", "what is", "who are", "tell me about ferrivox"], key: "what is ferrivox" },
    { patterns: ["based", "location", "where", "office"], key: "where is ferrivox based" },
    { patterns: ["mission", "vision", "goal", "purpose"], key: "mission" },
    { patterns: ["different", "unique", "why ferrivox", "why you"], key: "what makes ferrivox different" },
    { patterns: ["ishami"], key: "ishami" },
  ];

  for (const group of keywords) {
    if (group.patterns.some((p) => lower.includes(p))) {
      const kbEntry = KB[group.key];
      if (kbEntry) return { answer: kbEntry.answer, confidence: kbEntry.confidence };
    }
  }

  // Greeting
  if (/^(hi|hello|hey|good morning|good afternoon|good evening|yo|sup)/.test(lower)) {
    return {
      answer: "Welcome to Ferrivox. I'm FERRI, the Ferrivox Intelligence Assistant. I can explain our services, share information about our projects, or help you start a project. What are you looking to build?",
      confidence: "high",
    };
  }

  // Outside scope
  return {
    answer: "That's outside what I can help with. I can assist with Ferrivox's services, projects, technology, and project requests. What would you like to know?",
    confidence: "low",
  };
}

/* ── Lead Qualification Flow ─────────────────────── */

type QualStep = "idle" | "type" | "problem" | "users" | "features" | "integrations" | "timeline" | "budget" | "name" | "email" | "company" | "complete";

const QUAL_QUESTIONS: Record<QualStep, { question: string; field?: keyof LeadData }> = {
  idle: { question: "" },
  type: { question: "What type of project are you building? (e.g., web app, mobile app, AI system, platform)", field: "projectType" },
  problem: { question: "What problem does this project solve?", field: "problem" },
  users: { question: "Who will use it? (e.g., consumers, businesses, internal teams)", field: "users" },
  features: { question: "What are the essential features?", field: "features" },
  integrations: { question: "Do you need any integrations? (e.g., payments, AI, maps, APIs, existing systems)", field: "integrations" },
  timeline: { question: "What's your target launch timeline?", field: "timeline" },
  budget: { question: "Do you have an approximate budget range? (This helps us scope appropriately)", field: "budget" },
  name: { question: "What's your name?", field: "name" },
  email: { question: "What's the best email to reach you?", field: "email" },
  company: { question: "What's your company or organization name?", field: "company" },
  complete: { question: "" },
};

const QUAL_STEP_ORDER: QualStep[] = ["type", "problem", "users", "features", "integrations", "timeline", "budget", "name", "email", "company"];

/* ── Main Component ──────────────────────────────── */

export default function FeriChatbot({ onClose }: FeriChatbotProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "bot",
      text: "Welcome to Ferrivox. I'm FERRI, the Ferrivox Intelligence Assistant.\n\nI can explain our services, share project information, or help you start a project. What are you looking to build?",
      timestamp: Date.now(),
    },
  ]);
  const [input, setInput] = useState("");
  const [qualStep, setQualStep] = useState<QualStep>("idle");
  const [lead, setLead] = useState<LeadData>({
    name: "", email: "", company: "", projectType: "", problem: "",
    users: "", features: "", integrations: "", timeline: "", budget: "", notes: "",
  });
  const [showHandoff, setShowHandoff] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const addBotMessage = (text: string) => {
    setMessages((prev) => [...prev, { role: "bot", text, timestamp: Date.now() }]);
  };

  const handleSend = () => {
    const text = input.trim();
    if (!text) return;

    setMessages((prev) => [...prev, { role: "user", text, timestamp: Date.now() }]);
    setInput("");

    // Lead qualification flow
    if (qualStep !== "idle" && qualStep !== "complete") {
      const currentQ = QUAL_QUESTIONS[qualStep];
      if (currentQ.field) {
        setLead((prev) => ({ ...prev, [currentQ.field!]: text }));
      }

      const currentIdx = QUAL_STEP_ORDER.indexOf(qualStep);
      const nextStep = QUAL_STEP_ORDER[currentIdx + 1];

      if (nextStep) {
        setQualStep(nextStep);
        setTimeout(() => addBotMessage(QUAL_QUESTIONS[nextStep].question), 300);
      } else {
        setQualStep("complete");
        setTimeout(() => {
          addBotMessage("I have enough information to prepare a project brief. Here's what I've captured:");
          setTimeout(() => {
            addBotMessage(
              `PROJECT BRIEF\n` +
              `━━━━━━━━━━━━━━━\n` +
              `Project: ${lead.projectType || text}\n` +
              `Problem: ${lead.problem}\n` +
              `Users: ${lead.users}\n` +
              `Features: ${lead.features}\n` +
              `Integrations: ${lead.integrations}\n` +
              `Timeline: ${lead.timeline}\n` +
              `Budget: ${lead.budget}\n` +
              `Contact: ${lead.name} (${lead.email}) - ${lead.company}\n` +
              `━━━━━━━━━━━━━━━\n\n` +
              `I'll prepare this for the Ferrivox team. Would you like to submit this inquiry?`
            );
            setShowHandoff(true);
          }, 500);
        }, 400);
      }
      return;
    }

    // Normal conversation
    const lower = text.toLowerCase();
    if (lower.includes("start a project") || lower.includes("start project") || lower.includes("i need") || lower.includes("i want to build") || lower.includes("can you build")) {
      setQualStep("type");
      setTimeout(() => addBotMessage("Let's gather some details about your project. " + QUAL_QUESTIONS.type.question), 400);
      return;
    }

    const result = findAnswer(text);

    if (result.confidence === "low") {
      setTimeout(() => addBotMessage(result.answer), 400);
    } else {
      setTimeout(() => addBotMessage(result.answer), 300 + Math.random() * 300);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleStartOver = () => {
    setQualStep("idle");
    setLead({ name: "", email: "", company: "", projectType: "", problem: "", users: "", features: "", integrations: "", timeline: "", budget: "", notes: "" });
    setShowHandoff(false);
    addBotMessage("No problem. Is there anything else I can help you with?");
  };

  return (
    <div
      className="fixed bottom-44 right-6 z-[99] pointer-events-auto w-96 rounded-xl overflow-hidden flex flex-col"
      style={{
        background: "rgba(10, 14, 23, 0.97)",
        border: "1px solid rgba(59, 130, 246, 0.2)",
        backdropFilter: "blur(20px)",
        boxShadow: "0 24px 64px rgba(0, 0, 0, 0.5)",
        height: "520px",
      }}
    >
      {/* Header */}
      <div className="px-5 py-4 flex items-center gap-3 flex-shrink-0" style={{ borderBottom: "1px solid rgba(59, 130, 246, 0.12)" }}>
        <div className="relative">
          <div className="w-9 h-9 rounded-full flex items-center justify-center" style={{ background: "linear-gradient(135deg, #3b82f6, #2563eb)" }}>
            <svg className="w-5 h-5 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 2a4 4 0 0 1 4 4v2a4 4 0 0 1-8 0V6a4 4 0 0 1 4-4z" />
              <rect x="2" y="13" width="20" height="8" rx="2" />
              <path d="M12 17v2" />
            </svg>
          </div>
          <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full bg-emerald-400" style={{ border: "2px solid #111827" }} />
        </div>
        <div className="flex-1">
          <div className="text-sm font-semibold text-white">FERI</div>
          <div className="text-xs text-emerald-400">Online</div>
        </div>
        <button onClick={onClose} className="w-7 h-7 rounded-full flex items-center justify-center text-slate-500 hover:text-white hover:bg-white/10 transition-all">
          ✕
        </button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-5 py-4 flex flex-col gap-3">
        {messages.map((msg, i) => (
          <div key={i} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
            <div
              className="max-w-[85%] px-3.5 py-2.5 rounded-xl text-xs leading-relaxed whitespace-pre-line"
              style={{
                background: msg.role === "user" ? "#3b82f6" : "rgba(59, 130, 246, 0.08)",
                color: msg.role === "user" ? "#ffffff" : "#cbd5e1",
                border: msg.role === "user" ? "none" : "1px solid rgba(59, 130, 246, 0.1)",
                borderBottomRightRadius: msg.role === "user" ? "4px" : undefined,
                borderBottomLeftRadius: msg.role === "bot" ? "4px" : undefined,
              }}
            >
              {msg.text}
            </div>
          </div>
        ))}

        {/* Handoff buttons */}
        {showHandoff && (
          <div className="flex gap-2 mt-1">
            <button
              onClick={() => {
                setShowHandoff(false);
                addBotMessage("Your project inquiry has been submitted. The Ferrivox team will reach out to you within 24 hours. Thank you for your interest in Ferrivox!");
              }}
              className="px-4 py-2 rounded-lg text-xs font-semibold text-white transition-all"
              style={{ background: "#3b82f6" }}
            >
              Submit Inquiry ✓
            </button>
            <button
              onClick={handleStartOver}
              className="px-4 py-2 rounded-lg text-xs font-medium text-slate-400 hover:text-white transition-all"
              style={{ border: "1px solid rgba(100,116,139,0.3)" }}
            >
              Start Over
            </button>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Privacy notice */}
      <div className="px-5 py-1.5 text-center" style={{ borderTop: "1px solid rgba(59, 130, 246, 0.06)" }}>
        <p className="text-[9px] text-slate-600 leading-tight">
          Conversations may be processed to provide responses. Don't submit passwords, payment credentials, or confidential data.
        </p>
      </div>

      {/* Input */}
      <div className="px-4 py-3 flex-shrink-0" style={{ borderTop: "1px solid rgba(59, 130, 246, 0.12)" }}>
        <div className="flex gap-2">
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Type your message..."
            className="flex-1 px-3 py-2.5 text-xs rounded-lg outline-none transition-all"
            style={{ color: "#e2e8f0", background: "rgba(59, 130, 246, 0.06)", border: "1px solid rgba(59, 130, 246, 0.15)" }}
            onFocus={(e) => { e.target.style.borderColor = "rgba(59, 130, 246, 0.4)"; }}
            onBlur={(e) => { e.target.style.borderColor = "rgba(59, 130, 246, 0.15)"; }}
          />
          <button
            onClick={handleSend}
            className="px-4 py-2.5 rounded-lg text-xs font-semibold text-white transition-all flex-shrink-0"
            style={{ background: "#3b82f6" }}
            onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = "#2563eb"; }}
            onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = "#3b82f6"; }}
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
}
