const axios = require('axios')

function buildPrompt(profile) {
  return `Career counselor task. Return ONLY valid JSON, no other text.

User: ${profile.currentRole}, ${profile.yearsOfExperience}yr exp, ${profile.academicBackground || 'not specified'} background, in ${profile.location || 'India'}
Skills: ${profile.skills.join(', ') || 'none listed'}
Interests: ${profile.interests.join(', ') || 'none listed'}
Target: ${profile.targetCareerInterest}
Learning hours/week: ${profile.hoursPerWeekAvailable}

Return JSON with exactly 3 suggestions. Keep ALL string values SHORT (under 100 words each). Valid JSON only:

{"suggestions":[{"rank":1,"roleName":"string","matchPercentage":80,"reasoning":"string under 60 words","missingSkills":[{"skillName":"string","estimatedWeeksToLearn":3,"priority":"high"}],"timeToReadyWeeks":8,"proofOfPivotStatement":"string under 60 words","highlevelRoadmap":[{"phase":1,"weeks":"Week 1-2","focus":"string","hoursPerWeek":8,"resources":["string","string"]},{"phase":2,"weeks":"Week 3-4","focus":"string","hoursPerWeek":8,"resources":["string"]},{"phase":3,"weeks":"Week 5-6","focus":"string","hoursPerWeek":8,"resources":["string"]},{"phase":4,"weeks":"Week 7-8","focus":"Interview Prep","hoursPerWeek":10,"resources":["Mock interviews","LinkedIn"]}]},{"rank":2,"roleName":"string","matchPercentage":70,"reasoning":"string under 60 words","missingSkills":[{"skillName":"string","estimatedWeeksToLearn":3,"priority":"medium"}],"timeToReadyWeeks":10,"proofOfPivotStatement":"string under 60 words","highlevelRoadmap":[{"phase":1,"weeks":"Week 1-2","focus":"string","hoursPerWeek":8,"resources":["string"]},{"phase":2,"weeks":"Week 3-4","focus":"string","hoursPerWeek":8,"resources":["string"]},{"phase":3,"weeks":"Week 5-6","focus":"string","hoursPerWeek":8,"resources":["string"]},{"phase":4,"weeks":"Week 7-8","focus":"Interview Prep","hoursPerWeek":10,"resources":["Mock interviews"]}]},{"rank":3,"roleName":"string","matchPercentage":60,"reasoning":"string under 60 words","missingSkills":[{"skillName":"string","estimatedWeeksToLearn":4,"priority":"low"}],"timeToReadyWeeks":12,"proofOfPivotStatement":"string under 60 words","highlevelRoadmap":[{"phase":1,"weeks":"Week 1-2","focus":"string","hoursPerWeek":8,"resources":["string"]},{"phase":2,"weeks":"Week 3-4","focus":"string","hoursPerWeek":8,"resources":["string"]},{"phase":3,"weeks":"Week 5-6","focus":"string","hoursPerWeek":8,"resources":["string"]},{"phase":4,"weeks":"Week 7-8","focus":"Interview Prep","hoursPerWeek":10,"resources":["Mock interviews"]}]}]}`
}

function extractJSON(raw) {
  if (!raw || raw.trim().length === 0) throw new Error('Empty response from AI model')

  let text = raw.trim()

  // Strip <think>...</think> reasoning blocks
  text = text.replace(/<think>[\s\S]*?<\/think>/gi, '').trim()

  // Strip markdown fences
  text = text.replace(/```json/gi, '').replace(/```/g, '').trim()

  // Find outermost { }
  const start = text.indexOf('{')
  const end = text.lastIndexOf('}')
  if (start === -1 || end === -1 || end <= start) {
    throw new Error('No JSON object found in AI response')
  }

  const jsonStr = text.substring(start, end + 1)

  let parsed
  try {
    parsed = JSON.parse(jsonStr)
  } catch (e) {
    console.error('[OpenRouter] JSON parse error:', e.message)
    console.error('[OpenRouter] Failed JSON (first 600 chars):\n', jsonStr.substring(0, 600))
    throw new Error('JSON parse failed — model truncated response. Try again.')
  }

  if (!Array.isArray(parsed?.suggestions) || parsed.suggestions.length === 0) {
    throw new Error('AI returned wrong structure')
  }

  return parsed.suggestions
}

async function getCareerSuggestions(profile) {
  const apiKey = process.env.OPENROUTER_API_KEY
  if (!apiKey) throw new Error('OPENROUTER_API_KEY not set in backend/.env')

  const cleanKey = apiKey.trim()
  console.log('[OpenRouter] For:', profile.currentRole, '→', profile.targetCareerInterest)
  console.log('[OpenRouter] Key prefix:', cleanKey.substring(0, 12), 'length:', cleanKey.length)

  if (!cleanKey.startsWith('sk-or-')) {
    throw new Error(`API key wrong format. Expected sk-or-v1-... got: "${cleanKey.substring(0, 10)}"`)
  }

  const MODELS = [
    'google/gemma-4-31b-it:free',
    'nvidia/nemotron-3-super-120b-a12b:free',
    'nvidia/nemotron-3-ultra-550b-a55b:free',
    'openai/gpt-oss-20b:free',
    'openrouter/free',
  ]

  const prompt = buildPrompt(profile)

  for (const model of MODELS) {
    console.log('[OpenRouter] Trying:', model)
    try {
      const response = await axios.post(
        'https://openrouter.ai/api/v1/chat/completions',
        {
          model,
          messages: [
            {
              role: 'system',
              content: 'You are a JSON API. Output only valid JSON. No markdown. No explanation. No text outside the JSON object.'
            },
            { role: 'user', content: prompt }
          ],
          max_tokens: 4000,
          temperature: 0.3,
        },
        {
          headers: {
            'Authorization': `Bearer ${cleanKey}`,
            'Content-Type': 'application/json',
            'HTTP-Referer': 'http://localhost:5173',
            'X-Title': 'CareerPivot',
          },
          timeout: 90000,
        }
      )

      // Log finish reason — tells us if it got cut off
      const choice = response.data?.choices?.[0]
      const finishReason = choice?.finish_reason
      const raw = choice?.message?.content
      console.log('[OpenRouter] finish_reason:', finishReason, '| content length:', raw?.length)

      if (finishReason === 'length') {
        console.warn('[OpenRouter] Response cut off (finish_reason=length) — trying next model')
        continue
      }

      const suggestions = extractJSON(raw)
      console.log('[OpenRouter] ✅ Success —', suggestions.length, 'suggestions from', model)
      return suggestions

    } catch (err) {
      if (err.response) {
        const status = err.response.status
        const msg = err.response.data?.error?.message || 'Unknown'
        console.error(`[OpenRouter] ${model} HTTP ${status}: ${msg}`)
        if (status === 401) throw new Error('OpenRouter key invalid. Get a new one at openrouter.ai/keys')
        continue // 404, 429, 500 — try next model
      }
      if (err.code === 'ECONNABORTED') {
        console.error('[OpenRouter] Timeout on', model)
        continue
      }
      // Parse errors — try next model
      console.error('[OpenRouter] Error on', model, ':', err.message)
      continue
    }
  }

  throw new Error('All AI models failed. Please try again in a minute.')
}

module.exports = { getCareerSuggestions }