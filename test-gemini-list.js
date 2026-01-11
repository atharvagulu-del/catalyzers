const { GoogleGenerativeAI } = require("@google/generative-ai");

// User's provided key
const API_KEY = "AIzaSyCRqmmwtwVc0SN0o9aHzlPAuJSg6PVcWYE";

async function listModels() {
    console.log("Initializing GoogleGenerativeAI...");
    const genAI = new GoogleGenerativeAI(API_KEY);

    try {
        // Note: The SDK doesn't expose listModels directly on the client instance in some versions,
        // but the underlying API supports it. Let's try to infer availability by trying the "old faithful" model first.
        console.log("Attempting to access gemini-pro...");
        const model = genAI.getGenerativeModel({ model: "gemini-pro" });
        const result = await model.generateContent("Test connection");
        console.log("gemini-pro is WORKING!");

        console.log("Attempting to access gemini-1.5-flash...");
        const modelFlash = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
        const resultFlash = await modelFlash.generateContent("Test connection");
        console.log("gemini-1.5-flash is WORKING!");

    } catch (error) {
        console.error("\nAPI Error Details:");
        console.error(error.message);

        if (error.message.includes("404")) {
            console.log("\nDIAGNOSIS: 404 means the API is enabled but the specific MODEL is not found or not allowed.");
        } else if (error.message.includes("403")) {
            console.log("\nDIAGNOSIS: 403 means the API Key is invalid or the API is NOT enabled.");
        }
    }
}

listModels();
