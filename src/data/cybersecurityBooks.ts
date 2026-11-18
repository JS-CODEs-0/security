export interface BookPage {
  pageNumber: number;
  title: string;
  subtitle: string;
  category: string;
  content: {
    lead: string;
    sections: {
      heading: string;
      body: string;
      codeBlock?: {
        language: string;
        filename?: string;
        code: string;
      };
      callout?: {
        type: "critical" | "intel" | "mitre" | "advisory";
        title: string;
        text: string;
      };
      bulletPoints?: string[];
    }[];
  };
}

export interface CyberBook {
  id: string;
  roman: string;
  number: number;
  title: string;
  discipline: string;
  note: string;
  deck: string;
  binding: string;
  format: string;
  theme: string;
  motif: string;
  motifKey: "brackets" | "paths" | "caret" | "orbits" | "modules" | "frames" | "lattice";
  paletteLabel: string;
  color: string;
  foil: string;
  palette: {
    paper: string;
    paperDeep: string;
    paperPale: string;
    ink: string;
    inkSoft: string;
    wall: string;
    shelf: string;
    shelfDark: string;
    light: string;
    fill: string;
  };
  width: number;
  height: number;
  depth: number;
  chapters: [string, string, string];
  seed: number;
  suggestedPrompts: string[];
  pages: BookPage[];
}

