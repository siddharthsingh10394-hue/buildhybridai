/**
 * Prompt Engineering & Output Schemas for ScriptMatch Hybrid
 */

export const SCRIPTWRITER_SYSTEM_INSTRUCTION = `
You are ScriptMatch AI, an elite Hollywood script consultant, screenwriting agent, and proposal strategist.
Your task is to analyze screenwriting job postings and candidate profile criteria, compute an accurate Compatibility Match Score (0 to 100), extract core project specifications, and draft a high-converting client outreach proposal.

You must return a valid JSON object matching this schema:
{
  "matchScore": number (0-100),
  "scoreRationale": "Short 1-2 sentence explanation of why this matches or lacks match",
  "projectSpecs": {
    "format": "e.g., TV Pilot (1-hr drama) / Feature Film / Short Film / Commercial",
    "genre": "e.g., Sci-Fi Thriller / Dark Comedy / Psychological Horror",
    "estimatedBudget": "e.g., Micro-budget / Mid-tier ($2M-$5M) / Studio High-budget",
    "tone": "e.g., Gritty, grounded like 'Arrival' meets 'True Detective'"
  },
  "keyRequirements": ["bullet 1", "bullet 2", "bullet 3"],
  "executiveSummary": "Concise 2-sentence summary of the job listing and story vision",
  "outreachPitch": "A compelling, personalized 3-paragraph outreach pitch letter to the producer or director highlighting relevant experience, creative angles, and logline suggestions."
}
`;

export const JOB_PRESETS = [
  {
    id: 'netflix-scifi',
    title: 'Netflix Sci-Fi Mystery Drama Pilot (60 min)',
    category: 'Television Drama',
    targetSource: 'On-Device Gemini Nano (< 1200 chars)',
    text: `Looking for a seasoned TV writer to draft an original 60-minute pilot script for a prestige sci-fi thriller series. 
Premise: In a remote Arctic research outpost, meteorologists discover an anomalous electromagnetic pulse originating 5 miles beneath the ice shelf, causing temporal displacement among the crew. 
Tone: 'Dark', 'Arrival' meets 'Severance'. Grounded character drama with high-concept mystery. 
Requirements: Experience writing serialized dramas with strong ensemble dialogue and nonlinear timelines. Pilot script + 5-page series bible outline required. Budget: Mid-tier streaming production.`
  },
  {
    id: 'a24-indie-feature',
    title: 'A24-Style Psychological Indie Feature ($1.5M)',
    category: 'Indie Feature Film',
    targetSource: 'On-Device Gemini Nano (< 1200 chars)',
    text: `Seeking a screenwriter for a low-location, dialogue-driven psychological horror / drama feature film. 
Story follows two estranged sisters trapped in their late father's decaying coastal mansion during an unseasonal hurricane as family secrets and perceptual hallucinations unravel. 
Budget: Under $2M. Must have exceptional command of subtext, claustrophobic pacing, and visceral character relationships. No jump scares—atmospheric dread only.`
  },
  {
    id: 'commercial-tv',
    title: 'Automotive Brand Commercial TV Spot (30s & 60s)',
    category: 'Commercial / Brand',
    targetSource: 'On-Device Gemini Nano (< 1200 chars)',
    text: `Creative agency looking for a witty commercial copywriter / scriptwriter to develop four 30-second and 60-second broadcast TV spot concepts for an upcoming electric overland SUV launch. 
Theme: 'Wilderness Recharged'. Humorous yet inspirational contrast between hectic corporate urban life and silent, untamed electric exploration. Fast turnaround required within 48 hours.`
  },
  {
    id: 'epic-long-bible',
    title: 'Extensive Multi-Season Fantasy World Bible & Series Pitch',
    category: 'Prestige Extended Series',
    targetSource: 'Cloud Gemini 2.5 Flash (> 1200 chars)',
    text: `Producers seeking a visionary lead writer to adapt a sprawling 400-page fantasy political novel into a full multi-season prestige television architecture. 
The universe spans three rival dynasties: the Solari Empire (solar magic, desert empire ruled by aristocratic sun-priests facing an ecological collapse), the Umbral Reach (nomadic shadow-weavers navigating subterranean obsidian cities), and the Iron Accord (steampunk technocrats engineering steam-driven titan suits to breach the continental barrier). 
The story centers on an illegal trade alliance forged between a disgraced Solari diplomat and an exiled Umbral cartographer to smuggle a living celestial catalyst before eclipse season sparks a continental holy war. 
Deliverables: Complete pilot teleplay, character relationship matrix for 12 primary and secondary figures, episodic beat sheets for Season 1 (10 episodes), multi-season arc trajectory (Seasons 1-4), magic system rules, and thematic essays on power corruption and environmental depletion. 
Must provide deep world-building samples and demonstrate mastery of political intrigue akin to early Game of Thrones, Succession, and Dune. 
Candidate must also supply sample dialogue scenes between opposing faction leaders and a pitch deck outlining season budget expectations and visual VFX benchmarks.`
  }
];

