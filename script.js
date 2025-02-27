// Worker data
const workers = [
    {
        name: "Clemence Valdez",
        age: "Black",
        birthday: "03/19/1532",
        nickname: "Diddy",
        image: "/assets/clemence.png",
        stats: {
            HP: "Immortal",
            Stamina: "Hardcore",
            Appetite: "Watermelon & Chicken",
            Attitude: "Freaky"
        },
        description: "[Placeholder] ."
    },
    {
        name: "Garry Edicto",
        age: "Gay",
        birthday: "09/09/9",
        nickname: "Quiboloy",
        image: "/assets/garry.png",
        stats: {
            HP: "Dead",
            Stamina: "Bottom",
            Appetite: "Femboy",
            Attitude: "Racist"
        },
        description: "[Placeholder] ."
    },
    {
        name: "Jaimes Jairelle Oreto",
        age: "Skibidi Toilet",
        birthday: "1/1/1",
        nickname: "Onii-chan",
        image: "/assets/jaimes.png",
        stats: {
            HP: "Hard",
            Stamina: "Harder",
            Appetite: "Men",
            Attitude: "Sexual Offender"
        },
        description: "[Placeholder] ."
    },
    {
        name: "Michael Maulas",
        age: "Jumperwire",
        birthday: "03/19/1532",
        nickname: "Jamal",
        image: "/assets/mikl.png",
        stats: {
            HP: "Big",
            Stamina: "Gawk Gawk",
            Appetite: "Twinks",
            Attitude: "Nutter"
        },
        description: "[Placeholder] ."
    },
    {
        name: "Allen Prado",
        age: "Star",
        birthday: "2/2/2222",
        nickname: "Patrick",
        image: "/assets/alln.png",
        stats: {
            HP: "Small",
            Stamina: "Hehe",
            Appetite: "Big Cock (Chicken)",
            Attitude: "Twink"
        },
        description: "[Placeholder] ."
    }
];

let currentWorkerIndex = 0;

function updateWorkerInfo(index, animate = true) {
    const worker = workers[index];
    
    if (animate) {
        document.getElementById("worker-name").style.opacity = 0;
        document.getElementById("worker-details").style.opacity = 0;
        document.getElementById("worker-stats").style.opacity = 0;
        document.getElementById("worker-description").style.opacity = 0;
    }
    
    const workerImage = document.getElementById("worker-image");
    workerImage.style.backgroundImage = `url('${worker.image}')`;
    
    setTimeout(() => {
        document.getElementById("worker-name").textContent = worker.name;
        
        const detailsEl = document.getElementById("worker-details");
        detailsEl.innerHTML = `
            <span>Race: ${worker.age}</span>
            <span>Birthday: ${worker.birthday}</span>
            <span>Nickname: ${worker.nickname}</span>
        `;
        
        const statsEl = document.getElementById("worker-stats");
        statsEl.innerHTML = "";
        
        for (const [stat, value] of Object.entries(worker.stats)) {
            const statItem = document.createElement("div");
            statItem.className = "stat-item";
            statItem.innerHTML = `
                <div class="stat-label">${stat}</div>
                <div class="stat-bar">
                    <div class="stat-bar-fill">
                        <div class="stat-value">${value}</div>
                    </div>
                </div>
            `;
            statsEl.appendChild(statItem);
        }
        
        document.getElementById("worker-description").textContent = worker.description;
        
        if (animate) {
            document.getElementById("worker-name").style.opacity = 1;
            document.getElementById("worker-details").style.opacity = 1;
            document.getElementById("worker-stats").style.opacity = 1;
            document.getElementById("worker-description").style.opacity = 1;
        }
        
        document.getElementById("current-worker").textContent = index + 1;
        
        updateDots(index);
        
    }, animate ? 300 : 0);
}

function createDots() {
    const dotsContainer = document.getElementById("worker-dots");
    dotsContainer.innerHTML = "";
    
    for (let i = 0; i < workers.length; i++) {
        const dot = document.createElement("div");
        dot.className = i === 0 ? "worker-dot active" : "worker-dot";
        dot.addEventListener("click", () => {
            currentWorkerIndex = i;
            updateWorkerInfo(i);
        });
        dotsContainer.appendChild(dot);
    }
}

function updateDots(index) {
    const dots = document.querySelectorAll(".worker-dot");
    dots.forEach((dot, i) => {
        if (i === index) {
            dot.classList.add("active");
        } else {
            dot.classList.remove("active");
        }
    });
}

document.getElementById("prev-worker").addEventListener("click", () => {
    currentWorkerIndex = (currentWorkerIndex - 1 + workers.length) % workers.length;
    updateWorkerInfo(currentWorkerIndex);
});

document.getElementById("next-worker").addEventListener("click", () => {
    currentWorkerIndex = (currentWorkerIndex + 1) % workers.length;
    updateWorkerInfo(currentWorkerIndex);
});

document.addEventListener("DOMContentLoaded", () => {
    document.getElementById("total-workers").textContent = workers.length;
    
    createDots();
    
    updateWorkerInfo(0, false);
    
    document.querySelector('.learn-more-btn').addEventListener('click', function() {
        document.querySelector('#workers').scrollIntoView({ behavior: 'smooth' });
    });
});