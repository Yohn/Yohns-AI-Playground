import 'dotenv/config';
import OpenAI from "openai";

const token = process.env.GITHUB_TOKEN;
const endpoint = "https://models.inference.ai.azure.com";
const modelName = "gpt-4o-mini";

export async function main() {

	const client = new OpenAI({ baseURL: endpoint, apiKey: token });

	const response = await client.chat.completions.create({
		messages: [
			{ role: "system", content: "You are a helpful assistant." },
			{ role: "user", content: "What is the capital of Alaska?" },
			{ role: "assistant", content: "The capital of Alaska is Juneau." },
			{ role: "user", content: "What about North Carolina?" },
			{ role: "assistant", content: "The capital of North Carolina is Raleigh." },
			{ role: "user", content: "Are you able to read the files in my directory here?"},
			],
			model: modelName
		});

	console.log(response.choices[0].message.content);
}

main().catch((err) => {
	console.error("The sample encountered an error:", err);
});