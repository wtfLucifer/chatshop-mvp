import React, { useState, useEffect, useRef } from 'react';

// --- TRANSLATION DATA ---
// All UI text is stored here for easy language switching.
const translations = {
  en: {
    // General
    appName: "AI Dukandar",
    updateLocation: "Update Location",
    changeLanguage: "Change Language",
    loading: "Loading...",
    error: "Error",
    // Login Page
    loginTitle: "Login with Mobile Number",
    mobileNumberLabel: "Mobile Number",
    mobileNumberPlaceholder: "Enter your 10-digit mobile number",
    sendOtpButton: "Continue",
    phoneError: "Please enter a valid 10-digit mobile number.",
    // Name & Location Page
    addDetailsTitle: "Enter Your Details",
    nameLabel: "Your Name",
    namePlaceholder: "Enter your full name",
    nameError: "Please enter a valid name (letters and spaces only).",
    locationLabel: "Your Delivery Location",
    fetchLocationButton: "Get Current Location",
    proceedButton: "Proceed",
    fetchingLocation: "Fetching location...",
    locationError: "Could not fetch location. Please enable location services or enter manually.",
    // Confirm Location Page
    confirmLocationTitle: "Confirm Your Location",
    confirmLocationText: "Is this your correct delivery address?",
    confirmButton: "Yes, That's Correct",
    // Chat Page
    chatTitle: "Chat with AI Dukandar",
    chatPlaceholder: "Ask for anything...",
    sendButton: "Send",
    initialBotMessage: "Namaste! I am your AI Dukandar. How can I help you today?",
    locationUpdated: "Location updated successfully!",
    // Bottom Nav
    navHome: "Home",
    navOrders: "Orders",
    navNew: "New",
    navProfile: "Profile",
    // Voice
    speakButton: "Speak",
    listenButton: "Listen",
  },
  hi: {
    // General
    appName: "AI दुकानदार",
    updateLocation: "लोकेशन अपडेट करें",
    changeLanguage: "भाषा बदलें",
    loading: "लोड हो रहा है...",
    error: "त्रुटि",
    // Login Page
    loginTitle: "मोबाइल नंबर से लॉगिन करें",
    mobileNumberLabel: "मोबाइल नंबर",
    mobileNumberPlaceholder: "अपना 10 अंकों का मोबाइल नंबर दर्ज करें",
    sendOtpButton: "आगे बढ़ें",
    phoneError: "कृपया एक मान्य 10-अंकीय मोबाइल नंबर दर्ज करें।",
    // Name & Location Page
    addDetailsTitle: "अपना विवरण दर्ज करें",
    nameLabel: "आपका नाम",
    namePlaceholder: "अपना पूरा नाम दर्ज करें",
    nameError: "कृपया एक मान्य नाम दर्ज करें (केवल अक्षर और स्थान)।",
    locationLabel: "आपकी डिलीवरी लोकेशन",
    fetchLocationButton: "वर्तमान लोकेशन प्राप्त करें",
    proceedButton: "आगे बढ़ें",
    fetchingLocation: "लोकेशन प्राप्त हो रही है...",
    locationError: "लोकेशन प्राप्त नहीं हो सका। कृपया लोकेशन सेवाएं सक्षम करें या मैन्युअल रूप से दर्ज करें।",
    // Confirm Location Page
    confirmLocationTitle: "अपनी लोकेशन की पुष्टि करें",
    confirmLocationText: "क्या यह आपका सही डिलीवरी पता है?",
    confirmButton: "हाँ, यह सही है",
    // Chat Page
    chatTitle: "AI दुकानदार से चैट करें",
    chatPlaceholder: "कुछ भी पूछें...",
    sendButton: "भेजें",
    initialBotMessage: "नमस्ते! मैं आपका AI दुकानदार हूँ। आज मैं आपकी कैसे मदद कर सकता हूँ?",
    locationUpdated: "लोकेशन सफलतापूर्वक अपडेट हो गया!",
    // Bottom Nav
    navHome: "होम",
    navOrders: "ऑर्डर",
    navNew: "नया",
    navProfile: "प्रोफाइल",
     // Voice
    speakButton: "बोलें",
    listenButton: "सुनें",
  },
  hin: {
    // General
    appName: "AI Dukandar",
    updateLocation: "Location update karein",
    changeLanguage: "Bhasha badlein",
    loading: "Load ho raha hai...",
    error: "Error",
    // Login Page
    loginTitle: "Mobile number se login karein",
    mobileNumberLabel: "Mobile Number",
    mobileNumberPlaceholder: "Apna 10 digit ka mobile number daalein",
    sendOtpButton: "Aage Badhein",
    phoneError: "Kripya ek valid 10-digit mobile number daalein.",
    // Name & Location Page
    addDetailsTitle: "Apni details daalein",
    nameLabel: "Aapka Naam",
    namePlaceholder: "Apna poora naam daalein",
    nameError: "Kripya ek valid naam daalein (sirf letters aur spaces).",
    locationLabel: "Aapki delivery location",
    fetchLocationButton: "Current location pata karein",
    proceedButton: "Aage Badhein",
    fetchingLocation: "Location fetch ho rahi hai...",
    locationError: "Location nahi mil saki. Kripya location services on karein ya manually enter karein.",
    // Confirm Location Page
    confirmLocationTitle: "Apni location confirm karein",
    confirmLocationText: "Kya yeh aapka sahi delivery address hai?",
    confirmButton: "Haan, Sahi Hai",
    // Chat Page
    chatTitle: "AI Dukandar se chat karein",
    chatPlaceholder: "Kuch bhi poochein...",
    sendButton: "Bhejein",
    initialBotMessage: "Namaste! Main aapka AI Dukandar hoon. Aaj main aapki kaise madad kar sakta hoon?",
    locationUpdated: "Location successfully update ho gayi!",
    // Bottom Nav
    navHome: "Home",
    navOrders: "Orders",
    navNew: "Naya",
    navProfile: "Profile",
    // Voice
    speakButton: "Bolein",
    listenButton: "Sunein",
  },
};

