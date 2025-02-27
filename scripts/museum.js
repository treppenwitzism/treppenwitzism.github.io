// Museum JavaScript file
document.addEventListener('DOMContentLoaded', function() {
    // Add animation to gallery items
    const galleryItems = document.querySelectorAll('.gallery-item');
    
    if (galleryItems.length > 0) {
        // Apply animations to gallery items if we're on a date page
        galleryItems.forEach((item, index) => {
            // Add a slight delay to each item for a staggered effect
            const delay = index * 150;
            item.style.opacity = '0';
            item.style.transform = 'translateY(20px)';
            item.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
            
            setTimeout(() => {
                item.style.opacity = '1';
                item.style.transform = 'translateY(0)';
            }, delay);
        });
    }
    
    // Add animation to date items on the main museum page
    const dateItems = document.querySelectorAll('.date-item');
    
    if (dateItems.length > 0) {
        // Apply animations to date items if we're on the main museum page
        dateItems.forEach((item, index) => {
            // Add a slight delay to each item for a staggered effect
            const delay = index * 100;
            item.style.opacity = '0';
            item.style.transform = 'translateY(20px)';
            item.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
            
            setTimeout(() => {
                item.style.opacity = '1';
                item.style.transform = 'translateY(0)';
            }, delay);
        });
    }
    
    // If on a date page, add smooth scrolling to gallery items
    if (window.location.pathname.includes('/museum/')) {
        // Smooth scroll to gallery when clicking on gallery navigation
        const galleryLinks = document.querySelectorAll('a[href^="#gallery-"]');
        
        galleryLinks.forEach(link => {
            link.addEventListener('click', function(e) {
                e.preventDefault();
                const targetId = this.getAttribute('href');
                const targetElement = document.querySelector(targetId);
                
                if (targetElement) {
                    window.scrollTo({
                        top: targetElement.offsetTop - 100,
                        behavior: 'smooth'
                    });
                }
            });
        });
    }
});