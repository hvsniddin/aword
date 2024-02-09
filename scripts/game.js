const wordContainer = document.querySelector(".word-container");
const keyboardButtons = document.querySelectorAll('.keyboard-button');
const error = document.querySelector('.error');
error.addEventListener('animationend', () => {
    error.innerText = '';
    error.classList.remove('showerror');
});

// alert(window.outerWidth)

const clearKey = document.querySelector('.keyboard-button[data-func="clear"]');
const enterKey = document.querySelector('.keyboard-button[data-func="enter"]');
[clearKey, enterKey].forEach((e) => {
    e.addEventListener('animationend', () => {
        e.classList.remove('press');
    });
});

load().then(() => {
    const letters = document.querySelectorAll('.letter');
    letters.forEach((e, i) => {
        if (e.dataset.found==='true') return
        e.addEventListener("click", async () => {
            const buyLetterData = await request(`https://aword-api.onrender.com/game/?for=buyletter&i=${i}`, 'GET', {"Authorization": `Bearer ${getCookie("access")}`});
            loadProgress(buyLetterData['letters'], letters)
            buyLetterData['found'] && fireConfetti();
        });
    });
});

keyboardButtons.forEach((e, i) => {
    e.addEventListener('click', () => {
        if (e===clearKey) {
            clear();
            return;
        } else if (e===enterKey) {
            enter();
            return;
        }

        if (e.dataset.selected === 'true') {
            e.dataset.selected = 'false';
        } else {
            deselectButtons();
            e.dataset.selected = 'true';
        }
    });
});

async function load() {
    lenData = await request("https://aword-api.onrender.com/game/?for=wordlen", 'GET', {'Authorization': `Bearer ${getCookie('access')}`});

    // Token validation
    if (lenData['detail'] && lenData['code'] === 'token_not_valid') {
        if (lenData['messages'][0]['token_type']==='access') {
            access_data = await request('https://aword-api.onrender.com/account/refresh/', 'POST', {'Content-Type': 'application/json'}, {'refresh':getCookie('refresh')});
            document.cookie = `access=${access_data['access']}`;
            load();
        }
    }

    // Loading the letters
    i = parseInt(lenData);
    loadLetters(i);
    
    // Loading the progress
    progressData = await request("https://aword-api.onrender.com/game/?for=progress", 'GET', {'Authorization': `Bearer ${getCookie('access')}`});
    if (progressData['found']) {
        const letters = progressData['found']
        const letterElems = document.querySelectorAll('.letter');
        loadProgress(letters, letterElems)
    }
}

window.addEventListener("keyup", (e) => handleKeyPress(e));

async function request(url, method, headers, body) {
    const response = await fetch(url, {method:method, headers:headers, body:JSON.stringify(body)})
    data = await response.json();
    if (data['detail']) {
        if (!getCookie('refresh')) {
            window.location.href = 'login';
        }
        console.log(data);
        // Invalid ACCESS token
        if (data['code']==='token_not_valid' && data['messages'] && data['messages'][0]['token_type']==='access') {
            const refreshData = await request('https://aword-api.onrender.com/account/refresh/', 'POST', {'Content-Type': 'application/json'}, {'refresh':getCookie('refresh')});
            setCookie('access', refreshData['access'], 1);
        }
    }

    return data;
}

function getCookie(key) {
    const cookies = document.cookie.split('; ');
    const cookie = cookies.find(c => c.startsWith(`${key}=`));
    if (!cookie) return undefined;
    return cookie.split('=')[1];
}

function loadLetters(n) {
    while (n>0) {
        const letterContainer = document.createElement('div');
        letterContainer.className = 'letter-container';

        const letter = document.createElement("div");
        letter.className = 'letter';
        letter.dataset.found = 'false';

        const lfront = document.createElement("div");
        lfront.className = 'letter-front';
        
        const lback = document.createElement("div");
        lback.className = 'letter-back';

        wordContainer.appendChild(letterContainer);
        letterContainer.appendChild(letter)
        letter.appendChild(lfront);
        letter.appendChild(lback);

        n--
    }
}

function loadProgress(object, letterElems) {
    for (let [key, val] of Object.entries(object)) {
        for (let i = 0; i < val.length; i++) {
            const currInd = val[i];
            letterElems[currInd].dataset.found = 'true';
            letterElems[currInd].querySelector(".letter-back").innerText = key;
            letterElems[currInd].style.transform = 'rotateY(180deg)';
        }
    }
}

function deselectButtons() {
    keyboardButtons.forEach((e) => {
        e.dataset.selected = 'false';
    });
}
function selectButton(letter) {
    const key = document.querySelector(`.keyboard-button[data-letter="${letter.toLowerCase()}"]`);
    if (!key) {
        return undefined;
    }
    deselectButtons();
    key.dataset.selected = 'true';
}
function getSelectedButton() {
    let r = undefined
    keyboardButtons.forEach(element => {
        if (element.dataset.selected==='true') {
            r = element;
        }
    });
    return r;
}

async function tryLetter(l) {
    const tryData = await request(`https://aword-api.onrender.com/game/?for=tryletter&l=${l}`, 'GET', {'Authorization':`Bearer ${getCookie('access')}`});
    return tryData;
}

async function enter() {
    enterKey.classList.add('press');
    if (getSelectedButton()) {
        const tryData = await tryLetter(getSelectedButton().dataset.letter);
        deselectButtons();
        if (tryData['detail']) {
            showerror(tryData['detail']);
            return;
        }
        const letterElems = document.querySelectorAll('.letter');
        loadProgress(tryData['letters'], letterElems);
        tryData['found'] && fireConfetti();
    }
}

function clear() {
    clearKey.classList.add('press');
    deselectButtons();
}

function showerror(e) {
    error.style.animationPlayState = 'paused';
    error.classList.remove('showerror');
    error.offsetHeight;
    error.style.animationPlayState = 'running';
    error.innerText = e;
    error.classList.add('showerror');
}

function fireConfetti() {
    confetti({
        particleCount: 70,
        spread: 70,
        origin: { y: .6, x:0},
        angle: 45,
    });
    confetti({
        particleCount: 70,
        spread: 70,
        origin: { y: .6 , x:1},
        angle: 135,
    });
}

async function handleKeyPress(e) {
    const key = e.key;
    if (e.code.startsWith("Key")) {
        selectButton(key);
    }

    if (e.key === "Backspace") {
        clear();
    } else if (e.key === 'Enter') {

        enter();
    }
}