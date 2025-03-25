// Voice recognition functionality
document.getElementById('recordButton').addEventListener('click', function() {
    this.classList.toggle('recording');
    if (this.classList.contains('recording')) {
        document.getElementById('status').textContent = 'सुन रहा हूँ...';
        startVoiceRecognition();
    } else {
        document.getElementById('status').textContent = 'रुक गया';
        stopVoiceRecognition();
    }
});
const diseaseData = {
    "चावल": {
        "ब्लास्ट": {
            "response": "चावल में धब्बे का रोग (ब्लास्ट) हो सकता है। यह एक फफूंदी (फंगस) के कारण होता है जिसे 'मैग्नापोर्थे ओरिज़ा' कहते हैं। इसके लक्षण हैं: पत्तियों पर भूरे रंग के धब्बे जो बाद में बड़े हो जाते हैं।<br><br>उपचार:<br>1. ट्राइसाइक्लाज़ोल 75% डब्ल्यूपी (WP) @ 0.6 ग्राम/लीटर पानी का छिड़काव करें<br>2. प्रोपिकोनाज़ोल 25% ईसी (EC) @ 1 मिली/लीटर पानी का छिड़काव करें<br>3. कार्बेन्डाजिम 50% डब्ल्यूपी (WP) @ 1 ग्राम/लीटर पानी का छिड़काव करें"
        },
        "झुलस": {
            "response": "चावल का झुलसा रोग एक गंभीर समस्या है। यह पूरी फसल को नष्ट कर सकता है।<br><br>नियंत्रण के उपाय:<br>1. रोग प्रतिरोधी किस्मों (प्रतिरोधी बीज) का प्रयोग करें<br>2. नाइट्रोजन उर्वरकों का संतुलित उपयोग करें<br>3. खेत में पानी का उचित प्रबंधन करें<br>4. ट्राइसाइक्लाज़ोल या आइसोप्रोथिओलेन का छिड़काव करें"
        }
    },
    "गेहूं": {
        "रतुआ": {
            "response": "गेहूं का रतुआ रोग तीन प्रकार का होता है: पत्ती रतुआ, तना रतुआ और पीला रतुआ।<br><br>नियंत्रण के उपाय:<br>1. प्रोपिकोनाज़ोल 25% ईसी (EC) @ 1 मिली/लीटर पानी का छिड़काव करें<br>2. टेबुकोनाज़ोल 25.9% ईसी (EC) @ 1 मिली/लीटर पानी का छिड़काव करें<br>3. अगले सीजन के लिए प्रतिरोधी किस्मों का चयन करें"
        },
        "करनाल": {
            "response": "गेहूं का करनाल बंट एक फफूंदी (फंगस) जनित रोग है जो दानों की गुणवत्ता को कम करता है।<br><br>नियंत्रण के उपाय:<br>1. प्रमाणित बीज का उपयोग करें<br>2. बीज को कार्बेन्डाजिम 2 ग्राम/किलो बीज की दर से उपचारित करें<br>3. फसल चक्र अपनाएं (हर वर्ष अलग फसल उगाएं)<br>4. प्रभावित क्षेत्रों में सिंचाई से बचें"
        }
    }
};


// Text input submission
document.getElementById('submitTextButton').addEventListener('click', function() {
    const text = document.getElementById('problemText').value.trim();
    if (text) {
        processTextInput(text);
        document.getElementById('problemText').value = '';
    } else {
        alert('कृपया अपनी समस्या लिखें');
    }
});

// Image upload functionality
document.getElementById('uploadButton').addEventListener('click', function() {
    document.getElementById('imageUpload').click();
});

document.getElementById('imageUpload').addEventListener('change', function(event) {
    const file = event.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function(e) {
            const img = document.createElement('img');
            img.src = e.target.result;
            img.style.maxWidth = '100%';
            img.style.maxHeight = '200px';
            img.style.borderRadius = '8px';
            img.style.boxShadow = '0 2px 5px rgba(0,0,0,0.1)';
            
            const selectedImageDiv = document.getElementById('selectedImage');
            selectedImageDiv.innerHTML = '';
            selectedImageDiv.appendChild(img);
            
            // Here you would normally upload the image to be processed
            // For this demo, we'll simulate a response after upload
            setTimeout(function() {
                addChatMessage('बीमारी की पहचान हो रही है...', 'bot');
                
                // Simulate processing delay
                setTimeout(function() {
                    // Demo response for rice blast disease
                    const response = 'तस्वीर में चावल का ब्लास्ट रोग दिखाई दे रहा है। यह एक फंगल रोग है जो पत्तियों, तनों और अनाज को प्रभावित करता है। इस रोग को नियंत्रित करने के लिए:' +
                        '<ul>' +
                        '<li>ट्राइसाइक्लाज़ोल या आइसोप्रोथिओलेन का छिड़काव करें</li>' +
                        '<li>अगले फसल चक्र में प्रतिरोधी किस्मों का उपयोग करें</li>' +
                        '<li>नाइट्रोजन उर्वरकों का संतुलित उपयोग करें</li>' +
                        '</ul>';
                    
                    addChatMessage(response, 'bot');
                }, 2000);
            }, 1000);
        };
        reader.readAsDataURL(file);
    }
});

