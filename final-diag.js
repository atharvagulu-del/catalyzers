const { GoogleGenerativeAI } = require("@google/generative-ai");

const NEW_KEY = "AIzaSyDZbNvmStdGgYCWMJWs5W28rRWXOHRtewg";

async function testFinal() {
    console.log("Testing NEW KEY...");
    const genAI = new GoogleGenerativeAI(NEW_KEY);

    try {
        console.log("Trying 'gemini-1.5-flash'...");
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
        const result = await model.generateContent("Test");
        console.log("✅ 1.5-FLASH WORKS!");
    } catch (e) {
        console.log("\n❌ 1.5-Flash FAILED. Full Error:");
        try {
            // Try to extract raw response if available
            if (e.response) {
                console.log(JSON.stringify(await e.response.json(), null, 2));
            } else {
                console.log(e.message);
                if (e.cause) console.log("Cause:", e.cause);
            }
        } catch (err) {
            console.log("Could not parse error JSON:", e.message);
        }
    }
}

testFinal();
