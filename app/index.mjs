import axios from 'axios';
import express from 'express';
import jsdom from 'jsdom';
const { JSDOM } = jsdom;

const app = express();

app.get('/', (req, res) => {
  res.send('Up and running');
});

const getBeer = () => {
  console.log('Getting beer...');
  axios.get('http://www.biergartl-linz.at/')
    .then((response) => {
      const dom = new JSDOM(response.data);
      console.log('Got beer!');
      const openingHours = dom.window.document.querySelector('#Geöffnet-oder-Geschlossen p').textContent;
      console.log(openingHours);
      res.send(openingHours);
    })
    .catch((error) => {
      console.log(error);
      res.send('Fuck this day, no bier, no gartl... </3');
    });
}

app.get('/bier', getBeer);

app.listen(process.env.PORT || 8000, () => {
  console.log(`Server started on port ${process.env.PORT || 8000}`);
  getBeer();
});
