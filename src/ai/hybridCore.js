/**
 * Hybrid Core Inference Engine
 * 
 * Powered by Firebase AI Logic (firebase/ai)
 * Implements intelligent routing between On-Device Gemini Nano and Cloud Gemini 2.5 Flash.
 */

import { getGenerativeModel, InferenceMode, InferenceSource } from 'firebase/ai';
import { ai } from './firebase.js';
import { SCRIPTWRITER_SYSTEM_INSTRUCTION, parseAIResponse } from './prompts.js';

// Default character length cutoff for routing to cloud vs local
const DEFAULT_LENGTH_THRESHOLD = 1200;

/**
 * Check if the current browser environment supports on-device AI (Gemini Nano)
 */
export async function checkOnDeviceCapabilities() {
  if (typeof window === 'undefined') {
    return { available: false, status: 'unavailable', reason: 'SSR / non-browser' };
  }

  // Check for Chrome Built-in AI Prompt API
  const aiHost = window.ai || window.modelProvider;
  if (!aiHost || (!aiHost.languageModel && !aiHost.assistant)) {
    return { 
      available: false, 
      status: 'unavailable', 
      reason: 'Chrome Prompt API not detected (use Chrome Canary or enable chrome://flags/#prompt-api-for-gemini-nano)' 
    };
  }

  try {
    const lm = aiHost.languageModel || aiHost.assistant;
    if (typeof lm.capabilities === 'function') {
      const caps = await lm.capabilities();
      return {
        available: caps.available === 'readily' || caps.available === 'after-download',
        status: caps.available,
        defaultTemperature: caps.defaultTemperature,
        maxTokens: caps.maxTopK
      };
    } else if (typeof lm.availability === 'function') {
      const status = await lm.availability();
      return {
        available: status === 'available' || status === 'downloadable' || status === 'readily',
        status: status
      };
    }
  } catch (err) {
    console.debug('[OnDeviceCheck] Non-fatal check error:', err);
  }

  return { available: true, status: 'detected' };
}

/**
 * Determine the optimal InferenceMode based on prompt size, network status, and user settings
 */
export function resolveInferenceMode(jobText, userMode = 'auto', customThreshold = DEFAULT_LENGTH_THRESHOLD) {
  // Only detect offline in a browser environment where navigator.onLine is strictly false
  const isOffline = typeof window !== 'undefined' && typeof navigator !== 'undefined' && navigator.onLine === false;

  if (isOffline) {
    // Offline forces on-device execution
    return {
      mode: InferenceMode.ONLY_ON_DEVICE,
      reason: 'Offline mode: routing exclusively to On-Device Gemini Nano'
    };
  }

  if (userMode === 'force-on-device') {
    return {
      mode: InferenceMode.ONLY_ON_DEVICE,
      reason: 'User forced On-Device inference'
    };
  }

  if (userMode === 'force-cloud') {
    return {
      mode: InferenceMode.ONLY_IN_CLOUD,
      reason: 'User forced Cloud inference'
    };
  }

  // Auto Hybrid Routing logic
  const textLength = jobText ? jobText.length : 0;
  if (textLength > customThreshold) {
    return {
      mode: InferenceMode.ONLY_IN_CLOUD,
      reason: `Job description (${textLength} chars) exceeds threshold (${customThreshold} chars); routed to Cloud Gemini 2.5 Flash for extended context.`
    };
  }

  return {
    mode: InferenceMode.PREFER_ON_DEVICE,
    reason: `Job description (${textLength} chars) is under threshold; routed to On-Device Gemini Nano for zero latency & privacy.`
  };
}

/**
 * Instantiate the GenerativeModel via Firebase AI Logic
 */
export function createHybridGenerativeModel(mode = InferenceMode.PREFER_ON_DEVICE) {
  return getGenerativeModel(ai, {
    mode: mode,
    inCloudParams: {
      model: 'gemini-2.5-flash',
      systemInstruction: SCRIPTWRITER_SYSTEM_INSTRUCTION
    },
    onDeviceParams: {
      createOptions: {
        systemPrompt: SCRIPTWRITER_SYSTEM_INSTRUCTION,
        expectedInputs: [{ type: 'text' }],
        expectedOutputs: [{ type: 'text' }]
      }
    }
  });
}

