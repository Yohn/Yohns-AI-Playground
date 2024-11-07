import 'dotenv/config';
//import OpenAI from "openai";
import express from 'express';
import { JsonDB, Config } from 'node-json-db';
import aiChat from './components/yo-ai.js';
//import fs from 'fs';
//let corePrompts = new JsonDB(new Config("data/core/prompts", true, false, '/'));
let DBprompts = new JsonDB(new Config("data/JDB/saved-prompts", true, false, '/'));
let DBchats = new JsonDB(new Config("data/JDB/chats", true, false, '/'));
let DBconfig = new JsonDB(new Config("data/JDB/config", true, false, '/'));
//- filename: string, //saveOnPush?: boolean, //prettyPrint?: boolean, //separator?: string, //syncOnSave?: boolean
//? Config(  ^^ options ^^ ) --------------------------- ^^ -------------------- ^^ ------------- ^^

const token = process.env.GITHUB_TOKEN;
const endpoint = "https://models.inference.ai.azure.com";
let modelName = "gpt-4o-mini";
						// "gpt-4o",
const app = express();
const port = 3000;

app.use(express.static('www'));

app.set('view engine', 'ejs');
app.set('views', './views');

app.use(express.urlencoded({ extended: true }));
app.use(express.json());


// Handle POST requests to '/submit' from index.html form
app.post('/submit', async (req, res) => {
	const formData = req.body;

	let msgAry = [];
	if(formData.hasOwnProperty('model') && formData.model != "") {
		modelName = formData.model
	}
	let prompt = "You are an advanced expert guru at all coding capabilities. While enforcing the use of tabs for indentation, you have a strong abbility to ensure the code you're writing is up to date with the newest versions of all languages, and using the newest features, and ensuring that the code you write is up to the standards for 2024 satisfaction. If you're unsure of any features, you will ask prior to writing the code."
	if(formData.hasOwnProperty('prompt') && formData.prompt != "") {
		prompt = formData.prompt
	}

	const msg = [
			{ role: "system", content: prompt },
			{ role: "user", content: formData.chatMsg },
		];
	const aiRes = await aiChat(token, endpoint, modelName, msg);

	const response = {
		aiResp: aiRes
	};
	// Send JSON response
	res.json(response);
});
// Route to render a specific page
app.get('/get', (req, res) => {
	res.render('index', { title: 'Page 1' });
});


// Route to render a specific page
app.get('/', (req, res) => {
	res.render('index', { title: 'Page 1' });
});

// Start the server
app.listen(port, () => {
	console.log(`Server running at http://localhost:${port}`);
});
