import express from 'express'
import * as dotenv from 'dotenv'
import cors from 'cors'
import { Configuration, OpenAIApi } from 'openai'

dotenv.config()

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});

const openai = new OpenAIApi(configuration);

const app = express();
app.use(cors());
app.use(express.json());

//receives a lot of data from frontend
app.get('/', async (req, res) => {
  res.status(200).send({
    message: 'Greetings and Salutations, friend!'
  })
})
 //allows us to have a body/payload - gets data from body of frontend request
app.post('/', async (req, res) => {
  try {
    const prompt = req.body.prompt;

    const response = await openai.createCompletion({
      model: "text-davinci-003",
      prompt: `${prompt}`,
      temperature: 0, // higher values means the model will take more risks.
      max_tokens: 3000, // the maximum # of tokens to generate in the completion, which means longer responses
      top_p: 1, // alternative to sampling with temperature, called nucleus sampling
      frequency_penalty: 0.5, // # between -2.0 and 2.0. Positive # decreases the model's likelihood to repeat similar sentences often.
      presence_penalty: 0, // # between -2.0 and 2.0. Positive values penalize new tokens based on whether they appear in the text so far, increasing the model's likelihood to talk about new topics.
    });

    //sends answer back to frontend
    res.status(200).send({
      bot: response.data.choices[0].text
    });

  } catch (error) {
    console.log(error);
    res.status(500).send({ error });
  }
})

//makes sure server always listen to request
app.listen(5000, () => console.log('Server is running on http://localhost:5000'));