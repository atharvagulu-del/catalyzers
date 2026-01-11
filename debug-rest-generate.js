const API_KEY = "AIzaSyCRqmmwtwVc0SN0o9aHzlPAuJSg6PVcWYE";
const MODEL = "gemini-pro";
const URL = `https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent?key=${API_KEY}`;

async function testGenerate() {
    console.log(`Testing REST Generation for ${MODEL}...`);

    try {
        const response = await fetch(URL, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                contents: [{ parts: [{ text: "Hello" }] }]
            })
        });

        const data = await response.json();

        if (response.ok) {
            console.log("✅ REST SUCCESS!");
            console.log("Response:", JSON.stringify(data.candidates[0].content.parts[0].text).substring(0, 50));
        } else {
            console.log("❌ REST FAILED");
            console.log("Status:", response.status);
            console.log("Error:", JSON.stringify(data, null, 2));
        }
    } catch (error) {
        console.error("Network Error:", error.message);
    }
}

testGenerate();
