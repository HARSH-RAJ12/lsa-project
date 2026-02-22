let score = 0;
let highScore = localStorage.getItem("highScore") || 0;
let timeRemaining = 300;
let timerInterval;
let currentTarget = 0;
let playerName = "";
let currentQuestionIndex = 0;
let questionBank = [];
const TOTAL_QUESTIONS = 100;

// SOUND CONFIGURATION
const sounds = {
    correct: new Audio('assets/sounds/correct.mp3'),
    wrong: new Audio('assets/sounds/wrong.mp3'),
    levelUp: new Audio('assets/sounds/level-up.mp3'),
    gameOver: new Audio('assets/sounds/game-over.mp3')
};

function playSound(type) {
    if (sounds[type]) {
        sounds[type].pause();
        sounds[type].currentTime = 0;
        let playPromise = sounds[type].play();
        if (playPromise !== undefined) {
            playPromise.catch(error => {
                console.log("Playback prevented. Ensure you click 'Start' to interact with the page first.");
            });
        }
    }
}

function stopAllSounds() {
    Object.values(sounds).forEach(s => {
        s.pause();
        s.currentTime = 0;
    });
}

// Difficulty configuration
const lengthValues = [1, 2, 3, 4, 5, 6];
const widthValues = [1, 2, 3, 4, 5, 6];
const heightValues = [2, 3, 5, 6, 8, 9];

document.getElementById("highScore").innerText = highScore;

window.onload = function() {
    const token = localStorage.getItem("token");
    const name = localStorage.getItem("agentName");
    if (token && name) {
        playerName = name;
        showWelcome(name);
    } else {
        showAuth();
    }
};

function showAuth() {
    document.getElementById("authContainer").classList.remove("hidden");
    document.getElementById("welcomeMsg").classList.add("hidden");
}

function showWelcome(name) {
    document.getElementById("authContainer").classList.add("hidden");
    document.getElementById("welcomeMsg").classList.remove("hidden");
    document.getElementById("displayUser").innerText = name;
}

function logout() {
    localStorage.removeItem("token");
    localStorage.removeItem("agentName");
    location.reload();
}

// --- AUTH LOGIC ---
async function handleAuth(type) {
    const user = document.getElementById("username").value;
    const pass = document.getElementById("password").value;
    if (!user || !pass) return alert("Credentials Required!");

    const endpoint = type === 'login' ? '/api/login' : '/api/register';
    
    try {
        const res = await fetch(endpoint, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username: user, password: pass })
        });
        const data = await res.json();

        if (res.ok) {
            if (type === 'login') {
                localStorage.setItem("token", data.token);
                localStorage.setItem("agentName", data.username);
                playerName = data.username;
                showWelcome(data.username);
            } else {
                alert("Agent Registered! Please Login.");
            }
        } else {
            alert(data.error || "Action Failed");
        }
    } catch (e) { alert("Server Offline!"); }
}

// --- GAME CORE ---
function startGame() {
    document.getElementById("startScreen").classList.add("hidden");
    document.getElementById("gameContainer").classList.remove("hidden");
    score = 0; 
    timeRemaining = 300; 
    currentQuestionIndex = 0;
    generateQuestionBank();
    updateScore();
    generateValues();
    loadQuestion();
    startTimer();
}

function generateQuestionBank() {
    questionBank = [];
    for (let i = 0; i < TOTAL_QUESTIONS; i++) {
        let diff = Math.floor(i / 10);
        let h = heightValues[Math.floor(Math.random() * heightValues.length)] + diff;
        let l = lengthValues[Math.floor(Math.random() * lengthValues.length)] + diff;
        let w = widthValues[Math.floor(Math.random() * widthValues.length)] + diff;
        questionBank.push({ h, l, w, target: 2 * h * (l + w) });
    }
}

function loadQuestion() {
    document.getElementById("level").innerText = `${currentQuestionIndex + 1} / ${TOTAL_QUESTIONS}`;
    const q = questionBank[currentQuestionIndex];
    currentTarget = q.target;
    
    
    document.getElementById("questionBox").innerHTML = `2 × <span class="drop-box" id="box1" data-type="height">?</span> × (<span class="drop-box" id="box2" data-type="length">?</span> + <span class="drop-box" id="box3" data-type="width">?</span>) = ${currentTarget}`;
    ["box1", "box2", "box3"].forEach(setupDrop);
}

