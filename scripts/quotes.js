// Quotes data
const quotes = [
    {
        text: "If her age is on the clock, she's ready for the—",
        author: "Garry Edicto"
    },
    {
        text: "Next na kita nyo sakin, nasa kulungan na ko.",
        author : "Clemence Valdez"
    },
    {
        text: "Magiging elementary teacher ako, kasi gusto ko ng—",
        author: "Jaimes Oreto"
    },
    {
        text: "Pano pag nakita ang panty ko?",
        author: "Clemence Valdez"
    }
];

function loadRandomQuote() {
    const randomIndex = Math.floor(Math.random() * quotes.length);
    const quote = quotes[randomIndex];
    
    document.getElementById('randomQuote').textContent = `"${quote.text}"`;
    document.getElementById('quoteAuthor').textContent = quote.author;
}

document.addEventListener('DOMContentLoaded', loadRandomQuote);

setInterval(loadRandomQuote, 30000);