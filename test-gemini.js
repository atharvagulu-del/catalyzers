const { GoogleGenerativeAI } = require("@google/generative-ai");

const API_KEY = "AIzaSyCRqmmwtwVc0SN0o9aHzlPAuJSg6PVcWYE";

async function testGemini() {
    console.log("--- Testing Standard Config (v1beta default) ---");
    try {
        const genAI = new GoogleGenerativeAI(API_KEY);
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
        const result = await model.generateContent("Hello 1");
        const response = await result.response;
        console.log("Success (Standard):", response.text());
        return;
    } catch (error) {
        console.error("Standard Failed:", error.message);
    }

    console.log("\n--- Testing Explicit 'gemini-pro' ---");
    try {
        const genAI = new GoogleGenerativeAI(API_KEY);
        const model = genAI.getGenerativeModel({ model: "gemini-pro" });
        const result = await model.generateContent("Hello 2");
        const response = await result.response;
        console.log("Success (Gemini Pro):", response.text());
        return;
    } catch (error) {
        console.error("Gemini Pro Failed:", error.message);
    }
}

testGemini();