function setupDrop(id) {
    const box = document.getElementById(id);
    box.addEventListener("dragover", (e) => e.preventDefault());
    box.addEventListener("drop", (e) => {
        e.preventDefault();
        const val = e.dataTransfer.getData("text");
        const type = e.dataTransfer.getData("type"); 

       
        if (box.dataset.type === type) {
            box.innerText = val;
            box.dataset.value = val;
            checkAnswer();
        } else {
            console.log("Wrong Category! Drop " + type + " in the correct box.");
        }
    });
}

function checkAnswer() {
    const b1 = document.getElementById("box1").dataset.value;
    const b2 = document.getElementById("box2").dataset.value;
    const b3 = document.getElementById("box3").dataset.value;

    if (b1 && b2 && b3) {
        const result = 2 * parseInt(b1) * (parseInt(b2) + parseInt(b3));
        
        if (result === currentTarget) {
            playSound('correct'); 
            score += 10;
            currentQuestionIndex++;
            
            setTimeout(() => { 
                if (currentQuestionIndex > 0 && currentQuestionIndex % 5 === 0) {
                    playSound('levelUp');
                }

                if (currentQuestionIndex >= TOTAL_QUESTIONS) {
                    gameOver();
                } else {
                    generateValues(); 
                    loadQuestion(); 
                    updateScore(); 
                }
            }, 600); 
        } else {
            playSound('wrong'); 
            const container = document.getElementById("questionBox");
            container.classList.add("wrong-answer");

            setTimeout(() => {
                container.classList.remove("wrong-answer");
                currentQuestionIndex++; 
                if (currentQuestionIndex >= TOTAL_QUESTIONS) {
                    gameOver();
                } else {
                    generateValues(); 
                    loadQuestion();
                    updateScore();
                }
            }, 600); 
        }
    }
}

function startTimer() {
    if(timerInterval) clearInterval(timerInterval);
    timerInterval = setInterval(() => {
        timeRemaining--;
        document.getElementById("time").innerText = timeRemaining;
        document.getElementById("progress").style.width = (timeRemaining / 300) * 100 + "%";
        if (timeRemaining <= 0) gameOver();
    }, 1000);
}

function gameOver() {
    stopAllSounds();
    playSound('gameOver');
    clearInterval(timerInterval);
    document.getElementById("gameContainer").classList.add("hidden");
    document.getElementById("gameOverScreen").classList.remove("hidden");
    document.getElementById("finalScore").innerText = score;
    document.getElementById("finalLevel").innerText = currentQuestionIndex;
    saveScoreToDB(score, currentQuestionIndex);
}

async function saveScoreToDB(s, l) {
    const token = localStorage.getItem("token");
    if(!token) return;
    const lastQ = questionBank[currentQuestionIndex - 1] || questionBank[0];
    try {
        await fetch('/api/game/save-score', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'Authorization': token },
            body: JSON.stringify({ score: s, level: l, h: lastQ.h, l: lastQ.l, w: lastQ.w, target: lastQ.target })
        });
        fetchLeaderboard();
    } catch(e) { console.error("Sync failed"); }
}

async function fetchLeaderboard() {
    try {
        const res = await fetch('/api/game/leaderboard');
        const data = await res.json();
        document.getElementById("leaderboardList").innerHTML = data.map((e, i) => 
            `<div style="display:flex; justify-content:space-between; padding:5px 0; border-bottom:1px solid rgba(255,255,255,0.05)">
                <span>${i+1}. ${e.player_name}</span>
                <b style="color:#22c55e">${e.score}</b>
            </div>`
        ).join('');
    } catch(e) { console.log("Leaderboard offline"); }
}

function generateValues() {
    const create = (id, arr, type) => {
        const el = document.getElementById(id); el.innerHTML = "";
        shuffle(arr).forEach(v => {
            const d = document.createElement("div"); 
            d.className = "value-box"; 
            d.innerText = v; d.draggable = true;
            
            d.addEventListener("dragstart", (e) => {
                e.dataTransfer.setData("text", v);
                e.dataTransfer.setData("type", type);
            });
            el.appendChild(d);
        });
    };
    
    create("lengthValues", [...lengthValues], "length"); 
    create("widthValues", [...widthValues], "width"); 
    create("heightValues", [...heightValues], "height");
}

function updateScore() {
    document.getElementById("score").innerText = score;
    if (score > highScore) { 
        highScore = score; 
        localStorage.setItem("highScore", highScore); 
        document.getElementById("highScore").innerText = highScore;
    }
}

function shuffle(a) { return a.sort(() => Math.random() - 0.5); }
function resetGame() { location.reload(); }