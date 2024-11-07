import 'dotenv/config';
//import OpenAI from "openai";
import express from 'express';
import { JsonDB, Config } from 'node-json-db';
//import fs from 'fs';
// @param {string} path - path to the jsondb file,
// @param {boolean} save after each push
// @param {boolean} pretty print or not..
// @param {string} separator ? not sure what thats for..
let notes = new JsonDB(new Config("data/JDB/GitHubModels.json",  true, true, '/'));
					// key				data to save									false = add to ary, true = replaces ary
notes.push("/", {
	"gpt-4o" : {
		"name": "OpenAI GPT-4o",
		"model": "gpt-4o",
		"temperature": 1,
		"max_tokens": 4096,
		"top_p": 1,
		"endpoint":"https://models.inference.ai.azure.com",
		"image": "https://github.com/images/modules/marketplace/models/families/openai.svg?size=40"
	},
	"gpt-4o-mini": {
		"name": "OpenAI GPT-4o mini",
		"model": "gpt-4o-mini",
		"temperature": 1,
		"max_tokens": 4096,
		"top_p": 1,
		"endpoint":"https://models.inference.ai.azure.com",
		"image": "https://github.com/images/modules/marketplace/models/families/openai.svg?size=40"
	},
	"Phi-3.5-MoE-instruct" : {
		"model": "Phi-3.5-MoE-instruct",
		"temperature": 0.8,
		"max_tokens": 2048,
		"top_p": 0.1,
		"name": "Phi-3.5-MoE instruct (128k)",
		"image": "https://github.com/images/modules/marketplace/models/families/microsoft.svg?size=40"
	},
	"Phi-3.5-mini-instruct": {
		"model": "Phi-3.5-mini-instruct",
		"temperature": 0.8,
		"max_tokens": 2048,
		"top_p": 0.1,
		"name": "Phi-3.5-mini instruct (128k)",
		"endpoint":"https://models.inference.ai.azure.com",
		"image": "https://github.com/images/modules/marketplace/models/families/microsoft.svg?size=40"
	},
	"Phi-3.5-vision-instruct": {
		"model": "Phi-3.5-vision-instruct",
		"temperature": 0.8,
		"max_tokens": 2048,
		"top_p": 0.1,
		"name": "Phi-3.5-vision instruct (128k)",
		"endpoint":"https://models.inference.ai.azure.com",
		"image": "https://github.com/images/modules/marketplace/models/families/microsoft.svg?size=40"
	},
//	{
//			"name": "Phi-3-medium instruct (128k)",
//			"image": "https://github.com/images/modules/marketplace/models/families/microsoft.svg?size=40"
//	},
//	{
//			"name": "Phi-3-medium instruct (4k)",
//			"image": "https://github.com/images/modules/marketplace/models/families/microsoft.svg?size=40"
//	},
//	{
//			"name": "Phi-3-mini instruct (128k)",
//			"image": "https://github.com/images/modules/marketplace/models/families/microsoft.svg?size=40"
//	},
//	{
//			"name": "Phi-3-mini instruct (4k)",
//			"image": "https://github.com/images/modules/marketplace/models/families/microsoft.svg?size=40"
//	},
//	{
//			"name": "Phi-3-small instruct (128k)",
//			"image": "https://github.com/images/modules/marketplace/models/families/microsoft.svg?size=40"
//	},
	"Phi-3-small-8k-instruct": {
		"model": "Phi-3-small-8k-instruct",
		"name": "Phi-3-small instruct (8k)",
		"temperature": 0.8,
		"max_tokens": 2048,
		"top_p": 0.1,
		"endpoint":"https://models.inference.ai.azure.com",
		"image": "https://github.com/images/modules/marketplace/models/families/microsoft.svg?size=40"
	},
	"AI21-Jamba-1.5-Large": {
		"model": "AI21-Jamba-1.5-Large",
		"temperature": 0.8,
		"max_tokens": 2048,
		"top_p": 0.1,
		"name": "AI21 Jamba 1.5 Large",
		"endpoint":"https://models.inference.ai.azure.com",
		"image": "https://github.com/images/modules/marketplace/models/families/ai21%20labs.svg?size=40"
	},
//	{
//			"name": "AI21 Jamba 1.5 Mini",
//			"image": "https://github.com/images/modules/marketplace/models/families/ai21%20labs.svg?size=40"
//	},
//	{
//			"name": "Cohere Command R",
//			"image": "https://github.com/images/modules/marketplace/models/families/cohere.svg?size=40"
//	},
//	{
//			"name": "Cohere Command R 08-2024",
//			"image": "https://github.com/images/modules/marketplace/models/families/cohere.svg?size=40"
//	},
//	{
//			"name": "Cohere Command R+",
//			"image": "https://github.com/images/modules/marketplace/models/families/cohere.svg?size=40"
//	},
//	{
//			"name": "Cohere Command R+ 08-2024",
//			"image": "https://github.com/images/modules/marketplace/models/families/cohere.svg?size=40"
//	},
	"Llama-3.2-11B-Vision-Instruct": {
		"model": "Llama-3.2-11B-Vision-Instruct",
		"temperature": 0.8,
		"max_tokens": 2048,
		"top_p": 0.1,
		"name": "Llama-3.2-11B-Vision-Instruct",
		"endpoint":"https://models.inference.ai.azure.com",
		"image": "https://github.com/images/modules/marketplace/models/families/meta.svg?size=40"
	},
	"Llama-3.2-90B-Vision-Instruct": {
		"model": "Llama-3.2-90B-Vision-Instruct",
    "temperature": 0.8,
    "max_tokens": 2048,
    "top_p": 0.1,
		"name": "Llama-3.2-90B-Vision-Instruct",
		"endpoint":"https://models.inference.ai.azure.com",
		"image": "https://github.com/images/modules/marketplace/models/families/meta.svg?size=40"
	},
	"Meta-Llama-3.1-405B-Instruct": {
		"model": "Meta-Llama-3.1-405B-Instruct",
		"temperature": 0.8,
		"max_tokens": 2048,
		"top_p": 0.1,
		"name": "Meta-Llama-3.1-405B-Instruct",
		"endpoint":"https://models.inference.ai.azure.com",
		"image": "https://github.com/images/modules/marketplace/models/families/meta.svg?size=40"
	},
	"Meta-Llama-3.1-70B-Instruct": {
		"model": "Meta-Llama-3.1-70B-Instruct",
		"temperature": 0.8,
		"max_tokens": 2048,
		"top_p": 0.1,
		"name": "Meta-Llama-3.1-70B-Instruct",
		"endpoint":"https://models.inference.ai.azure.com",
		"image": "https://github.com/images/modules/marketplace/models/families/meta.svg?size=40"
	},
	"Meta-Llama-3.1-8B-Instruct": {
		"model": "Meta-Llama-3.1-8B-Instruct",
		"temperature": 0.8,
		"max_tokens": 2048,
		"top_p": 0.1,
		"name": "Meta-Llama-3.1-8B-Instruct",
		"endpoint":"https://models.inference.ai.azure.com",
		"image": "https://github.com/images/modules/marketplace/models/families/meta.svg?size=40"
	},
//	{
//			"name": "Meta-Llama-3-70B-Instruct",
//			"image": "https://github.com/images/modules/marketplace/models/families/meta.svg?size=40"
//	},
	"Meta-Llama-3-8B-Instruct": {
		"model": "Meta-Llama-3-8B-Instruct",
		"temperature": 0.8,
		"max_tokens": 2048,
		"top_p": 0.1,
		"name": "Meta-Llama-3-8B-Instruct",
		"endpoint":"https://models.inference.ai.azure.com",
		"image": "https://github.com/images/modules/marketplace/models/families/meta.svg?size=40"
	},
	"Ministral-3B": {
		"model": "Ministral-3B",
		"temperature": 0.8,
		"max_tokens": 2048,
		"top_p": 0.1,
		"name": "Ministral 3B",
		"endpoint":"https://models.inference.ai.azure.com",
		"image": "https://github.com/images/modules/marketplace/models/families/mistral%20ai.svg?size=40"
	},
	"Mistral-Nemo": {
		"model": "Mistral-Nemo",
		"temperature": 0.8,
		"max_tokens": 2048,
		"top_p": 0.1,
		"name": "Mistral Nemo",
		"endpoint":"https://models.inference.ai.azure.com",
		"image": "https://github.com/images/modules/marketplace/models/families/mistral%20ai.svg?size=40"
	},
	"Mistral-large": {
		"model": "Mistral-large",
		"temperature": 0.8,
		"max_tokens": 2048,
		"top_p": 0.1,
		"name": "Mistral Large",
		"endpoint":"https://models.inference.ai.azure.com",
		"image": "https://github.com/images/modules/marketplace/models/families/mistral%20ai.svg?size=40"
	},
	"Mistral-large-2407": {
		"model": "Mistral-large-2407",
		"temperature": 0.8,
		"max_tokens": 2048,
		"top_p": 0.1,
		"name": "Mistral Large (2407)",
		"endpoint":"https://models.inference.ai.azure.com",
		"image": "https://github.com/images/modules/marketplace/models/families/mistral%20ai.svg?size=40"
	},
	"Mistral-small": {
		"model": "Mistral-small",
		"temperature": 0.8,
		"max_tokens": 2048,
		"top_p": 0.1,
		"name": "Mistral Small",
		"endpoint":"https://models.inference.ai.azure.com",
		"image": "https://github.com/images/modules/marketplace/models/families/mistral%20ai.svg?size=40"
	}
}, false);


