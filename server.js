import 'dotenv/config';
//import OpenAI from "openai";
import express from 'express';
import aiChat from './components/yo-ai.js';
//import MarkdownIt from 'markdown-it';

//import fs from 'fs';

const token = process.env.GITHUB_TOKEN;
const endpoint = "https://models.inference.ai.azure.com";
const modelName = "gpt-4o-mini";
						// "gpt-4o",


const app = express();
const port = 3000; // Choose your desired port number

// Serve static files from the 'www' directory
app.use(express.static('www'));
//? why is my /assets/svg/icon.svg throwing an error in the console?
//app.use(express.static('www', {
//	setHeaders: (res, path, stat) => {
//		if (path.endsWith('.svg')) {
//			res.setHeader('Content-Type', 'image/svg+xml');
//		}
//	}
//}));


app.set('view engine', 'ejs');
app.set('views', './views'); // Directory where your views/templates are stored

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Route to render a specific page
app.get('/', (req, res) => {
	res.render('index', { title: 'Page 1' });
});

// Handle POST requests to '/submit' from index.html form
app.post('/submit', async (req, res) => {
	const formData = req.body;

	// send previous chat messages to this...
	// How we gonna do this?
	// I'm thinking we can send it back and forth between front and back end but f that.. we need to that "edit-json-file" extension I already used before for this.. yay more work to be done haha
	let msgAry = [
	];

	const msg = [
			{ role: "system", content: "You are an advanced expert guru at all coding capabilities. While enforcing the use of tabs for indentation, you have a strong abbility to ensure the code you're writing is up to date with the newest versions of all languages, and using the newest features, and ensuring that the code you write is up to the standards for 2024 satisfaction. If you're unsure of any features, you will ask prior to writing the code." },
			{ role: "user", content: formData.chatMsg },
		];
	const aiRes = await aiChat(token, endpoint, modelName, msg);

	// Process formData as needed
	// Example: Echo back the form data
	//res.send(`Received: ${formData.textareaInput}`);
	// Process the data (example)


	// Create a new instance of markdown-it
	//const md = new MarkdownIt({ breaks: true });
	//// Render Markdown to HTML
	//const html = md.render(aiRes);
	const response = {
		aiResp: aiRes
	};
	// Send JSON response
	res.json(response);
});

// Start the server
app.listen(port, () => {
	console.log(`Server running at http://localhost:${port}`);
});
