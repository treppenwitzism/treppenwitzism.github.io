// Quotes data
const quotes = [
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
    },
    {
        text: "Violence doesn't solve all of your problems, but it solves most of the problem",
        author: "Allen Prado"
    },
    {
        text: "Pahipo ule.",
        author: "Kenxin Maranan"
    },
    {
        text: "Wet look ka sakin mamaya.",
        author: "Jaimes Oreto"
    },
    {
        text: "Papasukin din kita <3.",
        author: "Garry Edicto"
    },
    {
        text: "Uungol na naman to, antahimik eh.",
        author: "Ace Castilla"
    },
    {
        text: "Kokola ko che kia samnida.",
        author: "Jaimes Oreto"
    },
    {
        text: "Jaimes patingin nga ako ng ass mo.",
        author: "Kenxin Maranan"
    },
    {
        text: "Pilot section ka pa naman tapos hindi ka nagsasabon ng puwit.",
        author: "Kenxin Maranan"
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