// Pushing the data into the database
// With the wanted DataPath
// By default the push will override the old value
await notes.push("/test1","super test");

//// When pushing new data for a DataPath that doesn't exist, it automatically creates the hierarchy
await notes.push("/test2/my/test",5);
//
//// You can also push objects directly
//await notes.push("/test3", {test:"test", json: {test:["test"]}});
//
//// If you don't want to override the data but to merge them
//// The merge is recursive and works with Object and Array.
//!- Its lke it overrides it..
//await notes.push("/test3", {
//    new:"coolio",
//    json: {
//				uhm: 2,
//				new:"val",
//
//    }, "others":"stay"
//}, false);
//
///*
//This give you this results :
//{
//   "test":"test",
//   "json":{
//      "test":[
//         "test"
//      ],
//      "important":5
//   },
//   "new":"cool"
//}
//*/
//
//// You can't merge primitives.
//// If you do this:
//await notes.push("/test2/my/test/",10,false);
//
//// The data will be overriden
//
//// Get the data from the root
var data = await notes.getData("/");
console.log(data);
//
//// Or from a particular DataPath
//var data = await notes.getData("/test1");
//
//// If you try to get some data from a DataPath that doesn't exist
//// You'll get an Error
//try {
//    var data = await notes.getData("/test1/test/dont/work");
//} catch(error) {
//    // The error will tell you where the DataPath stopped. In this case test1
//    // Since /test1/test does't exist.
//    console.error(error);
//};
//
//// Easier than try catch when the path doesn't lead to data
//// This will return `myDefaultValue` if `/super/path` doesn't have data, otherwise it will return the data
//var data = await notes.getObjectDefault<string>("/super/path", "myDefaultValue");
//
//// Deleting data
//await notes.delete("/test1");
//
//// Save the data (useful if you disable the saveOnPush)
//await notes.save();
//
//// In case you have an exterior change to the databse file and want to reload it
//// use this method
//await notes.reload();
