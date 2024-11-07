function flatten(obj) {
	let result = "";

	function traverse(obj) {
		if (Array.isArray(obj)) {
			obj.forEach(item => traverse(item));
		} else if (typeof obj === "object") {
			for (let key in obj) {
				traverse(obj[key]);
			}
		} else {
			result += obj + ",";
		}
	}

	traverse(obj);
	return result.slice(0, -1); // Remove the last comma
}

function createMsg(from, msg){
	// me-639dd4.svg
	const container = document.createElement('div'),
		pic = document.createElement('div'),
		meta = document.createElement('div'),
		msgbox = document.createElement('div'),
		now = new Date(),
		currentDateTime = now.toLocaleString();

	container.classList.add('d-flex')
	pic.classList.add('flex-shrink-0','text-center');
	meta.classList.add('text-secondary', 'border-top', 'border-secondary', 'text-right', 'fs-6');
	meta.innerHTML = currentDateTime;
	if(from === 'ai'){
		msgbox.classList.add('shadow', 'flex-grow-1','ms-3','border','rounded','p-2','mb-2','ai-chat','bg-body-tertiary');
		pic.classList.add('order-0')
		pic.innerHTML = `<img src="/assets/svg/ai-6e9dd4.svg" alt="ai" style="max-width:75px; height:auto;">`
	} else {
		msgbox.classList.add('shadow', 'flex-grow-1','me-3','border','rounded','p-2','mb-2','user-chat','bg-secondary-subtle');
		pic.classList.add('order-1')
		pic.innerHTML = `<img src="/assets/svg/me-639dd4.svg" alt="ai" style="max-width:75px; height:auto;">`
	}
	msgbox.innerHTML = msg;
	msgbox.append(meta);
	container.append(pic)
	container.append(msgbox);
	return container;
}
async function loadSelects(promptSelect, modelSelect){
	let selects = []

	selects['prompt'] = await loadPrompts(promptSelect);
	selects['model'] = await loadModels(modelSelect);

	return selects
}
let loadedPrompts = {
	"Advanced Coding Guru": "You are an advanced expert guru at all coding capabilities. While enforcing the use of tabs for indentation, you have a strong abbility to ensure the code you're writing is up to date with the newest versions of all languages, and using the newest features, and ensuring that the code you write is up to the standards for 2024 satisfaction. If you're unsure of any features, you will ask prior to writing the code."
}
async function loadPrompts(selectPrompt){
	const response = await fetch('assets/data/prompts.json')
	const data = await response.json()
	console.log('prompts')
	console.log(data)
  Object.entries(await data).forEach(([key, value]) => {
    const option = document.createElement('option');
    option.value = key;
    option.text = key;
    selectPrompt.appendChild(option);
		loadedPrompts[key] = value;
  })
	dselect(selectPrompt)
	return selectPrompt
}

let loadedModels = {}
async function loadModels(selectModel){
	const response = await fetch('assets/data/models.json')
	const data = await response.json()
	Object.entries(data).forEach(([key, value]) => {
    const option = document.createElement('option');
    option.value = key;
    option.text = value.name
		option.setAttribute('data-dselect-img', value.img);
    selectModel.appendChild(option);
		loadedModels[key] = value;
  })
	dselect(selectModel)
	return selectModel
}

//Object.keys(data).forEach(key => {
//  console.log(data[key].name);
//});

