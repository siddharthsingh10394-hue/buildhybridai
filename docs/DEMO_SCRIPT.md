# ScriptMatch Hybrid: Official 2:45 Demo Video Script
**Hackathon Target**: #BuildHybridAI (Firebase AI Logic Hybrid Inference)  
**Format**: 1080p Screen Recording with Voiceover (English)  
**Total Runtime**: 2 minutes 45 seconds (Under the 3-minute hard ceiling)

---

## Timeline & Scene Breakdown

### [0:00 - 0:25] Scene 1: The Hook & The Problem
- **Visual**: Screen opens on ScriptMatch Hybrid UI in dark cinematic mode. Mouse hovers over the header showing "ScriptMatch Hybrid • #BuildHybridAI" and the runtime status badges (`App Check: Active`, `Gemini Nano: Ready`).
- **Audio / Voiceover**: 
  > *"Every freelance screenwriter knows the grind: hundreds of job postings, tight deadlines, and constant competition. But evaluating gigs and drafting custom pitch letters takes hours. Even worse, pasting confidential unreleased story concepts into third-party cloud servers risks IP leaks and runs up massive API bills.*
  > *Meet **ScriptMatch Hybrid**, the intelligent screenwriting matchmaker built on **Firebase AI Logic's Hybrid Inference**—bringing confidential on-device Gemini Nano execution and heavy cloud context together under one unified SDK."*

---

### [0:25 - 1:05] Scene 2: The Fast On-Device Path (Gemini Nano)
- **Visual**: Click on the **"Netflix Sci-Fi Mystery Drama Pilot"** preset button. The character counter updates to `532 / 1200 chars` with the cyan badge `⚡ Routes to: On-Device Gemini Nano`. Click **"Score & Draft Outreach"**.
- **Visual Feedback**: Results render with instant zero-latency feedback. A prominent cyan badge appears: `⚡ ON-DEVICE (GEMINI NANO)` with `18 ms latency`.
- **Audio / Voiceover**: 
  > *"Watch this: We select a Netflix Sci-Fi pilot job posting. Because the brief is under 1,200 characters, Firebase AI Logic routes it locally using `InferenceMode.PREFER_ON_DEVICE`. Notice how instantaneous this is—rendered in just 18 milliseconds directly on-device with zero network latency, zero API costs, and 100% writer privacy. The system generates a 94% Compatibility Match Score, breaks down the format, genre, and tone, and crafts a bespoke outreach pitch."*

---

### [1:05 - 1:45] Scene 3: The Airplane Mode / Offline Demo
- **Visual**: Toggle the **"Simulate Offline / Flight Mode"** checkbox. The header badge switches to a red `✈️ Airplane Mode`. Click on the **"A24-Style Psychological Indie Feature"** preset (`425 chars`). Click **"Score & Draft Outreach"**.
- **Visual Feedback**: The model executes smoothly offline. The badge displays `⚡ ON-DEVICE (GEMINI NANO)` with the routing reason `Offline mode: routing exclusively to On-Device Gemini Nano`.
- **Audio / Voiceover**: 
  > *"Now imagine you are on a flight or writing in a cabin with no Wi-Fi. We toggle offline mode. While traditional cloud AI apps fail with network timeout errors, ScriptMatch Hybrid automatically shifts to `InferenceMode.ONLY_ON_DEVICE`. The analysis and proposal generate completely offline on the local laptop hardware. When writers are in the zone, zero connectivity is never a blocker."*

---

### [1:45 - 2:25] Scene 4: The Deep Cloud Context Path (Gemini 2.5 Flash)
- **Visual**: Uncheck offline mode. Click the 4th preset: **"Extensive Multi-Season Fantasy World Bible"** (`1,485 chars`). The badge dynamically turns purple: `☁️ Routes to: Cloud Gemini 2.5 Flash`. Click **"Score & Draft Outreach"**.
- **Visual Feedback**: A short processing state is shown, followed by the result displaying `☁️ CLOUD (GEMINI 2.5 FLASH)` with `640 ms latency`. Review the deep world-building breakdown and the sophisticated multi-paragraph pitch letter.
- **Audio / Voiceover**: 
  > *"What happens when a producer hands you an epic 400-page fantasy novel bible? The prompt now exceeds 1,200 characters. Without writing a single line of separate backend code, Firebase AI Logic seamlessly routes this deep request to **Cloud Gemini 2.5 Flash**, fully protected by Firebase App Check. We get an in-depth thematic breakdown, multi-season relationship analysis, and a studio-grade pitch proposal."*

---

### [2:25 - 2:45] Scene 5: Wrap-up & Compliance Verification
- **Visual**: Scroll down to the recent History panel and open the GitHub repository in a browser tab showing the public `buildhybridai` repo, Apache-2.0 license, and test passing check.
- **Audio / Voiceover**: 
  > *"ScriptMatch Hybrid proves the true power of Firebase AI Logic: instant, private, offline execution when you need it locally, and heavy cloud reasoning when you need scale. It is fully open source under Apache-2.0, verified with automated test suites, and ready for deployment. Thanks for watching!"*
