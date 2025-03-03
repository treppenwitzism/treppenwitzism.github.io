document.addEventListener('DOMContentLoaded', () => {
    const dogImage = document.getElementById('dogImage');
    const fetchDogBtn = document.getElementById('fetchDog');
    const dogBox = document.querySelector('.dog-box');
    
    // Function to fetch a random dog image
    async function fetchDogImage() {
        try {
            // Add loading state
            dogBox.classList.add('loading');
            dogImage.style.display = 'none';
            
            // Using the Dog API (free, no API key required for basic use)
            const response = await fetch('https://dog.ceo/api/breeds/image/random');
            const data = await response.json();
            
            if (data && data.status === 'success') {
                // Update the image source
                dogImage.src = data.message;
                dogImage.onload = function() {
                    // Remove loading state once image is loaded
                    dogBox.classList.remove('loading');
                    dogImage.style.display = 'block';
                    
                    // Resize the container to fit the image better
                    const imgRatio = this.naturalHeight / this.naturalWidth;
                    const containerWidth = dogBox.clientWidth;
                    const idealHeight = containerWidth * imgRatio;
                    
                    // Don't let it get too tall
                    const maxHeight = window.innerHeight * 0.6;
                    const newHeight = Math.min(idealHeight, maxHeight);
                    
                    // Only set height if it's a reasonable value
                    if (newHeight > 100) {
                        dogBox.style.height = `${newHeight}px`;
                    }
                };
            }
        } catch (error) {
            console.error('Error fetching dog image:', error);
            dogBox.classList.remove('loading');
            dogBox.innerHTML = '<p>Failed to fetch dog image. Please try again.</p>';
        }
    }
    
    // Fetch a dog image when button is clicked
    fetchDogBtn.addEventListener('click', fetchDogImage);
    
    // Fetch a dog image when page loads
    fetchDogImage();
    
    // Reset box height when window is resized
    window.addEventListener('resize', () => {
        if (dogImage.complete) {
            const imgRatio = dogImage.naturalHeight / dogImage.naturalWidth;
            const containerWidth = dogBox.clientWidth;
            const idealHeight = containerWidth * imgRatio;
            const maxHeight = window.innerHeight * 0.6;
            const newHeight = Math.min(idealHeight, maxHeight);
            
            if (newHeight > 100) {
                dogBox.style.height = `${newHeight}px`;
            }
        }
    });
});