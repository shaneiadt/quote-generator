import { axios } from '@bundled-es-modules/axios';
import { xmlToJson } from './xmlToJson';

const quoteContainer = document.querySelector('.quote-container');
const quote = document.querySelector('#quote');
const author = document.querySelector('#author');
const twitterBtn = document.querySelector('#twitter');
const newQuoteBtn = document.querySelector('#new-quote');
const loader = document.querySelector('#loader');

const apiUrl = `http://api.forismatic.com/api/1.0/?method=getQuote&lang=en&format=json`;
let calls = 0;
let delayFunctionCall = setTimeout(getQuote, 2000);

async function getQuote() {
    calls++;

    try {
        const proxyUrl = `https://api.allorigins.win/get?url=${encodeURIComponent(apiUrl)}`;
        const { data } = await axios.get(proxyUrl + apiUrl);

        clearTimeout(delayFunctionCall);

        const XmlNode = new DOMParser().parseFromString(data.contents, 'text/xml');
        const json = xmlToJson(XmlNode);

        const { forismatic: { quote: { quoteAuthor, quoteText, quoteLink } } } = json;

        quote.textContent = quoteText;
        author.textContent = typeof quoteAuthor != 'string' ? 'Unknown' : quoteAuthor;

        loader.style.display = 'none';
        quoteContainer.style.display = 'block';

        if (quoteText.length > 120) {
            quote.classList.add('long-quote');
        } else {
            quote.classList.remove('long-quote');
        }
    } catch (error) {
        // allow a max number of network requests calls
        if (calls >= 5) {
            clearTimeout(delayFunctionCall);
        } else {
            delayFunctionCall = setTimeout(getQuote, 2000);
        }
        console.error(error);
    }
}

function newQuote() {
    loader.style.display = 'block';
    quoteContainer.style.display = 'none';
    delayFunctionCall = setTimeout(getQuote, 2000);
}

function tweet() {
    window.open(`https://twitter.com/intent/tweet?text=${quote.textContent} - ${author.textContent}`, '_blank');
}

newQuoteBtn.addEventListener('click', newQuote);
twitterBtn.addEventListener('click', tweet);