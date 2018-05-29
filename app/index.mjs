import axios from 'axios';
import dotenv from 'dotenv';
import express from 'express';
import jsdom from 'jsdom';
const { JSDOM } = jsdom;

const app = express();
if (process.env.NODE_ENV !== 'production') {
  dotenv.config();
}

app.get('/', (req, res) => {
  res.send('Up and running');
});

const postSlackMessage = msg => {
  axios.post(process.env.SLACK_HOOK, {
      'text': `${msg} :beers:`
    })
    .then((response) => {
      console.log('Sent beer to slack!');
    })
    .catch((error) => {
      console.log(error);
    });
};

const getBeer = (req, res) => {
  console.log('Getting beer...');
  axios.get('http://www.biergartl-linz.at/')
    .then((response) => {
      const dom = new JSDOM(response.data);
      console.log('Got beer!');
      const openingHours = dom.window.document.querySelector('#Geöffnet-oder-Geschlossen p').textContent;
      console.log(openingHours);
      postSlackMessage(openingHours);
      res.send(openingHours);
    })
    .catch((error) => {
      console.log(error);
      res.send('Fuck this day, no bier, no gartl... </3');
    });
};

app.get('/bier', getBeer);

app.listen(process.env.PORT || 8000, () => {
  console.log(`Server started on port ${process.env.PORT || 8000}`);
  getBeer();
});
