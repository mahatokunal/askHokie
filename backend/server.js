const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const axios = require('axios');  // Import axios to make HTTP requests

const app = express();
app.use(bodyParser.json());
app.use(cors({
  origin: 'http://localhost:3000'  // Allow requests from the frontend
}));

// Endpoint to handle chat requests
app.post('/ask', async (req, res) => {
  const question = req.body.question;

  try {
    // Send the question to the FastAPI backend (Python service)
    const fastApiResponse = await axios.post('http://localhost:8000/query', { query: question });

    // Return the response from FastAPI to the client
    const answer = fastApiResponse.data.response;
    res.json({ answer });
  } catch (error) {
    console.error("Error communicating with FastAPI backend:", error);
    res.status(500).json({ error: "Error communicating with backend service" });
  }
});

app.listen(5001, () => {
  console.log('Server is running on port 5001');
});
