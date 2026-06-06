import { createOpenRouter } from '@openrouter/ai-sdk-provider';
import dotenv from 'dotenv';


export function getAgentModel(){
dotenv.config();
const openrouter = createOpenRouter({

  apiKey: process.env.OPENROUTER_API_KEY,
});

const model = process.env.OPENROUTER_DEFAULT_MODEL!;

return openrouter.chat(model);
}