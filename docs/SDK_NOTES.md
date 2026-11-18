# Firebase AI Logic Hybrid Inference SDK Notes

## 1. Overview & Official Specifications
Firebase AI Logic (formerly Vertex AI in Firebase) introduces client-side **Hybrid Inference** across Web (Chrome desktop), Android, and iOS. In the Web SDK (`firebase/ai`), Firebase integrates directly with Chrome's built-in on-device AI (`window.ai.languageModel` / Gemini Nano) and smoothly falls back to Google AI / Gemini Developer API or Vertex AI in the cloud.

### Official Reference URLs:
- Firebase AI Logic Overview: https://firebase.google.com/docs/ai-logic
- Firebase AI Logic Web Hybrid Inference: https://firebase.google.com/docs/ai-logic/hybrid-inference?platform=web
- Chrome Built-in AI / Prompt API: https://developer.chrome.com/docs/ai/built-in
- Firebase App Check Web: https://firebase.google.com/docs/app-check/web/recaptcha-v3-provider

---

## 2. Package & Imports

Installed packages:
- `firebase`: `>= 12.5.0` (current: `13.4.0`)

Exact ESM imports for Web:
```javascript
import { initializeApp } from "firebase/app";
import { 
  getAI, 
  getGenerativeModel, 
  GoogleAIBackend, 
  InferenceMode, 
  InferenceSource,
  Schema,
  AIError,
  AIErrorCode
} from "firebase/ai";
import { 
  initializeAppCheck, 
  ReCaptchaV3Provider, 
  CustomProvider 
} from "firebase/app-check";
```

---

## 3. Initialization & Backend Configuration

```javascript
// 1. Initialize Firebase App
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID
};

const app = initializeApp(firebaseConfig);

// 2. Initialize App Check with Debug Token support
if (import.meta.env.DEV || import.meta.env.VITE_APPCHECK_DEBUG_TOKEN) {
  self.FIREBASE_APPCHECK_DEBUG_TOKEN = import.meta.env.VITE_APPCHECK_DEBUG_TOKEN || true;
}

// 3. Initialize AI Service
const ai = getAI(app, {
  backend: new GoogleAIBackend()
});
```

---

## 4. Hybrid Inference Modes & Routing

`InferenceMode` defines how Firebase AI Logic selects between local Gemini Nano and Cloud:

| Mode | String Value | Behavior |
| :--- | :--- | :--- |
| `InferenceMode.PREFER_ON_DEVICE` | `'prefer_on_device'` | Executes locally on Gemini Nano if available; falls back automatically to Cloud if unavailable or offline errors occur. |
| `InferenceMode.ONLY_ON_DEVICE` | `'only_on_device'` | Strict local execution. Throws `AIError` if local model is unavailable. Ideal for 100% private/offline tasks. |
| `InferenceMode.PREFER_IN_CLOUD` | `'prefer_in_cloud'` | Attempts Cloud first; falls back to local on-device if network is disconnected. |
| `InferenceMode.ONLY_IN_CLOUD` | `'only_in_cloud'` | Direct Cloud execution (Gemini 2.5 Flash / Pro). |

### Hybrid Model Instantiation:
```javascript
const hybridModel = getGenerativeModel(ai, {
  mode: InferenceMode.PREFER_ON_DEVICE,
  inCloudParams: {
    model: "gemini-2.5-flash"
  },
  onDeviceParams: {
    createOptions: {
      expectedInputs: [{ type: "text" }],
      expectedOutputs: [{ type: "text" }]
    }
  }
});
```

---

## 5. Detecting Inference Source at Runtime

Every call to `generateContent` or `generateContentStream` yields `response.inferenceSource`:

```javascript
const result = await hybridModel.generateContent(prompt);
const text = result.response.text();
const source = result.response.inferenceSource; // "on_device" | "in_cloud"

if (source === InferenceSource.ON_DEVICE) {
  console.log("⚡ Executed on-device via Gemini Nano (0 latency, private, offline, 0 cost)");
} else {
  console.log("☁️ Executed in cloud via Gemini 2.5 Flash");
}
```

---

## 6. On-Device Availability Check
Chrome Desktop exposes `window.ai.languageModel` (or `window.ai.assistant`).
Availability status:
- `"available"`: Model is downloaded and ready to generate immediately.
- `"downloadable"`: Model can be downloaded on first request.
- `"downloading"`: Download is actively in progress.
- `"unavailable"`: Hardware / browser does not support on-device model.
