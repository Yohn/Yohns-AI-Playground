//import 'dotenv/config';
import OpenAI from "openai";

//const token = process.env.GITHUB_TOKEN;
//const endpoint = "https://models.inference.ai.azure.com";
//const modelName = "gpt-4o-mini";

export async function aiChat(token, endpoint, modelName, chatMsg) {

	const client = new OpenAI({ baseURL: endpoint, apiKey: token });

	const response = await client.chat.completions.create({
		messages: chatMsg,
			//[
			//	{ role: "system", content: "You are a helpful assistant." },
			//	{ role: "user", content: "Give me 5 good reasons why I should exercise every day." },
			//],
			temperature: 1.0,
			top_p: 1.0,
			max_tokens: 1000,
			model: modelName
			//, stream: true
		});
		return response.choices[0].message.content
		// this was for the streammiing..
		// I'ma have to look into how this
		// `process.strout.write` works
		//for await (const part of stream) {
		//	process.stdout.write(part.choices[0]?.delta?.content || '');
		//}
		//process.stdout.write('\n');
}

export default aiChat;
//main().catch((err) => {
//	console.error("The sample encountered an error:", err);
//});