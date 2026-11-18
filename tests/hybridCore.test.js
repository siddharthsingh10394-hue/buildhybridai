import test from 'node:test';
import assert from 'node:assert/strict';
import { resolveInferenceMode } from '../src/ai/hybridCore.js';
import { parseAIResponse, JOB_PRESETS } from '../src/ai/prompts.js';
import { InferenceMode, InferenceSource } from 'firebase/ai';

test('Routing Logic: Auto-Hybrid selects On-Device for short prompts', () => {
  const shortText = 'Looking for a scriptwriter to write a short 5-minute thriller.';
  const routing = resolveInferenceMode(shortText, 'auto', 1200);

  assert.equal(routing.mode, InferenceMode.PREFER_ON_DEVICE);
  assert.match(routing.reason, /under threshold/i);
});

test('Routing Logic: Auto-Hybrid routes long text to Cloud Gemini 2.5 Flash', () => {
  const longText = 'A'.repeat(1500);
  const routing = resolveInferenceMode(longText, 'auto', 1200);

  assert.equal(routing.mode, InferenceMode.ONLY_IN_CLOUD);
  assert.match(routing.reason, /exceeds threshold/i);
});

test('Routing Logic: Force On-Device enforces ONLY_ON_DEVICE', () => {
  const routing = resolveInferenceMode('Some script gig', 'force-on-device', 1200);
  assert.equal(routing.mode, InferenceMode.ONLY_ON_DEVICE);
});

test('Routing Logic: Force Cloud enforces ONLY_IN_CLOUD', () => {
  const routing = resolveInferenceMode('Short text', 'force-cloud', 1200);
  assert.equal(routing.mode, InferenceMode.ONLY_IN_CLOUD);
});

test('Parser: Extracts valid JSON correctly', () => {
  const mockJson = JSON.stringify({
    matchScore: 92,
    scoreRationale: 'Strong alignment with genre',
    projectSpecs: { format: 'TV Pilot', genre: 'Sci-Fi' },
    keyRequirements: ['Pilot script', 'Bible outline'],
    executiveSummary: 'Arctic mystery series.',
    outreachPitch: 'Hello, I loved the premise.'
  });

  const parsed = parseAIResponse(mockJson);
  assert.equal(parsed.matchScore, 92);
  assert.equal(parsed.projectSpecs.format, 'TV Pilot');
  assert.equal(parsed.keyRequirements.length, 2);
});

test('Parser: Extracts JSON wrapped inside markdown code fences', () => {
  const wrapped = `Here is the evaluation:
\`\`\`json
{
  "matchScore": 85,
  "scoreRationale": "Solid match for indie feature",
  "projectSpecs": { "format": "Feature", "genre": "Horror" },
  "keyRequirements": ["Subtext", "Claustrophobic"],
  "executiveSummary": "Two sisters trapped in mansion.",
  "outreachPitch": "Excited to submit my sample."
}
\`\`\`
Hope this helps!`;

  const parsed = parseAIResponse(wrapped);
  assert.equal(parsed.matchScore, 85);
  assert.equal(parsed.projectSpecs.genre, 'Horror');
});

test('Parser: Graceful fallback when output is malformed prose', () => {
  const malformed = 'Unfortunately, I cannot format this in JSON. The job is an action comedy.';
  const parsed = parseAIResponse(malformed);

  assert.ok(typeof parsed.matchScore === 'number');
  assert.ok(parsed.projectSpecs);
  assert.ok(parsed.outreachPitch.length > 20);
});

test('Presets: Verified preset lengths align with hybrid routing targets', () => {
  const netflixPreset = JOB_PRESETS[0];
  const epicPreset = JOB_PRESETS[3];

  assert.ok(netflixPreset.text.length < 1200, 'Netflix preset should be < 1200 chars for local execution');
  assert.ok(epicPreset.text.length > 1200, 'Epic Bible preset should be > 1200 chars for cloud execution');
});
