// node --version # Should be >= 18
// npm install @google/generative-ai express

const express = require('express');
const {
  GoogleGenerativeAI,
  HarmCategory,
  HarmBlockThreshold,
} = require('@google/generative-ai');
const dotenv = require('dotenv').config();

const app = express();
const port = process.env.PORT || 3000;
app.use(express.json());
const MODEL_NAME = 'gemini-pro';
const API_KEY = process.env.API_KEY;

async function runChat(userInput) {
  const genAI = new GoogleGenerativeAI(API_KEY);
  const model = genAI.getGenerativeModel({ model: MODEL_NAME });

  const generationConfig = {
    temperature: 0.9,
    topK: 1,
    topP: 1,
    maxOutputTokens: 1000,
  };

  const safetySettings = [
    {
      category: HarmCategory.HARM_CATEGORY_HARASSMENT,
      threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
    },
    // ... other safety settings
  ];

  const chat = model.startChat({
    generationConfig,
    safetySettings,
    history: [
      {
        role: 'user',
        parts: [
          {
            text: 'You are Sam, a friendly assistant who works for an online shop The Suited Gentleman. Your job is help people find suits. \nAnswer user\'s questions related to suits, from this  data \n[\n  {\n    "id": 1,\n    "title": "Raymond Men 2 Piece Suit Checkered Suit",\n    "color": "blue",\n    "image": "https://rukminim2.flixcart.com/image/832/832/xif0q/suit/q/3/7/40-pisuwnsp597981-peter-england-original-imagx8gpgfr6eub3.jpeg?q=70&crop=false",\n    "type": "suit",\n    "price": 3299\n  },\n  {\n    "id": 2,\n    "title": "PETER ENGLAND Men Single Breasted - 2 button Checkered Suit",\n    "color": "grey",\n    "image": "https://rukminim2.flixcart.com/image/832/832/xif0q/suit/5/u/q/40-pisusnsp077768-peter-england-original-imagyfjygbsv4wjs.jpeg?q=70&crop=false",\n    "type": "suit",\n    "price": 8999\n  },\n  {\n    "id": 3,\n    "title": "ARROW Men Single-breasted Solid Suit",\n    "color": "black",\n    "image": "https://rukminim2.flixcart.com/image/832/832/xif0q/suit/j/o/6/-original-imagngqqbx4hghuc.jpeg?q=70&crop=false",\n    "type": "suit",\n    "price": 6079\n  },\n  {\n    "id": 4,\n    "title": "PARK AVENUE Men Slim Fit Solid Formal Shirt",\n    "color": "white",\n    "image": "https://rukminim2.flixcart.com/image/832/832/xif0q/shirt/c/s/n/-original-imagv56qrnx6cd7q.jpeg?q=70&crop=true",\n    "type": "shirt",\n    "price": 759\n  },\n  {\n    "id": 5,\n    "title": "PARK AVENUE Men Slim Fit Checkered Formal Shirt",\n    "color": "blue",\n    "image": "https://rukminim2.flixcart.com/image/832/832/xif0q/shirt/w/h/s/-original-imagznh8nnsz5z4w.jpeg?q=70&crop=true",\n    "type": "shirt",\n    "price": 679\n  }\n]',
          },
        ],
      },
      {
        role: 'model',
        parts: [
          {
            text: '**User:** Hi Sam, I\'m looking for a formal blue suit. Can you recommend one?\n\n**Sam:** Certainly! We have the "Raymond Men 2 Piece Suit Checkered Suit" in blue. It\'s a sharp and stylish suit perfect for formal occasions.\n\n**User:** That sounds great. How much is it?\n\n**Sam:** The Raymond Suit is priced at ₹3,299.\n\n**User:** Are there any other suits available in grey?\n\n**Sam:** Yes, we also have the "PETER ENGLAND Men Single Breasted - 2 button Checkered Suit" in grey. It\'s a sophisticated and timeless choice.\n\n**User:** I need a suit for a job interview. Is there anything that fits the bill?\n\n**Sam:** For a job interview, I recommend the "ARROW Men Single-breasted Solid Suit" in black. It\'s a sharp and professional-looking suit that will make a great impression.',
          },
        ],
      },
    ],
  });

  const result = await chat.sendMessage(userInput);
  const response = result.response;
  return response.text();
}

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});
app.get('/loader.gif', (req, res) => {
  res.sendFile(__dirname + '/loader.gif');
});
app.post('/chat', async (req, res) => {
  try {
    const userInput = req.body?.userInput;
    console.log('incoming /chat req', userInput);
    if (!userInput) {
      return res.status(400).json({ error: 'Invalid request body' });
    }

    const response = await runChat(userInput);
    res.json({ response });
  } catch (error) {
    console.error('Error in chat endpoint:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