document.addEventListener("DOMContentLoaded", function () {
	const chatForm = document.getElementById("chat-form"),
		textarea = document.getElementById("chatMsg"),
		resp = document.getElementById("resp"),
		chatBox = document.getElementById("chat-box"),
		loading = document.getElementById("loading-icon"),
		promptSelect = document.getElementById('prompt-preset-select'), // Select prompt
		systemPrompt = document.getElementById('systemPrompt'), // Select prompt
		modelSelect = document.getElementById('model-preset-select'),
		modelLabel = document.getElementById('type-model');

	let sidePanel = document.getElementById('sidePanel'),
		settingsBtn = document.getElementById('settings-btn'),
		toDoList = document.getElementById('to-do-list'),
		toDoBtn = document.getElementById('to-do-btn'),
		mainChat = document.getElementById('main-chat');

	chatForm.addEventListener("submit", async (e) => {
		e.preventDefault();
		let chatMsg = textarea.value;
		loading.classList.remove('d-none')

		const userChat = marked.parse(chatMsg);
		const userDiv = createMsg('user', userChat);
		//const userDiv = document.createElement('div');
		//userDiv.classList.add('border','rounded','p-2','mb-2','user-chat','bg-secondary-subtle');
		//userDiv.innerHTML = userChat;
		chatBox.insertBefore(userDiv, resp);

		const formData = new FormData();
		formData.append('model', modelSelect.value);
		formData.append('prompt', systemPrompt.value);
		const plainObject = Object.fromEntries(formData);
		try {
			// Send POST request to server
			const response = await fetch('/submit', {
				method: 'POST',
				headers: {
						'Content-Type': 'application/json'
				},
				body: JSON.stringify(plainObject)
			});
			if (!response.ok) {
				throw new Error('Network response was not ok.');
			}
			// Clear textarea
			textarea.value = "";
			const tevent = new Event('input', { bubbles: true });
			textarea.dispatchEvent(tevent);

			// Handle response
			const result = await response.json(); // Assuming server responds with JSON
			console.log(JSON.stringify(result));
			// Render Markdown to HTML using marked.js
			const atChat = marked.parse(result.aiResp);
			const aiDiv = createMsg('ai', atChat);
			chatBox.insertBefore(aiDiv, resp);

			// Highlight each code block inside the container
			chatBox.querySelectorAll('pre code').forEach((block) => {
				hljs.highlightElement(block);
			});

			loading.classList.add('d-none')
		} catch (error) {
			console.error('Error:', error);
		}
	});
	// ok
	loadSelects(promptSelect, modelSelect)
	//const selectPrompt = document.getElementById('prompt-preset-select'); // Select prompt
	promptSelect.addEventListener('change', async (e) => {
		systemPrompt.value = loadedPrompts[e.target.value];
	})
	modelSelect.addEventListener('change', async (e) => {
		modelLabel.innerHTML = `<img src="${loadedModels[key].img}" alt="Model">`
	})
	//const chatMessages = document.querySelector(".chat-messages");
	// chat messages
	textarea.addEventListener("input", function () {
		// Reset the height to auto to calculate the new height correctly
		this.style.height = 'auto';
		// Set the new height based on content
		const newHeight = Math.min(this.scrollHeight, window.innerHeight * 0.4);
		this.style.height = newHeight + 'px';
	});

	const tooltipTriggerList = Array.from(document.querySelectorAll('[data-bs-toggle="tooltip"]'))
	tooltipTriggerList.forEach(tooltipTriggerEl => {
		new bootstrap.Tooltip(tooltipTriggerEl)
	})
	//!-------------------------------------------------------------------!
	//!
	//!
	//!
	//!-------------------------------------------------------------------!
	function mainCol(direction){
		let curCol = parseInt(mainChat.getAttribute('data-yo-col'))
		let newCol = direction == 'up' ? curCol+3 : curCol-3;
		mainChat.classList.remove('col-'+curCol);
		mainChat.classList.add('col-'+newCol);
		mainChat.setAttribute('data-yo-col', newCol);
	}

	sidePanel.addEventListener('show.bs.collapse', event => {
		settingsBtn.classList.toggle('btn-primary');
		settingsBtn.classList.toggle('btn-outline-primary');
		sidePanel.classList.toggle('font-zero');
		mainCol('down');
	})
	sidePanel.addEventListener('hide.bs.collapse', event => {
		settingsBtn.classList.toggle('btn-primary');
		settingsBtn.classList.toggle('btn-outline-primary');
		sidePanel.classList.toggle('font-zero');
		mainCol('up');
	})
	toDoList.addEventListener('show.bs.collapse', event => {
		toDoBtn.classList.toggle('btn-primary');
		toDoBtn.classList.toggle('btn-outline-primary');
		toDoBtn.classList.toggle('font-zero');
		mainCol('down');
	}) // Why cant we chain these?
	toDoList.addEventListener('hide.bs.collapse', event => {
		toDoBtn.classList.toggle('btn-primary');
		toDoBtn.classList.toggle('btn-outline-primary');
		toDoBtn.classList.toggle('font-zero');
		mainCol('up');
	})
	//!
	//!------------------------------------------------------------------------!
	//!
	//!
	//!
	//!------------------------------------------------------------------------!
	//!
	// The theme tab within settings.. just changing the background, not sure how it'll look here though haha
	document.getElementById("bgColor").addEventListener("input", function () {
		document.body.style.backgroundColor = this.value;
	});

	let gsColor = document.getElementById("gradientStart");
	let geColor = document.getElementById("gradientEnd");
	let opacityInput = document.getElementById("gradientOpacity");

	gsColor.addEventListener("input", updateGradient);
	geColor.addEventListener("input", updateGradient);
	opacityInput.addEventListener("input", updateGradient);

	function updateGradient() {
		const startColor = gsColor.value;
		const endColor = geColor.value;
		const opacity = opacityInput.value;
		document.body.style.backgroundImage = `linear-gradient(to right, ${hexToRgba(
			startColor,
			opacity
		)}, ${hexToRgba(endColor, opacity)})`;
	}

	function hexToRgba(hex, opacity) {
		let r = parseInt(hex.slice(1, 3), 16);
		let g = parseInt(hex.slice(3, 5), 16);
		let b = parseInt(hex.slice(5, 7), 16);
		return `rgba(${r}, ${g}, ${b}, ${opacity})`;
	}
	//const wave = new TextWave('waving-text', 3);
	//wave.start();
});