// Process typed text input
function processTextInput(text) {
    // Add user message to chat
    addChatMessage(text, 'user');
    
    // In a real application, you would send this to your backend
    // For demo, we'll simulate responses for common rice/wheat disease queries
    simulateResponse(text);
}

// Voice recognition implementation
let recognition;

function startVoiceRecognition() {
    if (!('webkitSpeechRecognition' in window)) {
        alert('इस ब्राउज़र में वॉइस रिकॉग्निशन का समर्थन नहीं है। कृपया Chrome या अन्य आधुनिक ब्राउज़र का उपयोग करें।');
        return;
    }
    
    recognition = new webkitSpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = true;
    recognition.lang = 'hi-IN';
    
    let finalTranscript = '';
    
    recognition.onresult = function(event) {
        let interimTranscript = '';
        for (let i = event.resultIndex; i < event.results.length; ++i) {
            if (event.results[i].isFinal) {
                finalTranscript += event.results[i][0].transcript;
            } else {
                interimTranscript += event.results[i][0].transcript;
            }
        }
        
        document.getElementById('interim-text').textContent = interimTranscript;
        document.getElementById('final-text').textContent = finalTranscript;
        
        if (finalTranscript !== '') {
            processVoiceInput(finalTranscript);
        }
    };
    
    recognition.onerror = function(event) {
        console.error('Speech recognition error:', event.error);
        document.getElementById('status').textContent = 'त्रुटि: ' + event.error;
        document.getElementById('recordButton').classList.remove('recording');
    };
    
    recognition.onend = function() {
        document.getElementById('status').textContent = 'रिकॉर्डिंग समाप्त';
        document.getElementById('recordButton').classList.remove('recording');
    };
    
    recognition.start();
}

function stopVoiceRecognition() {
    if (recognition) {
        recognition.stop();
    }
}

function processVoiceInput(text) {
    // Add user message to chat
    addChatMessage(text, 'user');
    
    // In a real application, you would send this to your backend
    // For demo, we'll simulate responses for common rice/wheat disease queries
    simulateResponse(text);
}
function simulateResponse(query) {
    const lowerQuery = query.toLowerCase();
    addChatMessage('आपकी समस्या पर विचार कर रहा हूँ...', 'bot');

    setTimeout(() => {
        let found = false;

        for (const crop in diseaseData) {
            if (lowerQuery.includes(crop)) {
                for (const disease in diseaseData[crop]) {
                    if (lowerQuery.includes(disease)) {
                        addChatMessage(diseaseData[crop][disease].response, 'bot');
                        speakResponse(diseaseData[crop][disease].response.replace(/<br>|<ul>|<li>|<\/ul>|<\/li>/g, ' '));
                        found = true;
                        break;
                    }
                }
            }
            if (found) break;
        }

        if (!found) {
            // Collect all disease suggestions from JSON
            let suggestions = [];
            for (const crop in diseaseData) {
                for (const disease in diseaseData[crop]) {
                    suggestions.push(`${crop} का ${disease}`);
                }
            }

            const suggestionText = 'मुझे आपकी समस्या समझने में थोड़ी परेशानी हो रही है। कृपया निम्न में से किसी समस्या के बारे में पूछें:<br>' +
                suggestions.map(s => `• ${s}`).join('<br>');

            addChatMessage(suggestionText, 'bot');
            speakResponse(suggestionText.replace(/<br>|<ul>|<li>|<\/ul>|<\/li>/g, ' '));
        }
    }, 1500);
}




function addChatMessage(text, sender) {
    const chatContainer = document.getElementById('chat-container');
    const messageDiv = document.createElement('div');
    messageDiv.className = 'chat-message ' + (sender === 'user' ? 'user-message' : 'bot-message');
    messageDiv.innerHTML = text;
    chatContainer.appendChild(messageDiv);
    chatContainer.scrollTop = chatContainer.scrollHeight;
}

function speakResponse(text) {
    if ('speechSynthesis' in window) {
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = 'hi-IN';
        
        // Find Hindi voice if available
        const voices = window.speechSynthesis.getVoices();
        const hindiVoice = voices.find(voice => voice.lang === 'hi-IN');
        if (hindiVoice) {
            utterance.voice = hindiVoice;
        }
        
        window.speechSynthesis.speak(utterance);
    }
}

// Load voices
window.speechSynthesis.onvoiceschanged = function() {
    window.speechSynthesis.getVoices();
};