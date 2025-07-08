// This file should be placed in a folder named `api` at the root of your project.
// Vercel will automatically detect this as a serverless function.
// e.g., your-project/api/gemini.js

export default async function handler(request, response) {
  // Only allow POST requests
  if (request.method !== 'POST') {
    return response.status(405).json({ message: 'Method Not Allowed' });
  }

  // Get the API key from environment variables (this is secure)
  const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

  if (!GEMINI_API_KEY) {
    return response.status(500).json({ error: 'API key not found on server.' });
  }
  
  const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GEMINI_API_KEY}`;

  try {
    // Get the data sent from the frontend
    const { userMessage, chatHistory, userName, location, language } = request.body;
    
    const languageMap = {
        en: 'English',
        hi: 'Hindi',
        hin: 'Hinglish'
    };

    // Construct a prompt that gives the AI its persona and context
    const systemPrompt = `You are 'AI Dukandar', a friendly and helpful AI shopkeeper for a local marketplace in India. You are serving a customer named ${userName} who is located at ${location}. Your goal is to help them find products and services available locally. The customer's preferred language is ${languageMap[language]}. Respond ONLY in ${languageMap[language]}. Be conversational and helpful.`;

    const contents = [
        ...chatHistory.map(msg => ({
            role: msg.from === 'user' ? 'user' : 'model',
            parts: [{ text: msg.text }]
        })),
        {
            role: 'user',
            parts: [{ text: userMessage }]
        }
    ];
    
    const payload = {
      contents: [{ role: "user", parts: [{text: systemPrompt + "\n\nConversation History:\n" + JSON.stringify(contents) + "\n\nNew Message: " + userMessage}]}],
    };

    // Call the Gemini API from the secure server environment
    const geminiResponse = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    if (!geminiResponse.ok) {
        const errorText = await geminiResponse.text();
        throw new Error(`Gemini API error: ${geminiResponse.statusText} - ${errorText}`);
    }

    const data = await geminiResponse.json();

    let botResponseText = "Sorry, I couldn't process that. Please try again.";
    if (data.candidates && data.candidates.length > 0 && data.candidates[0].content.parts[0].text) {
      botResponseText = data.candidates[0].content.parts[0].text;
    }

    // Send the response back to the frontend
    return response.status(200).json({ text: botResponseText });

  } catch (error) {
    console.error(error);
    return response.status(500).json({ error: 'Failed to connect to the AI service.' });
  }
}