/**
 * Perform Hybrid Job Analysis with automatic fallback and latency tracking
 */
export async function analyzeScriptJob(jobText, writerProfile, options = {}) {
  const startTime = performance.now();
  const routing = resolveInferenceMode(jobText, options.mode, options.threshold);
  
  const prompt = `
Analyze this screenwriting job post against the writer's profile:

[WRITER PROFILE]
Name: ${writerProfile?.name || 'Screenwriter'}
Specialties: ${(writerProfile?.specialties || []).join(', ')}
Sample Projects: ${(writerProfile?.sampleLoglines || []).join(' | ')}
Accolades: ${writerProfile?.awards || 'Experienced narrative writer'}

[JOB POSTING]
${jobText}

Respond with valid JSON according to system instructions.
`;

  try {
    const model = createHybridGenerativeModel(routing.mode);
    const result = await model.generateContent(prompt);
    const endTime = performance.now();
    const latencyMs = Math.round(endTime - startTime);

    const rawResponseText = result.response.text();
    const source = result.response.inferenceSource || (
      routing.mode === InferenceMode.ONLY_IN_CLOUD ? InferenceSource.IN_CLOUD : InferenceSource.ON_DEVICE
    );

    const parsedData = parseAIResponse(rawResponseText);

    return {
      success: true,
      data: parsedData,
      source: source,
      mode: routing.mode,
      routingReason: routing.reason,
      latencyMs: latencyMs,
      rawOutput: rawResponseText
    };
  } catch (primaryError) {
    console.warn('[HybridCore] Primary execution failed, testing intelligent fallback:', primaryError);

    // If PREFER_ON_DEVICE failed (e.g. model not loaded or error), fall back cleanly to cloud
    if (routing.mode === InferenceMode.PREFER_ON_DEVICE) {
      try {
        const fallbackModel = createHybridGenerativeModel(InferenceMode.ONLY_IN_CLOUD);
        const fbResult = await fallbackModel.generateContent(prompt);
        const endTime = performance.now();

        return {
          success: true,
          data: parseAIResponse(fbResult.response.text()),
          source: InferenceSource.IN_CLOUD,
          mode: InferenceMode.ONLY_IN_CLOUD,
          routingReason: 'Automatic cloud fallback after on-device unavailable',
          latencyMs: Math.round(endTime - startTime),
          fallbackTriggered: true,
          rawOutput: fbResult.response.text()
        };
      } catch (cloudErr) {
        throw new Error(`Both on-device and cloud fallback failed: ${cloudErr.message}`);
      }
    }

    throw primaryError;
  }
}

/**
 * Streaming Hybrid Job Analysis
 */
export async function streamScriptAnalysis(jobText, writerProfile, options = {}, onChunk) {
  const startTime = performance.now();
  const routing = resolveInferenceMode(jobText, options.mode, options.threshold);

  const prompt = `
Analyze this screenwriting job post against the writer's profile:

[WRITER PROFILE]
Name: ${writerProfile?.name || 'Screenwriter'}
Specialties: ${(writerProfile?.specialties || []).join(', ')}
Sample Projects: ${(writerProfile?.sampleLoglines || []).join(' | ')}

[JOB POSTING]
${jobText}

Respond with valid JSON according to system instructions.
`;

  const model = createHybridGenerativeModel(routing.mode);
  const streamResult = await model.generateContentStream(prompt);

  let accumulatedText = '';
  for await (const chunk of streamResult.stream) {
    const chunkText = chunk.text();
    accumulatedText += chunkText;
    if (onChunk) {
      onChunk(chunkText, accumulatedText);
    }
  }

  const endTime = performance.now();
  const response = await streamResult.response;
  const source = response.inferenceSource || (
    routing.mode === InferenceMode.ONLY_IN_CLOUD ? InferenceSource.IN_CLOUD : InferenceSource.ON_DEVICE
  );

  return {
    success: true,
    data: parseAIResponse(accumulatedText),
    source: source,
    mode: routing.mode,
    routingReason: routing.reason,
    latencyMs: Math.round(endTime - startTime),
    rawOutput: accumulatedText
  };
}