// --- HELPER COMPONENTS ---

// A simple language switcher component
const LanguageSwitcher = ({ setLanguage, currentLang }) => {
  const languages = [
    { code: 'en', name: 'English' },
    { code: 'hi', name: 'हिन्दी' },
    { code: 'hin', name: 'Hinglish' },
  ];

  return (
    <div className="absolute top-4 right-4">
      <select
        value={currentLang}
        onChange={(e) => setLanguage(e.target.value)}
        className="bg-white border border-gray-300 rounded-md shadow-sm px-3 py-1 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-green-500"
      >
        {languages.map((lang) => (
          <option key={lang.code} value={lang.code}>
            {lang.name}
          </option>
        ))}
      </select>
    </div>
  );
};


// Bottom navigation bar as seen in the wireframe
const BottomNav = ({ t }) => {
  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-lg">
      <div className="flex justify-around items-center h-16">
        <div className="flex flex-col items-center text-gray-600 hover:text-green-600">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg>
          <span className="text-xs">{t.navHome}</span>
        </div>
        <div className="flex flex-col items-center text-gray-600 hover:text-green-600">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" /></svg>
          <span className="text-xs">{t.navOrders}</span>
        </div>
        <div className="flex flex-col items-center text-gray-600 hover:text-green-600">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 -mt-1 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
          <span className="text-xs">{t.navNew}</span>
        </div>
        <div className="flex flex-col items-center text-gray-600 hover:text-green-600">
           <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
          <span className="text-xs">{t.navProfile}</span>
        </div>
      </div>
    </div>
  );
};


// --- PAGE COMPONENTS ---