export const CYBER_BOOKS: CyberBook[] = [
  {
    id: "phishing-scam-intelligence",
    roman: "I",
    number: 1,
    title: "Phishing & Scam Intelligence",
    discipline: "Email & Deception Defense",
    note: "Detecting deceptive payloads, impersonation vectors, and social traps.",
    deck: "An operational field guide to identifying sophisticated spear-phishing, business email compromise, quishing campaigns, and automated defensive telemetry.",
    binding: "Amethyst velvet cloth · rose-gold foil",
    format: "148 × 216 mm · intelligence edition",
    theme: "Deception telemetry & credential harvesting defense",
    motif: "Interlocking telemetry brackets",
    motifKey: "brackets",
    paletteLabel: "Amethyst slate · neon violet · rose gold",
    color: "#1c102c",
    foil: "#f472b6",
    palette: {
      paper: "#1c102c",
      paperDeep: "#120920",
      paperPale: "#f5e8ff",
      ink: "#fcfaff",
      inkSoft: "#d8b4fe",
      wall: "#1c102c",
      shelf: "#2a1538",
      shelfDark: "#150a1e",
      light: "#c084fc",
      fill: "#f472b6"
    },
    width: 1.05,
    height: 1.58,
    depth: 0.28,
    chapters: ["Anatomy of Deception", "Impersonation Vectors", "Automated Playbooks"],
    seed: 201,
    suggestedPrompts: [
      "Analyze a spear-phishing email header for spoofed DMARC records",
      "Draft a YARA rule for quishing (QR code) lure attachments",
      "Explain executive Business Email Compromise (BEC) prevention",
      "Provide an incident response checklist for credential harvesting"
    ],
    pages: [
      {
        pageNumber: 1,
        title: "Anatomy of Modern Phishing",
        subtitle: "From Generic Spam to Precision Spear-Phishing",
        category: "Threat Vectors",
        content: {
          lead: "Modern adversary deception has shifted from mass-scale bulk spam to hyper-personalized spear-phishing utilizing OSINT reconnaissance and generative AI voice/text synthesis.",
          sections: [
            {
              heading: "Heuristic Indicators of Deceptive Inbound Mail",
              body: "Adversaries rely heavily on urgency cues, lookalike display names, and newly registered domains (NRDs). Modern secure email gateways (SEGs) inspect body syntax, invisible zero-width unicode characters, and punycode domain mappings.",
              callout: {
                type: "critical",
                title: "TELEMETRY WARNING // Quishing Vector Surge",
                text: "QR code lures embedded in PDF invoices bypass traditional optical character recognition (OCR) filters, redirecting mobile users to AitM credential harvesting proxies."
              }
            },
            {
              heading: "Adversary Infrastructure Footprints",
              body: "Threat groups deploy turnkey phishing frameworks (e.g. Evilginx, Modlishka) that proxy legitimate authentication workflows, capturing both session cookies and time-based OTP codes in flight.",
              bulletPoints: [
                "Inspection of TLS certificate issuer and transparency log timestamps",
                "Detection of reverse-proxy request delays during token exchange",
                "Automated sandboxing of embedded shortened redirect chains"
              ]
            }
          ]
        }
      },
      {
        pageNumber: 2,
        title: "Business Email Compromise (BEC)",
        subtitle: "Executive Impersonation and Wire Fraud Defense",
        category: "Corporate Defense",
        content: {
          lead: "BEC campaigns bypass antivirus scanners entirely because they contain zero malware attachments or suspicious links—relying exclusively on conversational manipulation and spoofed authority.",
          sections: [
            {
              heading: "Attack Mechanics: Executive Wire Transfer Hijack",
              body: "Adversaries establish persistence through compromised vendor mailboxes, creating silent inbox forwarding rules to monitor finance threads until large invoices are routed, then swapping account routing numbers."
            },
            {
              heading: "Email Authentication Triad: SPF, DKIM, DMARC",
              body: "Enforcing strict DMARC `p=reject` policies protects domains from direct header spoofing, while inbound inspection flags display name mismatches matching C-suite executives.",
              callout: {
                type: "mitre",
                title: "MITRE ATT&CK: T1566.002",
                text: "Phishing: Spearphishing Link — Adversaries send targeted emails with malicious links to lure victims into credential disclosure."
              }
            }
          ]
        }
      },
      {
        pageNumber: 3,
        title: "Automated Detection & YARA Rules",
        subtitle: "Programmatic Email Security Filters",
        category: "Detection Implementation",
        content: {
          lead: "Translate threat intelligence into automated parsing rules that quarantine malicious lures at the mail transfer agent (MTA) boundary.",
          sections: [
            {
              heading: "High-Fidelity YARA Detection Signature",
              body: "Detect malicious HTML credential harvesting pages and obfuscated JavaScript credential submission forms.",
              codeBlock: {
                language: "yara",
                filename: "phishing_credential_lure.yar",
                code: `rule Phishing_Credential_Harvester {\n  meta:\n    description = "Detects obfuscated credential capture landing page"\n    author = "Digital Safety Intelligence - Vol I"\n    severity = "HIGH"\n  strings:\n    $input_pass = "type=\\"password\\"" nocase\n    $form_action = /action="https?:\\/\\/[^"']+\\/(login|submit|auth)\\.php"/ nocase\n    $evilginx_fingerprint = "window.location.replace" nocase\n  condition:\n    filesize < 200KB and 2 of them\n}`
              }
            }
          ]
        }
      },
      {
        pageNumber: 4,
        title: "Incident Simulation: Banking Lure Interception",
        subtitle: "Real-Time Triaging and Containment Timeline",
        category: "Incident Walkthrough",
        content: {
          lead: "Step-by-step breakdown of an automated defense response to an active credential harvesting campaign targeting enterprise accounting personnel.",
          sections: [
            {
              heading: "Simulation Event Sequence",
              body: "00:00:00 - Phishing email with dynamic invoice URL received.\n00:00:04 - Inbound SEG sandbox executes URL in headless browser.\n00:00:08 - DOM extraction flags fake Microsoft login with foreign POST target.\n00:00:11 - Automated SIEM alert triggers DAG playbook: message purged from 42 mailboxes.\n00:00:23 - Target domain pushed to enterprise DNS firewall sinkhole.",
              callout: {
                type: "intel",
                title: "CONTAINMENT METRIC: 23 Seconds",
                text: "Zero credentials exposed. All identical lures extracted from user inboxes globally."
              }
            }
          ]
        }
      },
      {
        pageNumber: 5,
        title: "Security Culture & Governance Roadmap",
        subtitle: "Empowering Employees and Continuous Simulation",
        category: "Security Governance",
        content: {
          lead: "Technical controls must be reinforced by a resilient organizational reporting culture where employees report suspicious messages without punitive friction.",
          sections: [
            {
              heading: "Key Behavioral Directives",
              body: "1. Mandate secondary out-of-band verification (voice call on known number) for all banking and wire transfers.\n2. One-click phishing reporting button embedded directly in all email clients.\n3. Continuous micro-simulations utilizing real-world threat templates with instant feedback loops.",
              bulletPoints: [
                "Zero-blame reporting culture accelerates incident response time by 80%",
                "Automated credential rotation triggered on reported compromise",
                "Quarterly review of third-party vendor payment instructions"
              ]
            },
            {
              heading: "Colophon & Signoff",
              body: "Authored by the Deception Intelligence Taskforce. Certified under ISO/IEC 27001 email security controls."
            }
          ]
        }
      }
    ]
  },
  {
    id: "website-link-security",
    roman: "II",
    number: 2,
    title: "Website & Link Security",
    discipline: "Web Safety & Domain Intelligence",
    note: "Malicious URLs, typosquatting, drive-by downloads, and domain analysis.",
    deck: "A comprehensive guide to inspecting web infrastructure: decode obfuscated URLs, neutralize typosquatting, identify malicious TLS certificates, and browse securely.",
    binding: "Amethyst cloth · electric violet foil",
    format: "156 × 228 mm · intelligence edition",
    theme: "URL telemetry & malicious domain neutralisation",
    motif: "Interlaced web paths & certificate verification",
    motifKey: "paths",
    paletteLabel: "Amethyst violet · rose gold · cream",
    color: "#160e28",
    foil: "#c084fc",
    palette: {
      paper: "#160e28",
      paperDeep: "#0e081c",
      paperPale: "#f3e8ff",
      ink: "#fcfaff",
      inkSoft: "#c084fc",
      wall: "#160e28",
      shelf: "#261334",
      shelfDark: "#13081c",
      light: "#c084fc",
      fill: "#c084fc"
    },
    width: 1.1,
    height: 1.46,
    depth: 0.29,
    chapters: ["Domain Anatomy", "Drive-By Exploits", "Protective DNS"],
    seed: 202,
    suggestedPrompts: [
      "How do homograph and punycode domain spoofing attacks work?",
      "Explain the risk of drive-by downloads and browser exploit kits",
      "Write a Python script to extract domain WHOIS and SSL age",
      "Draft a secure Protective DNS policy for enterprise browsers"
    ],
    pages: [
      {
        pageNumber: 1,
        title: "Malicious URLs & Domain Anatomy",
        subtitle: "Typosquatting, IDN Homographs, and Shortened Links",
        category: "Web Threat Vectors",
        content: {
          lead: "A link is rarely what it seems on the surface. Adversaries exploit human visual perception and complex URL parsing specifications to deliver weaponized landing pages.",
          sections: [
            {
              heading: "Internationalized Domain Name (IDN) Homograph Attacks",
              body: "By substituting Latin characters with visually identical Cyrillic or Greek characters (e.g. Cyrillic 'а' U+0430 for Latin 'a'), attackers register domains that appear identical in address bars.",
              callout: {
                type: "critical",
                title: "DOMAIN SPOOF ADVISORY",
                text: "Always inspect the Punycode (`xn--`) representation in modern browsers to detect non-Latin character substitutions."
              }
            },
            {
              heading: "Fast-Flux DNS & Domain Generation Algorithms (DGAs)",
              body: "Botnets constantly rotate IP addresses tied to a single domain name using 300-second TTLs, evading traditional IP blocklists through continuous distributed routing."
            }
          ]
        }
      },
      {
        pageNumber: 2,
        title: "SSL/TLS Certificates & Deceptive Trust",
        subtitle: "Why HTTPS No Longer Equals 'Safe'",
        category: "Transport Security",
        content: {
          lead: "Over 85% of phishing and malware distribution websites now operate over valid HTTPS with valid padlock icons, exploiting user over-reliance on browser security badges.",
          sections: [
            {
              heading: "Automated Certificate Authority Abuse",
              body: "Adversaries leverage free automated ACME certificate authorities (e.g. Let's Encrypt) to provision certificates for typosquatted domains seconds after DNS registration.",
              bulletPoints: [
                "Domain age under 72 hours represents 68% of malicious web sightings",
                "Certificate Transparency (CT) logs provide real-time domain discovery",
                "Wildcard SSL certificates used to spin up hundreds of transient phishing subdomains"
              ]
            }
          ]
        }
      },
      {
        pageNumber: 3,
        title: "Drive-By Downloads & Exploit Kits",
        subtitle: "Zero-Click Exploitation in the Browser Sandbox",
        category: "Technical Implementation",
        content: {
          lead: "Drive-by downloads compromise endpoints through unpatched browser rendering engines or malicious advertising (malvertising) without requiring user clicks.",
          sections: [
            {
              heading: "Domain Reputation Verification Script",
              body: "Python script to evaluate URL risk before invoking downstream rendering agents.",
              codeBlock: {
                language: "python",
                filename: "url_safety_inspector.py",
                code: `import socket, ssl, datetime\n\ndef inspect_domain_age(domain: str) -> dict:\n    ctx = ssl.create_default_context()\n    with ctx.wrap_socket(socket.socket(), server_hostname=domain) as s:\n        s.settimeout(3.0)\n        s.connect((domain, 443))\n        cert = s.getpeercert()\n        not_before = datetime.datetime.strptime(cert['notBefore'], '%b %d %H:%M:%S %Y %Z')\n        age_days = (datetime.datetime.utcnow() - not_before).days\n        return {\n            \"domain\": domain,\n            \"cert_age_days\": age_days,\n            \"risk\": \"HIGH\" if age_days < 14 else \"NORMAL\"\n        }`
              }
            }
          ]
        }
      },
      {
        pageNumber: 4,
        title: "Incident Simulation: Fake Banking Portal Interception",
        subtitle: "Detecting Credential Injection on Spoofed Web App",
        category: "Incident Walkthrough",
        content: {
          lead: "A live walkthrough of how an automated protective DNS resolver neutralized a deceptive banking portal clone.",
          sections: [
            {
              heading: "Attack & Defense Chronology",
              body: "1. Victim clicks SMS link: `https://secure-login-chase-auth.com`.\n2. Protective DNS flags domain registered 4 hours prior.\n3. Request sinkholed to safe warning interstitial landing page.\n4. SOC telemetry traces registrar to known bulletproof hosting provider.\n5. Automated takedown request issued via registrar abuse API.",
              callout: {
                type: "intel",
                title: "ZERO LOSS RECORDED",
                text: "Sinkhole intercepted 184 enterprise employees who received the identical mass SMS lure."
              }
            }
          ]
        }
      },
      {
        pageNumber: 5,
        title: "Protective DNS & Enterprise Web Governance",
        subtitle: "CISA Protective DNS (PDNS) Architecture",
        category: "Strategic Architecture",
        content: {
          lead: "Deploying enterprise Protective DNS blocks malicious link destinations at the name resolution layer before TCP handshakes can initiate.",
          sections: [
            {
              heading: "Recommended Safe Browsing Policies",
              body: "Enforce DNS-over-HTTPS (DoH) with automated category blocking covering newly registered domains (NRDs), known command-and-control (C2) nodes, and dynamic DNS providers.",
              bulletPoints: [
                "Mandatory isolation of unrated URLs via Remote Browser Isolation (RBI)",
                "Blocking all direct-to-IP web connections lacking FQDN hostname headers",
                "Automated browser extension restrictions preventing unauthorized plugins"
              ]
            },
            {
              heading: "Colophon & Review",
              body: "Published by the Web Security Architecture Group. Compatible with CISA Protective DNS guidelines."
            }
          ]
        }
      }
    ]
  },
  {
    id: "password-account-security",
    roman: "III",
    number: 3,
    title: "Password & Account Security",
    discipline: "Credential & Identity Protection",
    note: "Credential stuffing, MFA hardening, passkeys, and account defense.",
    deck: "The definitive manual for hardening digital identities: eliminate password vulnerabilities, defeat MFA bypass proxies, deploy hardware passkeys, and secure vaults.",
    binding: "Midnight purple cloth · amber-gold foil",
    format: "152 × 220 mm · intelligence edition",
    theme: "Identity attestation & passwordless security",
    motif: "Cryptographic locks & authentication carets",
    motifKey: "caret",
    paletteLabel: "Midnight purple · gold · rose",
    color: "#1e1233",
    foil: "#fbbf24",
    palette: {
      paper: "#1e1233",
      paperDeep: "#130922",
      paperPale: "#fdf4ff",
      ink: "#fdf8ff",
      inkSoft: "#fcd34d",
      wall: "#1e1233",
      shelf: "#2e173e",
      shelfDark: "#170a20",
      light: "#fbbf24",
      fill: "#fbbf24"
    },
    width: 1.04,
    height: 1.54,
    depth: 0.27,
    chapters: ["Credential Vulnerabilities", "Hardware Tokens & Passkeys", "Identity Vaults"],
    seed: 203,
    suggestedPrompts: [
      "How do adversaries bypass SMS and push notification MFA?",
      "Explain the cryptographic architecture of FIDO2 passkeys",
      "Draft a secure password generator policy in Python",
      "What are the best practices for enterprise privileged account vaults?"
    ],
    pages: [
      {
        pageNumber: 1,
        title: "Credential Stuffing & Password Cracking",
        subtitle: "The Mathematical Reality of Password Guessing",
        category: "Vulnerability Analysis",
        content: {
          lead: "Billions of breached username/password pairs circulate on dark-web forums. Automated credential stuffing tools weaponize these lists against consumer and corporate portals.",
          sections: [
            {
              heading: "Hash Algorithms and Cracking Velocities",
              body: "Modern GPU clusters compute billions of NTLM and MD5 hashes per second. Enforcing slow, memory-hard hashing algorithms like Argon2id or bcrypt is mandatory for credential storage.",
              callout: {
                type: "critical",
                title: "SECURITY WARNING: Password Reuse",
                text: "A single compromised password on an obscure gaming forum grants adversaries access to corporate accounts if users reuse credentials."
              }
            }
          ]
        }
      },
      {
        pageNumber: 2,
        title: "Multi-Factor Authentication Hardening",
        subtitle: "SMS vs Authenticator Apps vs FIDO2 Hardware Keys",
        category: "Authentication Architecture",
        content: {
          lead: "Not all MFA is created equal. SMS verification is vulnerable to SIM-swapping, while mobile push notifications are defeated by MFA fatigue attacks.",
          sections: [
            {
              heading: "MFA Hierarchy of Resistance",
              body: "1. FIDO2 / WebAuthn Hardware Keys: Phishing-resistant; bound cryptographically to domain origin.\n2. TOTP Authenticator Apps (RFC 6238): Strong against SIM swapping, but vulnerable to AitM reverse proxies.\n3. SMS / Voice MFA: Weakest; susceptible to telecom carrier manipulation and SS7 interception.",
              bulletPoints: [
                "Number matching on push notifications halts 98% of MFA fatigue attempts",
                "Hardware security keys (YubiKey) immune to credential interception",
                "Conditional access policies restricting logins to corporate managed IP ranges"
              ]
            }
          ]
        }
      },
      {
        pageNumber: 3,
        title: "Passkeys & The Passwordless Era",
        subtitle: "FIDO Alliance and Public-Key Cryptography",
        category: "Technical Implementation",
        content: {
          lead: "Passkeys eliminate passwords entirely by generating unique public/private key pairs stored in hardware Secure Enclaves, authenticated via biometrics.",
          sections: [
            {
              heading: "WebAuthn Registration & Verification Flow",
              body: "Server generates a cryptographic challenge; client Secure Enclave signs challenge with private key; server validates signature against stored public key.",
              codeBlock: {
                language: "javascript",
                filename: "passkey_attestation.js",
                code: `// WebAuthn Passkey Creation API\nconst credential = await navigator.credentials.create({\n  publicKey: {\n    challenge: crypto.getRandomValues(new Uint8Array(32)),\n    rp: { name: "Digital Safety Intelligence", id: "cyber.internal" },\n    user: { id: new Uint8Array(16), name: "operator@cyber.internal", displayName: "Operator" },\n    pubKeyCredParams: [{ alg: -7, type: "public-key" }], // ES256\n    authenticatorSelection: { userVerification: "required", residentKey: "required" },\n    timeout: 60000\n  }\n});`
              }
            }
          ]
        }
      },
      {
        pageNumber: 4,
        title: "Incident Simulation: MFA Fatigue Attack Blocked",
        subtitle: "Defeating Repeated Push Prompt Harassment",
        category: "Incident Walkthrough",
        content: {
          lead: "A forensic recreation of an adversary attempting to compromise an administrator account via push notification spamming.",
          sections: [
            {
              heading: "Attack Timeline & Automated Defense",
              body: "02:14:10 - Attacker enters compromised password.\n02:14:11 - Automated script sends 35 consecutive push notifications.\n02:14:28 - Identity provider detects abnormal prompt velocity.\n02:14:30 - Account locked automatically; mandatory FIDO2 hardware token verification enforced.\n02:14:35 - SOC alerts operator to investigate leaked password origin.",
              callout: {
                type: "intel",
                title: "ZERO PRIVILEGE ESCALATION",
                text: "Attacker locked out despite possessing accurate primary password credentials."
              }
            }
          ]
        }
      },
      {
        pageNumber: 5,
        title: "Account Governance & Vault Architecture",
        subtitle: "Enterprise Password Managers and Privileged Access",
        category: "Identity Governance",
        content: {
          lead: "Zero-knowledge encrypted password managers are the bedrock of modern credential hygiene, generating distinct 24-character random passwords per service.",
          sections: [
            {
              heading: "Five Tenets of Enterprise Account Security",
              body: "1. Mandate zero-knowledge enterprise password vaults (Bitwarden, 1Password).\n2. Enforce FIDO2 passkeys for all email, cloud infrastructure, and code repositories.\n3. Automatic revocation of idle accounts after 30 days of inactivity.",
              bulletPoints: [
                "Annual credential exposure audit across darknet breach databases",
                "Elimination of shared service accounts in favor of automated API tokens",
                "Privileged Access Management (PAM) session recording for root operations"
              ]
            },
            {
              heading: "Colophon & Credentials",
              body: "Published by the Identity and Access Governance Directorate. Conforms to NIST SP 800-63B Digital Identity Guidelines."
            }
          ]
        }
      }
    ]
  },
  {
    id: "privacy-intelligence",
    roman: "IV",
    number: 4,
    title: "Privacy Intelligence",
    discipline: "Digital Footprint & Surveillance Defense",
    note: "Browser fingerprinting, data brokers, telemetry evasion, and metadata protection.",
    deck: "An operational field guide to reclaiming privacy: neutralize browser fingerprinting, purge data broker aggregators, protect communication metadata, and minimize personal exposure.",
    binding: "Royal violet cloth · luminous cyan foil",
    format: "148 × 216 mm · intelligence edition",
    theme: "Surveillance resistance & metadata neutralization",
    motif: "Concentric privacy rings & tracking barriers",
    motifKey: "orbits",
    paletteLabel: "Royal violet · neon cyan · rose gold",
    color: "#140a22",
    foil: "#818cf8",
    palette: {
      paper: "#140a22",
      paperDeep: "#0d0617",
      paperPale: "#eef2ff",
      ink: "#f8faff",
      inkSoft: "#a5b4fc",
      wall: "#140a22",
      shelf: "#281236",
      shelfDark: "#14081c",
      light: "#818cf8",
      fill: "#818cf8"
    },
    width: 1.08,
    height: 1.58,
    depth: 0.28,
    chapters: ["Browser Fingerprinting", "Data Broker Recon", "Metadata Encryption"],
    seed: 204,
    suggestedPrompts: [
      "How does canvas and audio browser fingerprinting work?",
      "What steps are required to purge personal data from data broker aggregators?",
      "Explain the difference between message encryption and metadata protection",
      "Draft a personal threat model for an investigative journalist"
    ],
    pages: [
      {
        pageNumber: 1,
        title: "Browser Fingerprinting & Tracking",
        subtitle: "Canvas Extraction, WebGL Signatures, and Font Probing",
        category: "Tracking Vectors",
        content: {
          lead: "Even with cookies disabled and private browsing mode enabled, websites can uniquely track devices across sessions by querying subtle hardware and rendering variances.",
          sections: [
            {
              heading: "Fingerprinting Mechanics Breakdown",
              body: "Websites render hidden canvas graphics, evaluate audio buffer delays, and query installed fonts. The resulting hash is 99.2% unique to your specific GPU, operating system, and display drivers.",
              callout: {
                type: "critical",
                title: "SURVEILLANCE FACTOR",
                text: "Ad networks correlate canvas fingerprints across disparate websites to build behavioral dossiers without requiring account logins."
              }
            }
          ]
        }
      },
      {
        pageNumber: 2,
        title: "Data Brokers & Commercial Reconnaissance",
        subtitle: "The Multi-Billion Dollar Surveillance Economy",
        category: "Information Ecosystems",
        content: {
          lead: "Commercial data brokers aggregate vehicle registrations, voter records, real-estate transactions, and mobile ad telemetry to map home addresses, family ties, and net worth.",
          sections: [
            {
              heading: "Mobile Ad ID (MAID) Geolocation Tracing",
              body: "Free mobile apps with embedded ad SDKs constantly transmit GPS coordinates, allowing brokers to map routine travel patterns, workplace locations, and sensitive health visits.",
              bulletPoints: [
                "Resetting Advertising ID monthly limits long-term tracking profiles",
                "Submitting automated opt-out notices under CCPA / GDPR frameworks",
                "Using dedicated virtual aliases (SimpleLogin, Apple Hide My Email) for online services"
              ]
            }
          ]
        }
      },
      {
        pageNumber: 3,
        title: "Metadata vs Content Encryption",
        subtitle: "Why E2EE Alone Does Not Guarantee Anonymity",
        category: "Communication Security",
        content: {
          lead: "End-to-End Encryption protects the words inside a message, but leaves metadata exposed: who spoke to whom, at what time, from what IP address, and with what frequency.",
          sections: [
            {
              heading: "Signal Protocol vs Commercial Messaging",
              body: "True privacy requires zero metadata storage: sealed sender protocols obscure the identity of the message originator from the service provider itself.",
              codeBlock: {
                language: "json",
                filename: "privacy_threat_matrix.json",
                code: `{\n  \"app\": \"Signal\",\n  \"metadata_stored\": [\"account_creation_timestamp\", \"last_service_connection\"],\n  \"contacts_uploaded\": false,\n  \"message_contents\": \"E2EE_SIGNAL_PROTOCOL\",\n  \"sealed_sender\": true\n}`
              }
            }
          ]
        }
      },
      {
        pageNumber: 4,
        title: "Incident Simulation: Re-Identification Thwarted",
        subtitle: "Anonymized Web Traffic Correlation Neutralized",
        category: "Simulation Walkthrough",
        content: {
          lead: "Walkthrough of how a hardened browser configuration defeated a commercial tracking network attempting to re-identify an anonymous user.",
          sections: [
            {
              heading: "Execution & Countermeasure Timeline",
              body: "1. Tracker executes Canvas 2D render test.\n2. Hardened browser injects random sub-pixel noise into canvas output.\n3. Fingerprint hash shifts on every page reload.\n4. Tracker fails to link current browsing session to existing historical profile.\n5. Third-party cookies and tracking script storage blocked at network layer.",
              callout: {
                type: "intel",
                title: "CORRELATION CONFIDENCE: 0.0%",
                text: "Tracker concluded user was an unprofiled generic device; personal identity preserved."
              }
            }
          ]
        }
      },
      {
        pageNumber: 5,
        title: "Personal Privacy Defense Roadmap",
        subtitle: "Comprehensive Hardening Directives",
        category: "Privacy Governance",
        content: {
          lead: "Reclaiming privacy is an ongoing practice of minimizing exposure vectors and enforcing friction against automated data harvesters.",
          sections: [
            {
              heading: "Actionable Privacy Checklist",
              body: "1. Utilize Mullvad Browser or Brave with aggressive fingerprint protection enabled.\n2. Route DNS through privacy-respecting resolvers that discard IP logs (e.g. NextDNS, Mullvad).\n3. Remove home address and telephone records from public people-search directories.",
              bulletPoints: [
                "Utilize privacy-focused operating systems (GrapheneOS for mobile, Tails for air-gapped tasks)",
                "Separate identities: keep work, personal, and shopping identities completely partitioned",
                "Encrypt all mobile backups locally with tenant-held passphrase keys"
              ]
            },
            {
              heading: "Colophon & Review",
              body: "Compiled by the Privacy Rights and Surveillance Defense Council. Aligned with Electronic Frontier Foundation (EFF) privacy guidelines."
            }
          ]
        }
      }
    ]
  },
  {
    id: "malware-device-security",
    roman: "V",
    number: 5,
    title: "Malware & Device Security",
    discipline: "Endpoint Defense & Threat Neutralization",
    note: "Infostealers, ransomware, mobile spyware, and OS hardening.",
    deck: "An engineering manual for safeguarding physical and mobile devices: neutralize infostealer malware, defeat ransomware propagation, audit mobile permissions, and harden kernels.",
    binding: "Amethyst obsidian cloth · neon violet foil",
    format: "148 × 220 mm · intelligence edition",
    theme: "Endpoint resilience & malware containment",
    motif: "Container modules & cluster mesh",
    motifKey: "modules",
    paletteLabel: "Amethyst slate · neon violet · rose gold",
    color: "#181124",
    foil: "#c084fc",
    palette: {
      paper: "#181124",
      paperDeep: "#100918",
      paperPale: "#f5e8ff",
      ink: "#fbf6ff",
      inkSoft: "#cca3ee",
      wall: "#181124",
      shelf: "#432016",
      shelfDark: "#1f0d08",
      light: "#c084fc",
      fill: "#c084fc"
    },
    width: 1.02,
    height: 1.50,
    depth: 0.26,
    chapters: ["Infostealer Ecosystems", "Ransomware Defense", "Mobile Hardening"],
    seed: 205,
    suggestedPrompts: [
      "How do RedLine and Lumma infostealers harvest browser cookies?",
      "What are the best practices for stopping ransomware wiper propagation?",
      "How can an operator audit an iPhone for Pegasus zero-click spyware?",
      "Draft a secure device hardening checklist for Windows 11 and macOS"
    ],
    pages: [
      {
        pageNumber: 1,
        title: "Infostealers & Credential Theft",
        subtitle: "Lumma, RedLine, and Browser Vault Extraction",
        category: "Malware Threats",
        content: {
          lead: "Commodity infostealers delivered through cracked software, YouTube video descriptions, and fake GitHub repositories extract stored passwords, browser cookies, and crypto wallet seeds in seconds.",
          sections: [
            {
              heading: "Memory Scraping & SQLite Database Extraction",
              body: "Infostealers bypass user-space permissions by reading Chrome and Firefox SQLite `Login Data` and `Cookies` files directly from disk, decrypting them via OS DPAPI master keys.",
              callout: {
                type: "critical",
                title: "INFECTION WARNING: Session Cookie Exfiltration",
                text: "Stealing active session cookies allows adversaries to bypass MFA completely and impersonate users inside AWS and Google Workspace accounts."
              }
            }
          ]
        }
      },
      {
        pageNumber: 2,
        title: "Ransomware Tactics & Wiper Payloads",
        subtitle: "Volume Shadow Copy Deletion and Encryption Mechanics",
        category: "Host Protection",
        content: {
          lead: "Ransomware operators pair fast symmetric encryption (ChaCha20, AES) with automated deletion of local backup snapshots (`vssadmin delete shadows /all /quiet`).",
          sections: [
            {
              heading: "Defense: Immutable Offline Air-Gapped Backups",
              body: "The only definitive defense against ransomware is the 3-2-1 backup rule: three copies of data on two different media types, with one copy stored completely offline and air-gapped.",
              bulletPoints: [
                "Controlled Folder Access on Windows prevents unauthorized ransomware file modifications",
                "Canary honeypot files detect encryption activity in sub-second timeframes",
                "Strict PowerShell execution policies (`ConstrainedLanguage`) block fileless droppers"
              ]
            }
          ]
        }
      },
      {
        pageNumber: 3,
        title: "Mobile Security & Zero-Click Spyware",
        subtitle: "Pegasus, Lockdown Mode, and Permission Auditing",
        category: "Mobile Defense",
        content: {
          lead: "Advanced state-sponsored surveillance software (NSO Group Pegasus) targets mobile devices using zero-click exploits in iMessage and WhatsApp rendering engines.",
          sections: [
            {
              heading: "Enabling Apple Lockdown Mode",
              body: "Lockdown Mode restricts web rendering features, disables complex image parsing, blocks incoming FaceTime calls from unknown contacts, and terminates wired USB connections when locked.",
              codeBlock: {
                language: "bash",
                filename: "mobile_audit_probe.sh",
                code: `#!/bin/bash\n# Audit Android ADB permissions for unauthorized background surveillance\nadb shell pm list packages -3 | while read -r pkg; do\n  app=\${pkg#package:}\n  echo \"[+] Inspecting: \$app\"\n  adb shell dumpsys package \"\$app\" | grep -E \"PERMISSION_GRANTED.*(RECORD_AUDIO|CAMERA|ACCESS_FINE_LOCATION)\"\ndone`
              }
            }
          ]
        }
      },
      {
        pageNumber: 4,
        title: "Incident Simulation: Infostealer Infection Neutralized",
        subtitle: "Immediate Quarantine and Credential Containment",
        category: "Incident Walkthrough",
        content: {
          lead: "A live drill demonstrating emergency incident containment following an employee downloading an infected Trojan document.",
          sections: [
            {
              heading: "Containment Timeline",
              body: "1. User runs malicious `invoice.pdf.exe`.\n2. Endpoint EDR identifies unauthorized memory read of browser DPAPI storage.\n3. Endpoint network interface disconnected immediately via automated agent.\n4. Central identity provider revokes all active OAuth refresh tokens for user.\n5. Workstation wiped and re-imaged from clean golden image in 18 minutes.",
              callout: {
                type: "intel",
                title: "ZERO DATA EXFILTRATION",
                text: "EDR process suspension killed the infostealer before outbound C2 transmission could occur."
              }
            }
          ]
        }
      },
      {
        pageNumber: 5,
        title: "Endpoint Hardening Baselines & Governance",
        subtitle: "CIS Benchmarks for Personal and Enterprise Workstations",
        category: "Device Governance",
        content: {
          lead: "Baseline hardening eliminates 90% of commodity malware vectors through simple architectural adjustments.",
          sections: [
            {
              heading: "Five Critical Device Hardening Steps",
              body: "1. Enforce BitLocker / FileVault full-disk encryption with startup PIN.\n2. Operate standard day-to-day accounts without local administrator privileges.\n3. Disable Remote Desktop Protocol (RDP) and universal plug-and-play (UPnP).",
              bulletPoints: [
                "Install automated OS and browser patches within 24 hours of release",
                "Disable USB auto-run and restrict unauthorized external mass storage devices",
                "Deploy DNS sinkholes on local home networks to block outbound malware telemetry"
              ]
            },
            {
              heading: "Colophon & Certification",
              body: "Authored by the Endpoint Security and Malware Analysis Lab. Aligned with CIS Benchmarks for Windows and macOS."
            }
          ]
        }
      }
    ]
  },
  {
    id: "social-engineering-fraud",
    roman: "VI",
    number: 6,
    title: "Social Engineering & Fraud",
    discipline: "Human Risk & Cognitive Defense",
    note: "Deepfakes, voice clones, psychological manipulation, and fraud defense.",
    deck: "The definitive guide to cognitive and psychological security: counter AI voice cloning, neutralize high-pressure executive fraud, identify deepfakes, and establish family verification protocols.",
    binding: "Crimson amethyst cloth · rose-gold foil",
    format: "148 × 224 mm · intelligence edition",
    theme: "Cognitive defense & synthetic media resistance",
    motif: "Cognitive boundary frames & psychological barriers",
    motifKey: "frames",
    paletteLabel: "Crimson amethyst · rose gold · bronze",
    color: "#220d26",
    foil: "#fb7185",
    palette: {
      paper: "#220d26",
      paperDeep: "#140717",
      paperPale: "#ffe4e6",
      ink: "#fff5f6",
      inkSoft: "#fda4af",
      wall: "#220d26",
      shelf: "#30132b",
      shelfDark: "#180715",
      light: "#fb7185",
      fill: "#fb7185"
    },
    width: 1.06,
    height: 1.54,
    depth: 0.27,
    chapters: ["Psychological Triggers", "Synthetic Media & Deepfakes", "Verification Protocols"],
    seed: 206,
    suggestedPrompts: [
      "How do AI voice cloning tools replicate speech from a 3-second audio sample?",
      "What are the best verbal duress code words for family and executive verification?",
      "Explain the psychological mechanisms behind high-urgency investment and gift card scams",
      "Draft a corporate verification procedure for executive emergency requests"
    ],
    pages: [
      {
        pageNumber: 1,
        title: "Psychological Triggers & Exploitation",
        subtitle: "Urgency, Authority, Fear, and the Hijacked Amygdala",
        category: "Human Risk Vectors",
        content: {
          lead: "Adversaries target the human nervous system before they target software. By inducing panic or deference to authority, fraudsters short-circuit rational critical thinking.",
          sections: [
            {
              heading: "The Six Levers of Social Influence",
              body: "Robert Cialdini's principles weaponized: Authority (impersonating law enforcement or CEO), Scarcity ('account deleted in 10 minutes'), Social Proof ('all employees submitted this form'), and Sympathy ('I am stranded and need help').",
              callout: {
                type: "critical",
                title: "PSYCHOLOGICAL ADVISORY",
                text: "Whenever an interaction triggers an immediate spike in urgency or heart rate, treat it as an active cognitive attack vector."
              }
            }
          ]
        }
      },
      {
        pageNumber: 2,
        title: "Synthetic Media & AI Voice Cloning",
        subtitle: "Real-Time Deepfake Video and Audio Impersonation",
        category: "Emerging Threats",
        content: {
          lead: "Generative AI models can clone any human voice with natural inflection and breathing patterns using only 3 seconds of reference audio harvested from social media videos.",
          sections: [
            {
              heading: "The Virtual Kidnapping & CEO Phone Call Vectors",
              body: "Fraudsters call families or finance directors using cloned voices of their loved ones or executives, demanding urgent cryptocurrency or wire transfers while keeping the line open to prevent verification calls.",
              bulletPoints: [
                "Establish a shared verbal 'safe word' with family and colleagues for distress situations",
                "Ask unexpected personal trivia questions that cannot be answered via public social media",
                "Always hang up and call back on a pre-verified telephone number"
              ]
            }
          ]
        }
      },
      {
        pageNumber: 3,
        title: "Verification Protocols & Duress Codes",
        subtitle: "Programmatic Defensive Verification Systems",
        category: "Operational Protocols",
        content: {
          lead: "Implement deterministic verification procedures that remove ambiguity during high-stress scenarios.",
          sections: [
            {
              heading: "Executive Verification Callback Directive",
              body: "Mandatory corporate policy governing any request to modify bank accounts, purchase gift cards, or transmit sensitive personnel records.",
              codeBlock: {
                language: "yaml",
                filename: "executive_verification_policy.yaml",
                code: `policy:\n  name: "Executive Out-of-Band Request Authorization"\n  trigger: "Financial transfer > $5000 OR credential request"\n  mandatory_steps:\n    - step: 1\n      action: "Immediate halt of all transactional processing"\n    - step: 2\n      action: "Direct secondary telephone or video call to pre-registered contact card"\n    - step: 3\n      action: "Verification of duress code phrase"\n    - step: 4\n      action: "Dual-signoff approval logged in immutable compliance ledger"`
              }
            }
          ]
        }
      },
      {
        pageNumber: 4,
        title: "Incident Simulation: Deepfake Wire Transfer Intercepted",
        subtitle: "Defeating an AI-Generated Video Conference Call",
        category: "Incident Walkthrough",
        content: {
          lead: "A case study of a real-world multi-million dollar synthetic media fraud attempt thwarted by operational skepticism.",
          sections: [
            {
              heading: "Attack & Defense Sequence",
              body: "1. CFO invited to secret Zoom meeting with 'CEO' and 'legal counsel'.\n2. Real-time deepfake video and cloned audio instructs immediate $4.2M acquisition deposit.\n3. CFO notices slight facial artifacting when the CEO turns sideways.\n4. CFO requests verbal family safe word; fake CEO responds with evasive hostility.\n5. CFO terminates call, notifies security director, and freezes corporate ledger.",
              callout: {
                type: "intel",
                title: "$4,200,000 SAVED",
                text: "Strict protocol adherence saved the organization from catastrophic loss."
              }
            }
          ]
        }
      },
      {
        pageNumber: 5,
        title: "Cognitive Security Culture & Governance",
        subtitle: "Building Human Firewalls Against Deception",
        category: "Governance & Culture",
        content: {
          lead: "Security culture is measured by how employees respond under psychological pressure, not by compliance survey completion scores.",
          sections: [
            {
              heading: "Key Cultural Pillars",
              body: "1. No employee is ever disciplined for verifying or pausing a suspicious executive directive.\n2. Normalization of skepticism: verification is viewed as professionalism, not disrespect.\n3. Regular debriefs on new AI-driven scams and synthetic media tactics.",
              bulletPoints: [
                "Establish family emergency code words and rehearse them semi-annually",
                "Lock down social media privacy settings to restrict public voice and video samples",
                "Enable secondary biometric confirmations for all electronic banking transactions"
              ]
            },
            {
              heading: "Colophon & Signoff",
              body: "Authored by the Behavioral Security & Anti-Fraud Operations Directorate. Reviewed under NIST Social Engineering Defense guidelines."
            }
          ]
        }
      }
    ]
  },
  {
    id: "personal-cyber-defence",
    roman: "VII",
    number: 7,
    title: "Personal Cyber Defence",
    discipline: "Comprehensive Operational Security",
    note: "Personal threat modeling, home network defense, travel security, and OPSEC.",
    deck: "The ultimate operational security manual for individuals: build personal threat models, harden home routers, isolate IoT devices, travel securely, and construct air-gapped emergency vaults.",
    binding: "Titanium amethyst cloth · holographic violet foil",
    format: "152 × 228 mm · intelligence edition",
    theme: "Personal resiliency & operational security",
    motif: "Cryptographic defense mesh & air-gapped boundaries",
    motifKey: "lattice",
    paletteLabel: "Obsidian titanium · holographic violet · rose gold",
    color: "#150f24",
    foil: "#a855f7",
    palette: {
      paper: "#150f24",
      paperDeep: "#0d0917",
      paperPale: "#faf5ff",
      ink: "#fcfaff",
      inkSoft: "#d8b4fe",
      wall: "#150f24",
      shelf: "#291336",
      shelfDark: "#14081c",
      light: "#a855f7",
      fill: "#a855f7"
    },
    width: 1.07,
    height: 1.56,
    depth: 0.28,
    chapters: ["Personal Threat Modeling", "Home Router & IoT VLANs", "Travel Security OPSEC"],
    seed: 207,
    suggestedPrompts: [
      "How do I create a realistic personal threat model based on my digital profile?",
      "What is the best way to isolate smart TVs and IoT gadgets on home Wi-Fi VLANs?",
      "Explain the Evil Maid attack and how to protect a laptop during international travel",
      "Draft an emergency 3-2-1 backup plan and digital will contingency"
    ],
    pages: [
      {
        pageNumber: 1,
        title: "Personal Threat Modeling",
        subtitle: "Assets, Adversaries, Vulnerabilities, and Risk Tolerance",
        category: "OPSEC Foundations",
        content: {
          lead: "Security without a threat model is paranoia. A personal threat model defines what you are protecting, who you are protecting it from, and what realistic resources they possess.",
          sections: [
            {
              heading: "The Five Threat Modeling Questions",
              body: "1. What are your high-value assets? (Financial accounts, private keys, primary email, medical records).\n2. Who are your adversaries? (Opportunistic cybercriminals, targeted stalkers, competitors, nation-states).\n3. What are the consequences of compromise?\n4. What attack surfaces exist?\n5. What reasonable countermeasures can be maintained consistently?",
              callout: {
                type: "critical",
                title: "CORE OPSEC AXIOM",
                text: "Security that is too burdensome to maintain will inevitably be abandoned. Design protocols that align with daily routines."
              }
            }
          ]
        }
      },
      {
        pageNumber: 2,
        title: "Home Network & IoT Microsegmentation",
        subtitle: "Router Hardening, VLANs, and Guest Networks",
        category: "Network Defense",
        content: {
          lead: "Smart lightbulbs, streaming sticks, and connected home appliances receive zero security updates after 12 months. Leaving them on your primary laptop Wi-Fi is an extreme vulnerability.",
          sections: [
            {
              heading: "Home Wi-Fi VLAN Architecture",
              body: "Segment your home router into three isolated virtual LANs: Primary (workstations, phones, secure vaults), IoT (smart TVs, thermostats, cameras with zero access to primary subnet), and Guest (visiting friends, untrusted devices).",
              bulletPoints: [
                "Disable UPnP (Universal Plug and Play) to prevent malware from opening router ports",
                "Change default router administrative passwords to 20+ character random passphrases",
                "Deploy WPA3-Personal encryption across all wireless access points"
              ]
            }
          ]
        }
      },
      {
        pageNumber: 3,
        title: "Secure Travel OPSEC & Border Crossings",
        subtitle: "Evil Maid Attacks, Public Wi-Fi, and Burner Hardware",
        category: "Operational Security",
        content: {
          lead: "Hotel rooms and international border checkpoints introduce physical compromise risks where unattended hardware can be tampered with via hardware implants.",
          sections: [
            {
              heading: "Tamper-Evident Hardware Controls",
              body: "Use glitter nail polish over laptop screws to detect physical opening attempts ('Evil Maid' attacks). For high-risk international travel, travel with clean burner laptops containing zero sensitive local data.",
              codeBlock: {
                language: "bash",
                filename: "travel_security_checklist.sh",
                code: `#!/bin/bash\n# Travel lockdown script: disable Bluetooth, clear cache, lock firmware\necho \"[+] Locking network interfaces for travel...\"\nsudo rfkill block bluetooth\nsudo systemctl stop cups-browsed\necho \"[+] Enabling strict firewall drop rules...\"\nsudo ufw default deny incoming\nsudo ufw default allow outgoing\nsudo ufw enable`
              }
            }
          ]
        }
      },
      {
        pageNumber: 4,
        title: "Incident Simulation: Compromised Travel Network",
        subtitle: "Airport Rogue Access Point Neutralized",
        category: "Incident Walkthrough",
        content: {
          lead: "A live exercise evaluating an operator's defenses when accidentally connecting to an adversary-controlled 'Free Airport Wi-Fi' hotspot.",
          sections: [
            {
              heading: "Detection and Evasion Sequence",
              body: "1. Laptop auto-connects to spoofed SSID broadcasting duplicate airport name.\n2. Adversary initiates ARP poisoning and DNS redirection to intercept credentials.\n3. Operator's system-level WireGuard VPN tunnel blocks plain DNS requests, tunneling all traffic through an encrypted tunnel to home bastion.\n4. Adversary packet capture records only opaque encrypted WireGuard UDP packets.\n5. Zero plaintext credentials, URLs, or cookies exposed.",
              callout: {
                type: "intel",
                title: "ENCRYPTION HELD",
                text: "The always-on killswitch VPN prevented all unencrypted local subnet leakage."
              }
            }
          ]
        }
      },
      {
        pageNumber: 5,
        title: "The Resilient Operator Blueprint",
        subtitle: "Emergency Contingency and Digital Legacy",
        category: "Resiliency Architecture",
        content: {
          lead: "True operational security includes planning for catastrophic device loss, emergency evacuation, and digital succession planning.",
          sections: [
            {
              heading: "The Emergency Go-Bag Checklist",
              body: "1. Two encrypted USB drives containing offline backups of vital identification, passports, and recovery seed phrases.\n2. Backup hardware FIDO2 security keys registered to primary identity providers.\n3. Printed paper emergency kit containing 24-word recovery seeds sealed in tamper-evident envelopes in a secure fireproof vault.",
              bulletPoints: [
                "Establish a trusted contact protocol for digital estate handover",
                "Conduct an annual personal security audit every December",
                "Maintain continuous operational discipline: defense is an ongoing habit"
              ]
            },
            {
              heading: "Colophon & Author Signoff",
              body: "Published by the Personal Cyber Defense Directorate. Dedicated to the digital safety of free individuals everywhere."
            }
          ]
        }
      }
    ]
  }
];
