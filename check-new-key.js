const API_KEY = "AIzaSyDZbNvmStdGgYCWMJWs5W28rRWXOHRtewg";
const URL = `https://generativelanguage.googleapis.com/v1beta/models?key=${API_KEY}`;

async function checkModels() {
    try {
        const response = await fetch(URL);
        const data = await response.json();

        if (response.ok) {
            console.log("SUCCESS! Models:");
            // Filter for main text models
            const relevant = data.models
                .map(m => m.name)
                .filter(n => n.includes('gemini-1.5') || n.includes('gemini-pro'));

            console.log(relevant.join('\n'));
        } else {
            console.log("FAILED:", response.status, JSON.stringify(data));
        }
    } catch (error) {
        console.log("NET ERROR:", error.message);
    }
}

checkModels();
