// This file should be placed in a folder named `api` at the root of your project.
// Vercel will automatically detect this as a serverless function.
// e.g., your-project/api/gemini.js

// This function attempts to make the API call with a given key.
const callGeminiAPI = async (apiKey, payload) => {
  const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`;
  
  const response = await fetch(API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });

  return response;
};


export default async function handler(request, response) {
  // Only allow POST requests
  if (request.method !== 'POST') {
    return response.status(405).json({ message: 'Method Not Allowed' });
  }

  // Get both API keys from environment variables.
  const PRIMARY_API_KEY = process.env.GEMINI_API_KEY_1;
  const FALLBACK_API_KEY = process.env.GEMINI_API_KEY_2;

  if (!PRIMARY_API_KEY) {
    return response.status(500).json({ error: 'Primary API key not found on server.' });
  }
  
  try {
    // Get the data sent from the frontend
    const { userMessage, chatHistory, userName, location, language } = request.body;
    
    const languageMap = {
        en: 'English',
        hi: 'Hindi',
        hin: 'Hinglish'
    };

    const targetLanguage = languageMap[language] || 'English';

    // --- FINAL LANGUAGE FIX: Making the prompt extremely strict ---
    let systemText;
    if (targetLanguage === 'Hindi') {
        systemText = `आप 'AI दुकानदार' हैं, भारत में एक स्थानीय बाज़ार के लिए एक दोस्ताना और सहायक AI दुकानदार। आप ${userName} नामक ग्राहक की सेवा कर रहे हैं जो ${location} पर स्थित है। आपका लक्ष्य उन्हें स्थानीय रूप से उपलब्ध उत्पादों और सेवाओं को खोजने में मदद करना है। ग्राहक की पसंदीदा भाषा हिंदी है। आपकी प्रतिक्रिया विशेष रूप से देवनागरी लिपि में शुद्ध हिंदी में होनी चाहिए। किसी भी अंग्रेजी शब्द या रोमन लिपि का प्रयोग न करें। उदाहरण के लिए, यदि उपयोगकर्ता पूछता है "मुझे 1 किलो चीनी चाहिए", तो एक अच्छी प्रतिक्रिया होगी "ज़रूर, 1 किलो चीनी का दाम 45 रुपये है। क्या मैं आपके लिए ऑर्डर कर दूँ?"`;
    } else {
        systemText = `You are 'AI Dukandar', a friendly and helpful AI shopkeeper for a local marketplace in India. You are serving a customer named ${userName} who is located at ${location}. Your goal is to help them find products and services available locally. The customer's preferred language is ${targetLanguage}. Your response MUST be exclusively in ${targetLanguage}.`;
    }

    const systemInstruction = {
      parts: [{ text: systemText }]
    };

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
      contents: contents,
      systemInstruction: systemInstruction,
    };

    // --- FALLBACK LOGIC ---
    let geminiResponse;
    geminiResponse = await callGeminiAPI(PRIMARY_API_KEY, payload);

    if (geminiResponse.status === 429 && FALLBACK_API_KEY) {
      console.log("Primary key quota exceeded. Trying fallback key.");
      geminiResponse = await callGeminiAPI(FALLBACK_API_KEY, payload);
    }
    
    if (!geminiResponse.ok) {
        const errorText = await geminiResponse.text();
        throw new Error(`Gemini API error: ${geminiResponse.status} ${geminiResponse.statusText} - ${errorText}`);
    }

    const data = await geminiResponse.json();

    let botResponseText = "Sorry, I couldn't process that. Please try again.";
    if (data.candidates && data.candidates.length > 0 && data.candidates[0].content && data.candidates[0].content.parts && data.candidates[0].content.parts[0].text) {
      botResponseText = data.candidates[0].content.parts[0].text;
    }

    return response.status(200).json({ text: botResponseText });

  } catch (error) {
    console.error(error);
    return response.status(500).json({ error: 'Failed to connect to the AI service.' });
  }
}