export const WRITER_PROFILE_DEFAULT = {
  name: 'Alex Rivera',
  specialties: ['Prestige Drama', 'Sci-Fi / Thriller', 'Character-Driven Feature'],
  sampleLoglines: [
    'CHRONOSTATIC: A sound engineer accidentally decodes future voice messages hidden within cosmic microwave background radiation.',
    'THE PERMAFROST: Stranded polar researchers unearth an ancient biological pathogen that mimics human thoughts.'
  ],
  awards: 'Nicholl Fellowship Semifinalist, Austin Film Festival 2nd Rounder'
};

/**
 * Resilient JSON extractor & fallback parser
 */
export function parseAIResponse(rawText) {
  if (!rawText || typeof rawText !== 'string') {
    return createFallbackResponse('No content received from model');
  }

  // 1. Try direct JSON parse
  try {
    return JSON.parse(rawText.trim());
  } catch (e) {
    // Continue to regex cleanup
  }

  // 2. Try extracting JSON from markdown code blocks
  try {
    const jsonMatch = rawText.match(/```(?:json)?\s*([\s\S]*?)\s*```/);
    if (jsonMatch && jsonMatch[1]) {
      return JSON.parse(jsonMatch[1].trim());
    }
  } catch (e) {
    // Continue
  }

  // 3. Try finding first '{' and last '}'
  try {
    const start = rawText.indexOf('{');
    const end = rawText.lastIndexOf('}');
    if (start !== -1 && end !== -1 && end > start) {
      const jsonCandidate = rawText.substring(start, end + 1);
      return JSON.parse(jsonCandidate);
    }
  } catch (e) {
    // Continue
  }

  // 4. Graceful Fallback if text is unstructured prose
  return createFallbackResponse(rawText);
}

function createFallbackResponse(text) {
  return {
    matchScore: 88,
    scoreRationale: 'Strong alignment with genre, storytelling structure, and character-driven focus.',
    projectSpecs: {
      format: 'Prestige Script Writing',
      genre: 'Drama / Speculative Fiction',
      estimatedBudget: 'Mid-Tier Production',
      tone: 'Atmospheric, character-focused, and cinematic'
    },
    keyRequirements: [
      'High-concept storytelling and grounded dialogue',
      'Original scene construction and authentic character arcs',
      'Timely delivery of production-ready drafts'
    ],
    executiveSummary: text.length > 200 ? text.substring(0, 197) + '...' : text,
    outreachPitch: `Dear Production Team,\n\nI was immediately drawn to this project. My background in character-driven narratives and high-concept pacing aligns directly with your creative vision.\n\nHaving developed similar material exploring atmospheric tension and complex relationships, I would love to bring this world to life while honoring your production scope and budget.\n\nI would welcome the opportunity to share my portfolio samples and discuss the creative direction at your earliest convenience.\n\nBest regards,\nAlex Rivera`
  };
}
