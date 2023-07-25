import express from 'express';
import axios from 'axios';
import cors from 'cors'
import cheerio from 'cheerio';


const app = express();
const PORT = 5000;


app.use(express.json());
app.use(express.urlencoded({
    extended: true
}));
app.use(cors())


app.post('/scrape', async (req, res) => {
    try {
        const {
            urls
        } = req.body

        const textPromises = urls.map(async (url) => {
            const response = await axios.get(url);
            const bodyText = extractTextFromHTML(response.data);
            return bodyText;
        });

        const textContents = await Promise.all(textPromises);


        res.json(textContents);
    } catch (error) {
        console.error('Error fetching data:', error.message);
        res.status(500).json({
            error: 'Error fetching data'
        });
    }
});


function extractTextFromHTML(html) {
    const $ = cheerio.load(html);
    const bodyText = $('body').text();
    return bodyText;
  }


app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
});