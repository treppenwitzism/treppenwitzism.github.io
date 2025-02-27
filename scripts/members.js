// Members JavaScript file
document.addEventListener('DOMContentLoaded', function() {
    // Load member data dynamically from the JSON file
    loadMembersData();
    
    // Add glossy effect to achievements only
    function applyGlossyEffectToAchievements() {
        const achievements = document.querySelectorAll('.achievement');
        
        achievements.forEach(achievement => {
            // Create the glossy shine element
            const shineElement = document.createElement('div');
            shineElement.className = 'achievement-shine';
            achievement.appendChild(shineElement);
            
            // Keep the original hover functionality from CSS
            achievement.addEventListener('mouseenter', function() {
                // Use the existing CSS hover styles
            });
            
            achievement.addEventListener('mouseleave', function() {
                // Use the existing CSS hover styles
            });
        });
        
        // Add CSS for the glossy effect
        if (!document.getElementById('dynamic-styles')) {
            const styleSheet = document.createElement('style');
            styleSheet.id = 'dynamic-styles';
            styleSheet.textContent = `
                .achievement {
                    position: relative;
                    overflow: hidden;
                }
                .achievement-shine {
                    position: absolute;
                    top: -100%;
                    left: -100%;
                    right: -100%;
                    bottom: -100%;
                    background: linear-gradient(
                        45deg, 
                        rgba(255,255,255,0) 0%, 
                        rgba(255,255,255,0.4) 50%, 
                        rgba(255,255,255,0) 100%
                    );
                    transform: rotate(25deg) translateY(-60%);
                    animation: shine 6s infinite; /* Slower animation */
                    pointer-events: none; /* Ensure it doesn't interfere with clicks */
                }
                @keyframes shine {
                    0%, 100% {
                        transform: translateX(-150%) rotate(25deg);
                    }
                    50% {
                        transform: translateX(150%) rotate(25deg);
                    }
                }
            `;
            document.head.appendChild(styleSheet);
        }
    }
    
    // Function to load members data from JSON
    function loadMembersData() {
        fetch('data/members.json')
            .then(response => response.json())
            .then(data => {
                const memberCardsContainer = document.querySelector('.member-cards');
                memberCardsContainer.innerHTML = '';
                
                data.forEach(member => {
                    const memberCard = createMemberCard(member);
                    memberCardsContainer.appendChild(memberCard);
                });
                
                // Apply glossy effect to achievements after cards are loaded
                applyGlossyEffectToAchievements();
            })
            .catch(error => {
                console.error('Error loading members data:', error);
                // Display friendly error message on the page
                const memberCardsContainer = document.querySelector('.member-cards');
                memberCardsContainer.innerHTML = '<p class="error-message">Unable to load member data. Please try again later.</p>';
            });
    }
    
    function createMemberCard(member) {
        // Create the member card element
        const memberCard = document.createElement('div');
        memberCard.className = 'member-card';
        
        // Create the member image section
        const memberImage = document.createElement('div');
        memberImage.className = 'member-image';
        const img = document.createElement('img');
        img.src = member.image;
        img.alt = `${member.firstName} ${member.lastName}`;
        memberImage.appendChild(img);
        
        // Create the member info section
        const memberInfo = document.createElement('div');
        memberInfo.className = 'member-info';
        
        // Create the member details section
        const memberDetails = document.createElement('div');
        memberDetails.className = 'member-details';
        
        // Add member name
        const memberName = document.createElement('h2');
        memberName.className = 'member-name';
        memberName.innerHTML = `<span class="firstname">${member.firstName}</span> <span class="lastname">${member.lastName}</span>`;
        
        // Add member birthday
        const memberBirthday = document.createElement('p');
        memberBirthday.className = 'member-birthday';
        memberBirthday.textContent = `Birthday: ${member.birthday}`;
        
        // Add member nickname
        const memberNickname = document.createElement('p');
        memberNickname.className = 'member-nickname';
        memberNickname.textContent = `Nickname: ${member.nickname}`;
        
        // Add member quote
        const memberQuote = document.createElement('p');
        memberQuote.className = 'member-quote';
        memberQuote.textContent = `"${member.quote}"`;
        
        // Append all details to the details section
        memberDetails.appendChild(memberName);
        memberDetails.appendChild(memberBirthday);
        memberDetails.appendChild(memberNickname);
        memberDetails.appendChild(memberQuote);
        
        // Create the achievements section
        const memberAchievements = document.createElement('div');
        memberAchievements.className = 'member-achievements';
        
        // Add each achievement
        member.achievements.forEach(achievement => {
            const achievementDiv = document.createElement('div');
            achievementDiv.className = 'achievement';
            achievementDiv.textContent = achievement;
            memberAchievements.appendChild(achievementDiv);
        });
        
        // Append details and achievements to member info
        memberInfo.appendChild(memberDetails);
        memberInfo.appendChild(memberAchievements);
        
        // Append image and info to the card
        memberCard.appendChild(memberImage);
        memberCard.appendChild(memberInfo);
        
        return memberCard;
    }
    
    // Add search/filter functionality
    const searchInput = document.getElementById('member-search');
    if (searchInput) {
        searchInput.addEventListener('input', function() {
            const searchTerm = this.value.toLowerCase();
            const memberCards = document.querySelectorAll('.member-card');
            
            memberCards.forEach(card => {
                const name = card.querySelector('.member-name').textContent.toLowerCase();
                const nickname = card.querySelector('.member-nickname').textContent.toLowerCase();
                const achievements = Array.from(card.querySelectorAll('.achievement'))
                    .map(ach => ach.textContent.toLowerCase())
                    .join(' ');
                
                if (name.includes(searchTerm) || 
                    nickname.includes(searchTerm) || 
                    achievements.includes(searchTerm)) {
                    card.style.display = 'flex';
                } else {
                    card.style.display = 'none';
                }
            });
        });
    }
});