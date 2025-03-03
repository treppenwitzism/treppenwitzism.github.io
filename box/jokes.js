document.addEventListener('DOMContentLoaded', () => {
    const jokeText = document.getElementById('jokeText');
    const fetchJokeBtn = document.getElementById('fetchJoke');
    const jokeBox = document.querySelector('.joke-box');
    
    // Function to fetch a random dad joke
    async function fetchDadJoke() {
        try {
            // Add loading state
            jokeBox.classList.add('loading');
            jokeText.textContent = 'Loading a dad joke...';
            
            // Using the icanhazdadjoke API
            const response = await fetch('https://icanhazdadjoke.com/', {
                headers: {
                    'Accept': 'application/json'
                }
            });
            
            const data = await response.json();
            
            if (data && data.joke) {
                // Update the joke text
                jokeText.textContent = data.joke;
            } else {
                jokeText.textContent = 'Failed to fetch a joke. Try again?';
            }
            
            // Remove loading state
            jokeBox.classList.remove('loading');
            
        } catch (error) {
            console.error('Error fetching dad joke:', error);
            jokeText.textContent = 'Failed to fetch a joke. Try again?';
            jokeBox.classList.remove('loading');
        }
    }
    
    // Fetch a joke when button is clicked
    fetchJokeBtn.addEventListener('click', fetchDadJoke);
    
    // Fetch a joke when page loads
    fetchDadJoke();
});