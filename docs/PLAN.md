# Architecture & Implementation Plan: ScriptMatch Hybrid

## 1. Product Overview: ScriptMatch Hybrid
**ScriptMatch Hybrid** is a high-performance web application and Chrome extension built for freelance scriptwriters, screenwriters, and creative copywriters.
It analyzes film/TV/commercial writing job postings, produces an instant Compatibility Score & breakdown, summarizes project specifications, and crafts high-conversion client outreach proposals.

### Hybrid Inference Strategy:
- **Fast / Routine Tasks (< 1,200 characters)**: Screenplay pitch analysis, job requirements breakdown, match score, quick summary. Routed to **On-Device Gemini Nano** (zero cloud cost, zero network latency, 100% confidential and private).
- **Deep / Creative Tasks (> 1,200 characters or Complex Pitch Generation)**: In-depth pilot beat sheets, custom pitch treatment drafting, complex sample analysis. Routed to **Cloud Gemini 2.5 Flash** (via Firebase AI Logic).
- **Offline / Flight Mode**: Automatic fallback or user toggle to On-Device execution.
- **Visual Badge**: Prominent, real-time badge on every result indicating `⚡ On-device (Gemini Nano)` or `☁️ Cloud (Gemini 2.5 Flash)`.

---

## 2. System Architecture

```
+-------------------------------------------------------------------+
|                        Client Application                         |
|               (React + Vite + Tailwind CSS / Vanilla UI)          |
+---------------------------------+---------------------------------+
                                  |
               +------------------v------------------+
               |         Hybrid Router & AI Core     |
               |             (/src/ai/)              |
               +--------+-------------------+--------+
                        |                   |
        [Short Prompt / Offline]    [Long Prompt / Deep Pitch]
                        |                   |
                        v                   v
            +-------------------+   +--------------------+
            | Firebase AI Logic |   | Firebase AI Logic  |
            | (PREFER_ON_DEVICE)|   | (ONLY_IN_CLOUD)    |
            |     via Chrome    |   |     via Cloud      |
            |   Gemini Nano     |   |  Gemini 2.5 Flash  |
            +---------+---------+   +---------+----------+
                      |                       |
                      +-----------+-----------+
                                  |
                                  v
                    +---------------------------+
                    | Response + Source Badge   |
                    | (inferenceSource: on/cloud)|
                    +---------------------------+
                                  |
                    +-------------v-------------+
                    | App Check & Persistence   |
                    | (Debug Token / Firestore) |
                    +---------------------------+
```

---

## 3. Directory & File Structure

```
hackerthon/
├── docs/
│   ├── SDK_NOTES.md         # Exact Firebase AI Logic specifications
│   ├── PLAN.md              # Architecture and design
│   ├── STATUS.md            # Live execution tracking
│   ├── DEMO_SCRIPT.md       # 2:45 video recording guide
│   └── COMPLIANCE_AUDIT.md  # Pass/Fail rule checklist
├── public/
│   ├── favicon.svg
│   └── manifest.json        # MV3 extension & PWA manifest
├── src/
│   ├── ai/
│   │   ├── firebase.js      # App & App Check initialization
│   │   ├── hybridCore.js    # Firebase AI Logic hybrid routing & inference
│   │   └── prompts.js       # Structured prompt engineering & schemas
│   ├── components/
│   │   ├── Header.jsx       # Branding, hardware/model status badge
│   │   ├── JobInput.jsx     # Job posting input, sample selector, sliders
│   │   ├── ResultCard.jsx   # Match score, breakdown, badge, pitch draft
│   │   └── HistoryView.jsx  # Past queries and saved pitches
│   ├── App.jsx              # Main application shell
│   ├── main.jsx             # DOM entry point
│   └── index.css            # Styling and visual design system
├── tests/
│   └── hybridCore.test.js   # Unit & routing tests with mocked SDK
├── .env.example             # Safe template with placeholder values
├── firebase.json            # Firebase hosting and project config
├── package.json
├── vite.config.js
├── LICENSE                  # Apache-2.0
└── README.md                # Comprehensive documentation
```

---

## 4. On-Device vs Cloud Routing Rules
1. **Model Preference**:
   - `InferenceMode.PREFER_ON_DEVICE` is the default standard for quick job analysis, compatibility scoring, and bullet summarization.
   - If on-device Gemini Nano is available in Chrome, it executes with 0 ms round-trip network latency.
   - If unavailable or running in a browser without local model weights, it gracefully executes in cloud.
2. **Context Threshold Routing**:
   - Jobs or scripts > 1,200 characters or requests for "Full Pitch & Treatment Draft" automatically utilize Cloud Gemini 2.5 Flash for extended context window and nuanced creative prose.
   - If offline (`navigator.onLine === false`), the router enforces `InferenceMode.ONLY_ON_DEVICE` so writers can continue working on airplanes or without internet.
3. **Execution Transparency**:
   - Every response receives the exact runtime `inferenceSource` (`"on_device"` or `"in_cloud"`) and execution latency (ms), displayed prominently on the UI.

---

## 5. Security & Safety Rules
- Zero API keys, debug secrets, or private tokens committed to Git.
- App Check initialized with debug token support in development.
- `.gitignore` strictly protects `.env`, build artifacts, and private credential files.
