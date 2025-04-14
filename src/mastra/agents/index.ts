import { openai } from "@ai-sdk/openai";
import { Agent } from "@mastra/core/agent";
import { SummarizationMetric } from "@mastra/evals/llm";
import {
  ContentSimilarityMetric,
  ToneConsistencyMetric,
} from "@mastra/evals/nlp";
import { PostgresStore, PgVector } from "@mastra/pg";
import { weatherTool } from "../tools";
import { Memory } from "@mastra/memory";

const model = openai("gpt-4o");

const memory = new Memory({
  storage: new PostgresStore({
    connectionString: process.env.NEXT_PUBLIC_DB!,
  }),
  vector: new PgVector(process.env.NEXT_PUBLIC_DB!),
  options: {
    lastMessages: 10,
    semanticRecall: {
      topK: 3,
      messageRange: 2,
    },
  },
});

export const weatherAgent = new Agent({
  name: "Weather Agent",
  instructions: `
      You are a helpful weather assistant that provides accurate weather information.

      Your primary function is to help users get weather details for specific locations. When responding:
      - Always ask for a location if none is provided
      - If the location name isn’t in English, please translate it
      - If giving a location with multiple parts (e.g. "New York, NY"), use the most relevant part (e.g. "New York")
      - Include relevant details like humidity, wind conditions, and precipitation
      - Keep responses concise but informative

      Use the weatherTool to fetch current weather data.
`,
  model: openai("gpt-4o"),
  tools: { weatherTool },
  evals: {
    summarization: new SummarizationMetric(model),
    contentSimilarity: new ContentSimilarityMetric(),
    tone: new ToneConsistencyMetric(),
  },
  memory,
});
