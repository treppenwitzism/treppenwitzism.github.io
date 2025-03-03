// Guestbook JavaScript file with Firebase integration and role icons
document.addEventListener('DOMContentLoaded', function() {
    // Get Firebase references from window objects (set by the script in HTML)
    const db = window.fbDb;
    const { collection, addDoc, getDocs, query, orderBy, limit, onSnapshot } = window.fbFirestore;
    
    const entriesCollectionRef = collection(db, 'guestbook-entries');
    const guestbookForm = document.getElementById('guestbookForm');
    const entriesContainer = document.getElementById('entries');
    
    // Define emails with special roles
    const roleEmails = {
        // Replace 'your-email@example.com' with your actual email
        '': { role: 'admin', label: 'Admin' },
        // Add more emails and roles as needed
        'carlozjeffersonsantiago@gmail.com': { role: 'mod', label: '💎' },
        'vip@example.com': { role: 'vip', label: 'VIP' }
    };
    
    // Load existing entries
    loadEntries();
    
    // Handle form submission
    guestbookForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const nameInput = document.getElementById('name');
        const emailInput = document.getElementById('email');
        const messageInput = document.getElementById('message');
        
        // Validate inputs
        if (!nameInput.value || !emailInput.value || !messageInput.value) {
            alert('Please fill out all fields');
            return;
        }
        
        // Create new entry
        const newEntry = {
            name: nameInput.value,
            email: emailInput.value,
            message: messageInput.value,
            date: new Date().toISOString()
        };
        
        // Add to Firebase
        saveEntry(newEntry);
        
        // Reset form
        guestbookForm.reset();
    });
    
    // Function to load entries from Firebase
    function loadEntries() {
        // Clear entries container
        entriesContainer.innerHTML = '<p class="loading">Loading messages...</p>';
        
        // Get entries from Firebase, ordered by date (newest first)
        const entriesQuery = query(entriesCollectionRef, orderBy('date', 'desc'), limit(50));
        
        getDocs(entriesQuery)
            .then((querySnapshot) => {
                entriesContainer.innerHTML = '';
                
                if (querySnapshot.empty) {
                    entriesContainer.innerHTML = '<p class="no-entries">No messages yet.</p>';
                    return;
                }
                
                // Add each entry to the DOM
                querySnapshot.forEach((doc) => {
                    const entry = doc.data();
                    addEntryToDOM(entry);
                });
            })
            .catch((error) => {
                console.error("Error loading entries: ", error);
                entriesContainer.innerHTML = '<p class="error">Error loading messages. Please try again later.</p>';
            });
    }
    
    // Function to save an entry to Firebase
    function saveEntry(entry) {
        // Add a loading state to the form
        const submitButton = guestbookForm.querySelector('button[type="submit"]');
        const originalButtonText = submitButton.textContent;
        submitButton.disabled = true;
        submitButton.textContent = 'Submitting...';
        
        // Add to Firebase
        addDoc(entriesCollectionRef, entry)
            .then(() => {
                // Add to DOM (at the beginning)
                addEntryToDOM(entry, true);
                
                // Reset button
                submitButton.disabled = false;
                submitButton.textContent = originalButtonText;
            })
            .catch((error) => {
                console.error("Error adding entry: ", error);
                alert('There was an error saving your message. Please try again.');
                
                // Reset button
                submitButton.disabled = false;
                submitButton.textContent = originalButtonText;
            });
    }
    
    // Function to add an entry to the DOM
    function addEntryToDOM(entry, isNew = false) {
        const entryElement = document.createElement('div');
        entryElement.classList.add('entry');
        
        // Format date for display
        const formattedDate = new Date(entry.date).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
        
        // Check if user has a special role
        const roleHTML = getUserRoleHTML(entry.email);
        
        entryElement.innerHTML = `
            <div class="entry-header">
                <div class="entry-name-container">
                    <span class="entry-name">${escapeHTML(entry.name)}</span>
                    ${roleHTML}
                </div>
                <span class="entry-date">${formattedDate}</span>
            </div>
            <div class="entry-message">${escapeHTML(entry.message)}</div>
        `;
        
        // If there's a "no entries" message, remove it
        const noEntriesMessage = entriesContainer.querySelector('.no-entries');
        if (noEntriesMessage) {
            entriesContainer.removeChild(noEntriesMessage);
        }
        
        // Add to the beginning of the entries container if it's a new entry
        if (isNew) {
            entriesContainer.insertBefore(entryElement, entriesContainer.firstChild);
        } else {
            entriesContainer.appendChild(entryElement);
        }
        
        // Add animation
        entryElement.style.opacity = '0';
        entryElement.style.transform = 'translateY(20px)';
        
        setTimeout(() => {
            entryElement.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
            entryElement.style.opacity = '1';
            entryElement.style.transform = 'translateY(0)';
        }, 10);
    }
    
    // Function to get role HTML based on email
    function getUserRoleHTML(email) {
        if (roleEmails[email]) {
            const role = roleEmails[email];
            return `<span class="role-icon role-${role.role}">${role.label}</span>`;
        }
        return '';
    }
    
    // Setup real-time updates for new entries
    function setupRealTimeUpdates() {
        const realtimeQuery = query(entriesCollectionRef, orderBy('date', 'desc'));
        
        onSnapshot(realtimeQuery, (snapshot) => {
            snapshot.docChanges().forEach((change) => {
                if (change.type === "added") {
                    // Check if this is a completely new entry (not from initial load)
                    const newEntryData = change.doc.data();
                    const entryTimestamp = new Date(newEntryData.date).getTime();
                    const currentTimestamp = new Date().getTime();
                    
                    // If entry is less than 10 seconds old and not already in the DOM, add it
                    if (currentTimestamp - entryTimestamp < 10000) {
                        const existingEntries = entriesContainer.querySelectorAll('.entry');
                        let isAlreadyInDOM = false;
                        
                        existingEntries.forEach(entry => {
                            const entryName = entry.querySelector('.entry-name').textContent;
                            const entryMessage = entry.querySelector('.entry-message').textContent;
                            
                            if (entryName === newEntryData.name && entryMessage === newEntryData.message) {
                                isAlreadyInDOM = true;
                            }
                        });
                        
                        if (!isAlreadyInDOM) {
                            addEntryToDOM(newEntryData, true);
                        }
                    }
                }
            });
        });
    }
    
    // Start real-time updates
    setupRealTimeUpdates();
    
    // Utility function to escape HTML to prevent XSS
    function escapeHTML(str) {
        return str
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#039;');
    }
});