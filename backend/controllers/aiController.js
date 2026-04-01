import { InferenceClient } from '@huggingface/inference';
import {
  buildChatReviewPrompt,
  buildHighlightsAndCautions,
  buildReviewStats,
  composeFinalSummary,
  isUsableBartSummary,
  isUsableChatSummary,
  proseForSummarizationModel,
  SYSTEM_PROMPT_REVIEW_SUMMARY
} from '../utils/reviewSummaryText.js';

const getHfConfig = () => {
  const apiKey = String(process.env.HF_TOKEN || '').trim();
  if (!apiKey) return null;
  return {
    apiKey,
    chatModel:
      String(process.env.HF_CHAT_MODEL || 'Qwen/Qwen2.5-1.5B-Instruct').trim(),
    summarizerModel:
      String(process.env.HF_MODEL || 'facebook/bart-large-cnn').trim()
  };
};

const tryChatSummary = async (client, chatModel, artisanName, safe) => {
  const userContent = buildChatReviewPrompt(artisanName, safe);
  const out = await client.chatCompletion({
    model: chatModel,
    provider: 'auto',
    messages: [
      { role: 'system', content: SYSTEM_PROMPT_REVIEW_SUMMARY },
      { role: 'user', content: userContent }
    ],
    max_tokens: 220,
    temperature: 0.35
  });
  const text = String(out?.choices?.[0]?.message?.content || '').trim();
  return isUsableChatSummary(text) ? text : '';
};

const tryBartSummary = async (client, summarizerModel, name, safe) => {
  const inputText = proseForSummarizationModel(name, safe);
  const out = await client.summarization({
    model: summarizerModel,
    provider: 'hf-inference',
    inputs: inputText,
    parameters: {
      max_length: 160,
      min_length: 28
    }
  });
  const text = String(out?.summary_text || '').trim();
  return isUsableBartSummary(text) ? text : '';
};

export const summarizeArtistReviews = async (req, res) => {
  const { artisanName, reviews } = req.body || {};

  if (!artisanName || typeof artisanName !== 'string') {
    return res.status(400).json({ message: 'artisanName is required' });
  }
  if (!Array.isArray(reviews)) {
    return res.status(400).json({ message: 'reviews must be an array' });
  }

  const stats = buildReviewStats(reviews);
  if (!stats) {
    return res.json({
      artisanName,
      summary: 'Not enough review text to summarize yet.',
      highlights: [],
      cautions: [],
      ratingBreakdown: null
    });
  }

  const { safe, avg, dist } = stats;
  const name = String(artisanName).trim() || 'This artisan';
  const { highlights, cautions } = buildHighlightsAndCautions(avg, dist, safe);
  const breakdown = {
    avgRating: Number(avg.toFixed(2)),
    total: safe.length,
    distribution: dist
  };

  const hf = getHfConfig();
  if (!hf) {
    const summary = composeFinalSummary(safe, avg, '', name);
    return res.json({
      artisanName: name,
      summary,
      highlights,
      cautions,
      ratingBreakdown: breakdown
    });
  }

  const client = new InferenceClient(hf.apiKey);
  let modelText = '';
  let providerNote = '';

  try {
    modelText = await tryChatSummary(client, hf.chatModel, name, safe);
  } catch (errfirst) {
    const d =
      errfirst instanceof Error ? errfirst.message : JSON.stringify(errfirst);
    // eslint-disable-next-line no-console
    console.warn('HF chat summary failed:', d);
    providerNote = `Chat model could not run (${d}). `;
  }

  if (!modelText) {
    try {
      modelText = await tryBartSummary(client, hf.summarizerModel, name, safe);
      if (!modelText) {
        providerNote +=
          'Classic summarizer returned nothing usable; showing an overview from ratings only.';
      }
    } catch (err2) {
      const d =
        err2 instanceof Error ? err2.message : JSON.stringify(err2);
      // eslint-disable-next-line no-console
      console.warn('HF BART summarization failed:', d);
      providerNote += `Fallback summarizer failed (${d}). Showing an overview from ratings only.`;
    }
  }

  const summary = composeFinalSummary(safe, avg, modelText, name);
  const payload = {
    artisanName: name,
    summary,
    highlights,
    cautions,
    ratingBreakdown: breakdown
  };
  if (providerNote.trim()) {
    payload.providerNote = providerNote.trim();
  }
  return res.json(payload);
};
