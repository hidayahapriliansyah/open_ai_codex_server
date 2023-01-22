import express from 'express';
import * as dotenv from 'dotenv';
import cors from 'cors';
import { Configuration, OpenAIApi } from 'openai';

dotenv.config();

console.log(process.env.OPENAI_API_KEY);

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});

// instansiasi objek openaiapi wajib menggunakan argumen objek instance dari configuration openai
const openai = new OpenAIApi(configuration);

const app = express();
app.use(cors());
// to pass json from front end to backend. idk  what it is meant exactly but il try
app.use(express.json());

app.get('/', async (req, res) => {
  res.status(200).send({
    message: 'Hello from Codex',
  });
});

app.post('/', async (req, res) => {
  try {
    const prompt = req.body.prompt;
    console.log(prompt);
    const response = await openai.createCompletion({
      model: "text-davinci-003",
      prompt: `${prompt}`,
      // temperature mengatur seberapa besar resiko yang akan dijawab oleh open ai,
      // semakin tinggi, si open ai akan memfilter lebih banyak jawaban
      temperature: 0,
      // maximum character output
      max_tokens: 300,
      top_p: 1,
      // frequency_penalty berarti seberapa sering ngulang jawaban yang sama
      frequency_penalty: 0.5,
      presence_penalty: 0,
    });

    res.status(200).send({
      bot: response.data.choices[0].text
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({ error });
  }
});

app.listen(5000, () => {
  console.log('Server is running on http://localhost:5000');
});