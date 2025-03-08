document.addEventListener('DOMContentLoaded', function() {
    // Firebase configuration - replace with your own!
    const firebaseConfig = {
        // Add your Firebase configuration here
        apiKey: "AIzaSyD5_kerSrGxIB6xH9Wi3ImmGM7ioDPdQQE",
        authDomain: "hg6-guestbook.firebaseapp.com",
        databaseURL: "https://hg6-guestbook-default-rtdb.asia-southeast1.firebasedatabase.app",
        projectId: "hg6-guestbook",
        storageBucket: "hg6-guestbook.firebasestorage.app",
        messagingSenderId: "72505894008",
        appId: "1:72505894008:web:aed46158971e27d1a1798d",
    };
    
    // Initialize Firebase
    firebase.initializeApp(firebaseConfig);
    
    // DOM Elements
    const authContainer = document.getElementById('auth-container');
    const clickerSection = document.getElementById('clicker-section');
    const signInForm = document.getElementById('sign-in-form');
    const signOutBtn = document.getElementById('sign-out-btn');
    const clickerBtn = document.getElementById('clicker-btn');
    const playerNameDisplay = document.getElementById('player-name');
    const playerScoreDisplay = document.getElementById('player-score');
    const playerTitleDisplay = document.getElementById('player-title');
    const playerTitlesContainer = document.getElementById('player-titles');
    const leaderboardBody = document.getElementById('leaderboard-body');
    
    // Title info popup elements
    const titlesInfoBtn = document.getElementById('titles-info-btn');
    const titlesInfoPopup = document.getElementById('titles-info-popup');
    const closePopupBtn = document.getElementById('close-popup-btn');

    // Current player data
    let currentPlayer = {
        uid: null,
        email: null,
        name: null,
        score: 0,
        titles: [],
        currentTitle: null
    };
    
    // Title milestones
    const titleMilestones = [
        { score: 10, title: "Novice Noodler" },
        { score: 50, title: "Bronze Beater" },
        { score: 100, title: "Silver Stroker" },
        { score: 250, title: "Gold Grinder" },
        { score: 500, title: "Platinum Lubricator" },
        { score: 1000, title: "Diamond Gooner" },
        { score: 2500, title: "Master Edger" },
        { score: 5000, title: "Grandmaster Grip" },
        { score: 10000, title: "Mythic Wanker" },
        { score: 25000, title: "Ambatubasss" }
    ];

    // Handle title info popup
    titlesInfoBtn.addEventListener('click', function() {
        titlesInfoPopup.style.display = 'flex';
    });
    
    closePopupBtn.addEventListener('click', function() {
        titlesInfoPopup.style.display = 'none';
    });
    
    // Close popup when clicking outside
    titlesInfoPopup.addEventListener('click', function(e) {
        if (e.target === titlesInfoPopup) {
            titlesInfoPopup.style.display = 'none';
        }
    });
    
    // Handle sign in form submission
    signInForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const email = document.getElementById('email').value;
        const name = document.getElementById('name').value;
        
        // Simple authentication (in a real app, use proper Firebase Auth)
        const uid = btoa(email).replace(/=/g, ''); // Simple UID generation
        
        // Store user in Firebase
        firebase.database().ref('users/' + uid).once('value')
            .then((snapshot) => {
                if (snapshot.exists()) {
                    // User exists, load their data
                    const userData = snapshot.val();
                    currentPlayer = {
                        uid: uid,
                        email: email,
                        name: userData.name,
                        score: userData.score || 0,
                        titles: userData.titles || [],
                        currentTitle: userData.currentTitle || null
                    };
                } else {
                    // Create new user
                    currentPlayer = {
                        uid: uid,
                        email: email,
                        name: name,
                        score: 0,
                        titles: [],
                        currentTitle: null
                    };
                    
                    // Save to Firebase
                    firebase.database().ref('users/' + uid).set({
                        name: name,
                        score: 0,
                        titles: [],
                        currentTitle: null
                    });
                }
                
                // Show game
                showGameInterface();
                
                // Update leaderboard
                updateLeaderboard();
            })
            .catch((error) => {
                console.error("Error checking user:", error);
                alert("An error occurred. Please try again.");
            });
    });
    
    // Handle sign out
    signOutBtn.addEventListener('click', function() {
        currentPlayer = {
            uid: null,
            email: null,
            name: null,
            score: 0,
            titles: [],
            currentTitle: null
        };
        hideGameInterface();
    });
    
    // Handle clicking the +1 button
    clickerBtn.addEventListener('click', function() {
        if (!currentPlayer.uid) return;
        
        // Add ripple effect
        clickerBtn.classList.add('clicked');
        setTimeout(() => {
            clickerBtn.classList.remove('clicked');
        }, 600);
        
        // Increment score
        currentPlayer.score++;
        playerScoreDisplay.textContent = currentPlayer.score;
        
        // Check for new titles
        checkForNewTitles();
        
        // Update in Firebase
        const updates = {};
        updates['/users/' + currentPlayer.uid + '/score'] = currentPlayer.score;
        updates['/users/' + currentPlayer.uid + '/titles'] = currentPlayer.titles;
        updates['/users/' + currentPlayer.uid + '/currentTitle'] = currentPlayer.currentTitle;
        
        firebase.database().ref().update(updates)
            .then(() => {
                // Update leaderboard periodically (not on every click for performance)
                if (currentPlayer.score % 5 === 0) {
                    updateLeaderboard();
                }
            })
            .catch((error) => {
                console.error("Error updating score:", error);
            });
    });
    
    // Check for new titles based on score
    function checkForNewTitles() {
        for (const milestone of titleMilestones) {
            if (currentPlayer.score >= milestone.score && !currentPlayer.titles.includes(milestone.title)) {
                // Add new title
                currentPlayer.titles.push(milestone.title);
                
                // Set as current title (highest achieved)
                currentPlayer.currentTitle = milestone.title;
                playerTitleDisplay.textContent = milestone.title;
                
                // Update titles display
                updateTitlesDisplay();
                
                // Show notification
                showTitleNotification(milestone.title);
            }
        }
    }
    
    // Update the display of earned titles
    function updateTitlesDisplay() {
        if (currentPlayer.titles.length === 0) {
            playerTitlesContainer.innerHTML = '<p class="no-titles">Keep clicking to earn titles!</p>';
            return;
        }
        
        playerTitlesContainer.innerHTML = '';
        currentPlayer.titles.forEach(title => {
            const titleElement = document.createElement('div');
            titleElement.className = 'title-badge';
            titleElement.textContent = title;
            
            // Highlight current title
            if (title === currentPlayer.currentTitle) {
                titleElement.style.backgroundColor = 'rgba(0, 255, 102, 0.4)';
                titleElement.style.fontWeight = 'bold';
            }
            
            // Allow changing current title
            titleElement.addEventListener('click', () => {
                currentPlayer.currentTitle = title;
                playerTitleDisplay.textContent = title;
                updateTitlesDisplay();
                
                // Update in Firebase
                firebase.database().ref('users/' + currentPlayer.uid).update({
                    currentTitle: title
                });
                
                // Update leaderboard to show new title
                updateLeaderboard();
            });
            
            playerTitlesContainer.appendChild(titleElement);
        });
    }
    
    // Show notification when a new title is earned
    function showTitleNotification(title) {
        const notification = document.createElement('div');
        notification.className = 'title-notification';
        notification.innerHTML = `
            <div class="notification-content">
                <h3>New Title Earned!</h3>
                <p>${title}</p>
            </div>
        `;
        document.body.appendChild(notification);
        
        // Animation
        setTimeout(() => {
            notification.classList.add('show');
        }, 100);
        
        // Remove after a delay
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => {
                document.body.removeChild(notification);
            }, 500);
        }, 3000);
    }
    
    // Update the leaderboard
    function updateLeaderboard() {
        firebase.database().ref('users').orderByChild('score').limitToLast(20).once('value')
            .then((snapshot) => {
                const users = [];
                snapshot.forEach((childSnapshot) => {
                    const userData = childSnapshot.val();
                    users.push({
                        uid: childSnapshot.key,
                        name: userData.name,
                        score: userData.score || 0,
                        currentTitle: userData.currentTitle || null
                    });
                });
                
                // Sort by score (descending)
                users.sort((a, b) => b.score - a.score);
                
                // Render leaderboard
                leaderboardBody.innerHTML = '';
                users.forEach((user, index) => {
                    const row = document.createElement('tr');
                    if (user.uid === currentPlayer.uid) {
                        row.className = 'user-row';
                    }
                    
                    row.innerHTML = `
                        <td>${index + 1}</td>
                        <td>${user.name} ${user.currentTitle ? `<span class="player-title">${user.currentTitle}</span>` : ''}</td>
                        <td>${user.score}</td>
                    `;
                    
                    leaderboardBody.appendChild(row);
                });
            })
            .catch((error) => {
                console.error("Error updating leaderboard:", error);
            });
    }
    
    // Show game interface
    function showGameInterface() {
        clickerSection.classList.remove('hidden');
        
        // Update UI with player data
        playerNameDisplay.textContent = currentPlayer.name;
        playerScoreDisplay.textContent = currentPlayer.score;
        playerTitleDisplay.textContent = currentPlayer.currentTitle || '';
        
        // Update titles display
        updateTitlesDisplay();
    }
    
    // Hide game interface
    function hideGameInterface() {
        clickerSection.classList.add('hidden');
    }
    
    // Initialize: Load leaderboard immediately
    updateLeaderboard();
});