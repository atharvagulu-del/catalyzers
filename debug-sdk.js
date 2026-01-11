const { GoogleGenerativeAI } = require("@google/generative-ai");

const API_KEY = "AIzaSyCRqmmwtwVc0SN0o9aHzlPAuJSg6PVcWYE";
const genAI = new GoogleGenerativeAI(API_KEY);

const MODELS_TO_TEST = [
    "gemini-1.5-flash",
    "gemini-1.5-flash-001",
    "gemini-pro",
    "gemini-1.0-pro",
    "gemini-1.0-pro-latest"
];

async function testAll() {
    console.log("Starting SDK Model Test...\n");

    for (const modelName of MODELS_TO_TEST) {
        process.stdout.write(`Testing '${modelName}'... `);
        try {
            const model = genAI.getGenerativeModel({ model: modelName });
            const result = await model.generateContent("Hi");
            const response = await result.response;
            console.log("✅ SUCCESS");
            console.log("Response:", response.text().substring(0, 20) + "...");
            return; // Stop at first success
        } catch (error) {
            console.log("❌ FAILED");
            // console.log(error.message.split('\n')[0]); // Log first line of error
        }
    }
    console.log("\nAll models failed.");
}

testAll();
