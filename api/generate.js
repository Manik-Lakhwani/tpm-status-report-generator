export default async function handler(req, res) {
  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') { res.status(200).end(); return; }
  if (req.method !== 'POST') { res.status(405).json({ error: 'Method not allowed' }); return; }

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    res.status(500).json({
      error: 'GEMINI_API_KEY is not configured on the server.'
    });
    return;
  }

  try {
    const { prompt, messages, model: requestedModel, max_tokens } = req.body || {};
    const model = requestedModel || process.env.GEMINI_MODEL || 'gemini-3.5-flash-lite';

    const contents = Array.isArray(messages) && messages.length
      ? messages.map((message) => {
          const text = typeof message.content === 'string'
            ? message.content
            : Array.isArray(message.content)
              ? message.content.map((part) => typeof part === 'string' ? part : (part.text ?? '')).join('\n')
              : '';

          return {
            role: message.role === 'assistant' ? 'model' : 'user',
            parts: [{ text }]
          };
        })
      : [{
          role: 'user',
          parts: [{
            text: typeof prompt === 'string' ? prompt : JSON.stringify(req.body || {})
          }]
        }];

    const upstream = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(model)}:generateContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents,
          generationConfig: {
            temperature: 0.4,
            maxOutputTokens: max_tokens || 1000
          }
        })
      }
    );

    const data = await upstream.json();

    if (!upstream.ok) {
      res.status(upstream.status).json({
        error: data?.error?.message || 'Gemini request failed.'
      });
      return;
    }

    const text = data.candidates?.[0]?.content?.parts
      ?.map((part) => part.text)
      .filter(Boolean)
      .join('\n') || '';

    res.status(200).json({
      content: [{ type: 'text', text }],
      model
    });
  } catch (err) {
    res.status(500).json({ error: err?.message || 'Unknown server error' });
  }
}
