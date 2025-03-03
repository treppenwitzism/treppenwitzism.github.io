document.addEventListener('DOMContentLoaded', () => {
    const catImage = document.getElementById('catImage');
    const fetchCatBtn = document.getElementById('fetchCat');
    const catBox = document.querySelector('.cat-box');
    
    // Function to fetch a random cat image
    async function fetchCatImage() {
        try {
            // Add loading state
            catBox.classList.add('loading');
            catImage.style.display = 'none';
            
            // Using The Cat API (free, no API key required for basic use)
            const response = await fetch('https://api.thecatapi.com/v1/images/search');
            const data = await response.json();
            
            if (data && data.length > 0) {
                // Update the image source
                catImage.src = data[0].url;
                catImage.onload = function() {
                    // Remove loading state once image is loaded
                    catBox.classList.remove('loading');
                    catImage.style.display = 'block';
                    
                    // Resize the container to fit the image better
                    const imgRatio = this.naturalHeight / this.naturalWidth;
                    const containerWidth = catBox.clientWidth;
                    const idealHeight = containerWidth * imgRatio;
                    
                    // Don't let it get too tall
                    const maxHeight = window.innerHeight * 0.6;
                    const newHeight = Math.min(idealHeight, maxHeight);
                    
                    // Only set height if it's a reasonable value
                    if (newHeight > 100) {
                        catBox.style.height = `${newHeight}px`;
                    }
                };
            }
        } catch (error) {
            console.error('Error fetching cat image:', error);
            catBox.classList.remove('loading');
            catBox.innerHTML = '<p>Failed to fetch cat image. Please try again.</p>';
        }
    }
    
    // Fetch a cat image when button is clicked
    fetchCatBtn.addEventListener('click', fetchCatImage);
    
    // Fetch a cat image when page loads
    fetchCatImage();
    
    // Reset box height when window is resized
    window.addEventListener('resize', () => {
        if (catImage.complete) {
            const imgRatio = catImage.naturalHeight / catImage.naturalWidth;
            const containerWidth = catBox.clientWidth;
            const idealHeight = containerWidth * imgRatio;
            const maxHeight = window.innerHeight * 0.6;
            const newHeight = Math.min(idealHeight, maxHeight);
            
            if (newHeight > 100) {
                catBox.style.height = `${newHeight}px`;
            }
        }
    });
});