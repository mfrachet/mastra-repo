import { Mastra } from "@mastra/core/mastra";
import { createLogger } from "@mastra/core/logger";
import { weatherWorkflow } from "./workflows";
import { weatherAgent } from "./agents";

import { MastraCloudExporter } from "@mastra/cloud";

// Initialize the exporter with your access token
const exporter = new MastraCloudExporter({
  accessToken: process.env.MASTRA_CLOUD_ACCESS_TOKEN, // Your Mastra Cloud access token
  endpoint: "https://mastra-cloud-endpoint.example.com", // Mastra cloud endpoint
});

export const mastra = new Mastra({
  workflows: { weatherWorkflow },
  agents: { weatherAgent },
  logger: createLogger({
    name: "Mastra",
    level: "info",
  }),
  telemetry: {
    serviceName: "My-Agent",
    enabled: true,
    sampling: {
      type: "always_on",
    },
    export: {
      type: "custom",
      exporter,
    },
  },
});
