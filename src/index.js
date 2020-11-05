import { axios } from '@bundled-es-modules/axios';

async function getQuote() {
    try {
        const proxyUrl = `https://cors-anywhere.herokuapp.com/`;
        const apiUrl = `http://api.forismatic.com/api/1.0/?method=getQuote&lang=en&format=json`;
        const { data } = await axios.get(proxyUrl + apiUrl);
        console.log(data);
    } catch (error) {
        getQuote();
        console.error(error);
    }
}

getQuote();