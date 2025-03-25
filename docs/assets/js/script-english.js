// Voice recognition functionality
document.getElementById('recordButton').addEventListener('click', function() {
    this.classList.toggle('recording');
    if (this.classList.contains('recording')) {
        document.getElementById('status').textContent = 'Listening...';
        startVoiceRecognition();
    } else {
        document.getElementById('status').textContent = 'Stopped';
        stopVoiceRecognition();
    }
});

const diseaseData = {
    "Rice": {
        "Blast": {
            "response": "Rice blast disease may be present. This is caused by a fungus called 'Magnaporthe oryzae'. Symptoms include brown spots on leaves that expand over time.<br><br>Treatment:<br>1. Spray Tricyclazole 75% WP @ 0.6g/L of water<br>2. Spray Propiconazole 25% EC @ 1ml/L of water<br>3. Spray Carbendazim 50% WP @ 1g/L of water"
        },
        "Blight": {
            "response": "Rice blight is a serious disease that can destroy the entire crop.<br><br>Control Measures:<br>1. Use resistant varieties<br>2. Maintain balanced nitrogen fertilizer usage<br>3. Manage water levels properly<br>4. Spray Tricyclazole or Isoprothiolane"
        }
    },
    "Wheat": {
        "Rust": {
            "response": "Wheat rust disease can be of three types: leaf rust, stem rust, and yellow rust.<br><br>Control Measures:<br>1. Spray Propiconazole 25% EC @ 1ml/L of water<br>2. Spray Tebuconazole 25.9% EC @ 1ml/L of water<br>3. Select resistant varieties for the next season"
        },
        "Karnal Bunt": {
            "response": "Karnal bunt is a fungal disease that reduces grain quality.<br><br>Control Measures:<br>1. Use certified seeds<br>2. Treat seeds with Carbendazim @ 2g/kg of seed<br>3. Follow crop rotation (growing different crops each year)<br>4. Avoid irrigation in affected areas"
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
        alert('Please enter your problem');
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

            setTimeout(function() {
                addChatMessage('Identifying the disease...', 'bot');

                setTimeout(function() {
                    const response = 'The image shows signs of rice blast disease. This fungal disease affects leaves, stems, and grains. To control this disease:' +
                        '<ul>' +
                        '<li>Spray Tricyclazole or Isoprothiolane</li>' +
                        '<li>Use resistant varieties in the next crop cycle</li>' +
                        '<li>Maintain balanced nitrogen fertilizer usage</li>' +
                        '</ul>';
                    addChatMessage(response, 'bot');
                }, 2000);
            }, 1000);
        };
        reader.readAsDataURL(file);
    }
});

function processTextInput(text) {
    addChatMessage(text, 'user');
    simulateResponse(text);
}

// Voice recognition implementation
let recognition;

function startVoiceRecognition() {
    if (!('webkitSpeechRecognition' in window)) {
        alert('This browser does not support voice recognition. Please use Chrome or a modern browser.');
        return;
    }

    recognition = new webkitSpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = true;
    recognition.lang = 'en-US';

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

    recognition.start();
}

function stopVoiceRecognition() {
    if (recognition) {
        recognition.stop();
    }
}

function processVoiceInput(text) {
    addChatMessage(text, 'user');
    simulateResponse(text);
}

function simulateResponse(query) {
    const lowerQuery = query.toLowerCase();
    addChatMessage('Thinking about your problem...', 'bot');

    setTimeout(() => {
        let found = false;
        for (const crop in diseaseData) {
            if (lowerQuery.includes(crop.toLowerCase())) {
                for (const disease in diseaseData[crop]) {
                    if (lowerQuery.includes(disease.toLowerCase())) {
                        addChatMessage(diseaseData[crop][disease].response, 'bot');
                        found = true;
                        break;
                    }
                }
            }
            if (found) break;
        }

        if (!found) {
            let suggestions = [];
            for (const crop in diseaseData) {
                for (const disease in diseaseData[crop]) {
                    suggestions.push(`${crop} ${disease}`);
                }
            }

            const suggestionText = 'I am having trouble understanding your problem. Please ask about one of the following issues:<br>' +
                suggestions.map(s => `• ${s}`).join('<br>');

            addChatMessage(suggestionText, 'bot');
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
