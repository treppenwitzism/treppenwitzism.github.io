// Quotes data
const quotes = [
    {
        text: "If her age is on the clock, she's ready for the—",
        author: "Garry Edicto"
    }
];

// Function to load a random quote
function loadRandomQuote() {
    const randomIndex = Math.floor(Math.random() * quotes.length);
    const quote = quotes[randomIndex];
    
    document.getElementById('randomQuote').textContent = `"${quote.text}"`;
    document.getElementById('quoteAuthor').textContent = quote.author;
}

// Load a random quote when the page loads
document.addEventListener('DOMContentLoaded', loadRandomQuote);

// Change quote every 30 seconds
setInterval(loadRandomQuote, 30000);