// Page 1: Login
const LoginPage = ({ onLogin, t, setLanguage, language }) => {
  const [phone, setPhone] = useState('');
  const [error, setError] = useState('');

  const handleLogin = () => {
    // Validate 10-digit number
    if (/^\d{10}$/.test(phone)) {
      setError('');
      onLogin(phone);
    } else {
      setError(t.phoneError);
    }
  };

  return (
    <div className="w-full h-full flex flex-col items-center justify-center p-4 bg-gray-50">
      <LanguageSwitcher setLanguage={setLanguage} currentLang={language} />
      <h1 className="text-3xl font-bold text-green-600 mb-4">{t.appName}</h1>
      <div className="w-full max-w-sm bg-white p-8 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold text-center text-gray-700 mb-6">{t.loginTitle}</h2>
        <div className="mb-4">
          <label htmlFor="phone" className="block text-sm font-medium text-gray-600 mb-1">{t.mobileNumberLabel}</label>
          <input
            id="phone"
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder={t.mobileNumberPlaceholder}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
          />
        </div>
        {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
        <button
          onClick={handleLogin}
          className="w-full bg-green-600 text-white py-2 rounded-md hover:bg-green-700 transition duration-300"
        >
          {t.sendOtpButton}
        </button>
      </div>
    </div>
  );
};

// Page 2: Add Name and Location
const AddLocationPage = ({ onDetailsSubmit, t, setLanguage, language }) => {
  const [name, setName] = useState('');
  const [location, setLocation] = useState('');
  const [isFetching, setIsFetching] = useState(false);
  const [nameError, setNameError] = useState('');
  const [locationError, setLocationError] = useState('');

  const handleFetchLocation = () => {
    setIsFetching(true);
    setLocationError('');
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;
          // Using a free reverse geocoding service for a user-friendly address
          try {
            const response = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`);
            const data = await response.json();
            setLocation(data.display_name || `${latitude}, ${longitude}`);
          } catch (error) {
            setLocation(`${latitude}, ${longitude}`);
          } finally {
            setIsFetching(false);
          }
        },
        () => {
          setLocationError(t.locationError);
          setIsFetching(false);
        }
      );
    } else {
      setLocationError(t.locationError);
      setIsFetching(false);
    }
  };

  const handleSubmit = () => {
    // Validate name (letters and spaces only)
    if (!/^[A-Za-z\s]+$/.test(name)) {
      setNameError(t.nameError);
      return;
    }
    setNameError('');
    if (!location) {
        setLocationError(t.locationError);
        return;
    }
    onDetailsSubmit(name, location);
  };

  return (
    <div className="w-full h-full flex flex-col items-center justify-center p-4 bg-gray-50">
      <LanguageSwitcher setLanguage={setLanguage} currentLang={language} />
      <h1 className="text-3xl font-bold text-green-600 mb-4">{t.appName}</h1>
      <div className="w-full max-w-sm bg-white p-8 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold text-center text-gray-700 mb-6">{t.addDetailsTitle}</h2>
        <div className="mb-4">
          <label htmlFor="name" className="block text-sm font-medium text-gray-600 mb-1">{t.nameLabel}</label>
          <input
            id="name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder={t.namePlaceholder}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
          />
          {nameError && <p className="text-red-500 text-sm mt-1">{nameError}</p>}
        </div>
        <div className="mb-6">
          <label htmlFor="location" className="block text-sm font-medium text-gray-600 mb-1">{t.locationLabel}</label>
          <button
            onClick={handleFetchLocation}
            disabled={isFetching}
            className="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600 transition duration-300 mb-2 disabled:bg-blue-300"
          >
            {isFetching ? t.fetchingLocation : t.fetchLocationButton}
          </button>
          <textarea
            id="location"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            rows="3"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
          />
          {locationError && <p className="text-red-500 text-sm mt-1">{locationError}</p>}
        </div>
        <button
          onClick={handleSubmit}
          className="w-full bg-green-600 text-white py-2 rounded-md hover:bg-green-700 transition duration-300"
        >
          {t.proceedButton}
        </button>
      </div>
    </div>
  );
};


// Page 3: Confirm Location
const ConfirmLocationPage = ({ onConfirm, name, location, t, setLanguage, language }) => {
    const [coords, setCoords] = useState(null);

    useEffect(() => {
        const getCoords = async () => {
            try {
                // Use a free geocoding service to get coordinates from the address string
                const response = await fetch(`https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(location)}&format=json&limit=1`);
                const data = await response.json();
                if (data && data.length > 0) {
                    setCoords({ lat: data[0].lat, lon: data[0].lon });
                }
            } catch (error) {
                console.error("Geocoding error:", error);
            }
        };
        getCoords();
    }, [location]);

    const mapUrl = coords 
        ? `https://www.openstreetmap.org/export/embed.html?bbox=${parseFloat(coords.lon)-0.01}%2C${parseFloat(coords.lat)-0.01}%2C${parseFloat(coords.lon)+0.01}%2C${parseFloat(coords.lat)+0.01}&layer=mapnik&marker=${coords.lat}%2C${coords.lon}`
        : `https://placehold.co/600x400/e2e8f0/64748b?text=Map+Unavailable`;

    return (
        <div className="w-full h-full flex flex-col items-center p-4 bg-gray-50">
            <div className="w-full bg-green-600 p-4 text-white text-center text-xl font-bold shadow-md">
                {t.appName}
            </div>
            <LanguageSwitcher setLanguage={setLanguage} currentLang={language} />
            <div className="flex-grow w-full max-w-md flex flex-col items-center justify-center p-4">
                <h2 className="text-2xl font-bold text-gray-800 mb-4">{name}</h2>
                <div className="w-full h-64 border-2 border-gray-300 rounded-lg overflow-hidden shadow-lg mb-4">
                    <iframe
                        width="100%"
                        height="100%"
                        frameBorder="0"
                        scrolling="no"
                        marginHeight="0"
                        marginWidth="0"
                        src={mapUrl}
                        title="Location Map"
                    ></iframe>
                </div>
                <p className="text-center text-gray-600 mb-6">{location}</p>
                <p className="text-lg font-semibold text-gray-700 mb-6">{t.confirmLocationText}</p>
                <button
                    onClick={onConfirm}
                    className="w-full bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 transition duration-300 text-lg font-bold"
                >
                    {t.confirmButton}
                </button>
            </div>
        </div>
    );
};


// Page 4: Chat
const ChatPage = ({ userName, location, t, setLanguage, language, onUpdateLocation }) => {
  const [messages, setMessages] = useState([
    { from: 'bot', text: t.initialBotMessage }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const chatEndRef = useRef(null);

  // For Speech Recognition (Listen)
  const recognition = useRef(null);
  const [isListening, setIsListening] = useState(false);

  // For Speech Synthesis (Speak)
  const synth = window.speechSynthesis;

  useEffect(() => {
    // Scroll to the latest message
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);
  
  // Initialize Speech Recognition
  useEffect(() => {
    if ('webkitSpeechRecognition' in window) {
      recognition.current = new window.webkitSpeechRecognition();
      recognition.current.continuous = false;
      recognition.current.lang = language === 'hi' ? 'hi-IN' : 'en-US';
      recognition.current.interimResults = false;
      recognition.current.maxAlternatives = 1;

      recognition.current.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        setInput(transcript);
        setIsListening(false);
      };

      recognition.current.onerror = (event) => {
        console.error('Speech recognition error', event.error);
        setIsListening(false);
      };
      
      recognition.current.onend = () => {
        setIsListening(false);
      };
    }
  }, [language]);


  const handleListen = () => {
    if (recognition.current && !isListening) {
      recognition.current.start();
      setIsListening(true);
    }
  };

  const handleSpeak = (text) => {
     if (synth.speaking) {
        synth.cancel();
    }
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = language === 'hi' ? 'hi-IN' : 'en-US';
    synth.speak(utterance);
  };


  const getGeminiResponse = async (userMessage, chatHistory) => {
    setIsLoading(true);
    
    // The API call is now made to our own backend proxy
    const API_URL = "/api/gemini";

    const payload = {
        userMessage,
        chatHistory,
        userName,
        location,
        language
    };

    try {
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error(`API error: ${response.statusText}`);
      }

      const data = await response.json();
      
      const botResponse = data.text || "Sorry, I couldn't process that. Please try again.";
      
      setMessages(prev => [...prev, { from: 'bot', text: botResponse }]);

    } catch (error) {
      console.error('API call failed:', error);
      setMessages(prev => [...prev, { from: 'bot', text: `${t.error}: Could not connect to AI. Please check the server logs.` }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSend = () => {
    if (input.trim() === '') return;

    const newMessages = [...messages, { from: 'user', text: input }];
    setMessages(newMessages);
    getGeminiResponse(input, newMessages);
    setInput('');
  };
  
  const handleUpdateLocation = () => {
      onUpdateLocation();
      alert(t.locationUpdated);
  }

  return (
    <div className="w-full h-full flex flex-col bg-gray-100">
       <div className="w-full bg-green-600 p-4 text-white text-center text-xl font-bold shadow-md flex justify-between items-center">
        <span>{t.chatTitle}</span>
        <button onClick={handleUpdateLocation} className="text-sm bg-green-700 hover:bg-green-800 text-white font-bold py-1 px-2 rounded">
            {t.updateLocation}
        </button>
      </div>
      <LanguageSwitcher setLanguage={setLanguage} currentLang={language} />

      {/* Chat Area */}
      <div className="flex-grow p-4 overflow-y-auto pb-32">
        {messages.map((msg, index) => (
          <div key={index} className={`flex ${msg.from === 'user' ? 'justify-end' : 'justify-start'} mb-4`}>
            <div className={`max-w-xs md:max-w-md lg:max-w-lg p-3 rounded-lg shadow ${msg.from === 'user' ? 'bg-green-200' : 'bg-white'}`}>
              <p className="text-gray-800">{msg.text}</p>
            </div>
             {msg.from === 'bot' && (
                <button onClick={() => handleSpeak(msg.text)} className="ml-2 self-end p-1 text-gray-500 hover:text-green-600">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path d="M10 3a1 1 0 011 1v1.414l3.293 3.293a1 1 0 01-1.414 1.414L11 8.414V15a1 1 0 11-2 0V8.414L6.707 9.707a1 1 0 01-1.414-1.414L8.586 5.414 9 5V4a1 1 0 011-1zM3 10a1 1 0 011-1h2a1 1 0 110 2H4a1 1 0 01-1-1zm12 0a1 1 0 011-1h2a1 1 0 110 2h-2a1 1 0 01-1-1z" />
                    </svg>
                </button>
            )}
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-start mb-4">
            <div className="max-w-xs p-3 rounded-lg shadow bg-white">
              <p className="text-gray-500 italic">{t.loading}</p>
            </div>
          </div>
        )}
        <div ref={chatEndRef} />
      </div>

      {/* Input Area */}
      <div className="fixed bottom-16 left-0 right-0 bg-white p-3 border-t border-gray-200">
        <div className="flex items-center">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSend()}
            placeholder={t.chatPlaceholder}
            className="flex-grow px-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-green-500"
          />
           <button onClick={handleListen} className={`ml-2 p-2 rounded-full ${isListening ? 'bg-red-500 text-white animate-pulse' : 'bg-gray-200 text-gray-600 hover:bg-gray-300'}`}>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
                </svg>
            </button>
          <button
            onClick={handleSend}
            className="ml-2 bg-green-600 text-white p-2 rounded-full hover:bg-green-700 transition duration-300"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </button>
        </div>
      </div>
      <BottomNav t={t} />
    </div>
  );
};


// --- MAIN APP COMPONENT ---
export default function App() {
  const [page, setPage] = useState('login'); // login, addLocation, confirmLocation, chat
  const [language, setLanguage] = useState('en');
  const [userData, setUserData] = useState({
    phone: '',
    name: '',
    location: '',
  });

  const t = translations[language];

  const handleLogin = (phone) => {
    setUserData(prev => ({ ...prev, phone }));
    setPage('addLocation');
  };

  const handleDetailsSubmit = (name, location) => {
    setUserData(prev => ({ ...prev, name, location }));
    setPage('confirmLocation');
  };

  const handleConfirmLocation = () => {
    setPage('chat');
  };

  const handleUpdateLocation = () => {
      // Go back to location page to update
      setPage('addLocation');
  }

  const renderPage = () => {
    switch (page) {
      case 'login':
        return <LoginPage onLogin={handleLogin} t={t} setLanguage={setLanguage} language={language} />;
      case 'addLocation':
        return <AddLocationPage onDetailsSubmit={handleDetailsSubmit} t={t} setLanguage={setLanguage} language={language} />;
      case 'confirmLocation':
        return <ConfirmLocationPage onConfirm={handleConfirmLocation} name={userData.name} location={userData.location} t={t} setLanguage={setLanguage} language={language} />;
      case 'chat':
        return <ChatPage userName={userData.name} location={userData.location} t={t} setLanguage={setLanguage} language={language} onUpdateLocation={handleUpdateLocation} />;
      default:
        return <LoginPage onLogin={handleLogin} t={t} setLanguage={setLanguage} language={language} />;
    }
  };

  return (
    <div className="w-screen h-screen font-sans">
      {renderPage()}
    </div>
  );
}
