const tabs = document.querySelectorAll(".tabs div");
const fields = document.querySelectorAll(".field");

tabs.forEach(element => {
    element.addEventListener('click', () => {
        deselectTabs();
        hideFields();
        element.dataset.selected = 'true';
        ind = parseInt(element.dataset.index);

        fields[ind].style.display='block';
    });
});

function deselectTabs() {
    tabs.forEach(element => {
        element.dataset.selected = 'false';
    });
}
function hideFields() {
    fields.forEach((e) => {
        e.style.display = 'none';
    });
}

// DISPLAYING DATA

function getCookie(key) {
    const cookies = document.cookie.split('; ');
    const cookie = cookies.find(c => c.startsWith(`${key}=`));
    if (!cookie) return undefined;
    return cookie.split('=')[1];
}

async function request(url, method, headers, body) {
    const response = await fetch(url, {method:method, headers:headers, body:JSON.stringify(body)})
    data = await response.json();
    return data;
}

function getPlayed(words) {
    let played = 0;
    for (const word of words) {
        if (word['started']) played++;
    }
    return played;
}
function getFound(words) {
    let found = 0;
    for (const word of words) {
        if (word['found']) found++;
    }
    return found;
}
function getWinrate(words) {
    return Math.round(getFound(words)*100/getPlayed(words));
}
function getAvgAttempts(words) {
    let attempts = 0;
    for (const word of words) {
        if (word['started'] && word['found']) attempts+=word['correct_attempts'].length+word['wrong_attempts'].length;
    }
    return Math.round(attempts/getPlayed(words));
}

function loadTable(words) {
    const tableBody = document.querySelector('.history table tbody');
    for (const word of words) {
        if (!word['started']) continue;
        const row = document.createElement('tr');
        const celltext = document.createElement('td');
        const celldate = document.createElement('td');
        const cellattempts = document.createElement('td');
        const cellbought = document.createElement('td');
        const cellprofit = document.createElement('td');
        const cellfound = document.createElement('td');
        row.append(celltext, celldate, cellattempts, cellbought, cellprofit, cellfound);

        celltext.textContent = word['text'].toUpperCase();
        celldate.textContent = reformatDate(word['date']);
        cellattempts.textContent = word['correct_attempts'].length + word['wrong_attempts'].length;
        cellbought.textContent = word['bought'].length
        cellprofit.textContent = word['profit']>0 ? '+'+word['profit'] : word['profit'];
        const foundIcon = document.createElement('i');
        word['found'] ? foundIcon.className='fa-solid fa-check' : foundIcon.className='fa-solid fa-xmark';
        cellfound.appendChild(foundIcon);
        tableBody.appendChild(row);
    }
}
function reformatDate(input) {
    let datePart = input.match(/\d+/g),
    year = datePart[0],
    month = datePart[1], 
    day = datePart[2];
  
    return day+'.'+month+'.'+year;
  }


async function main() {
    const username = document.querySelector('.username');
    const email = document.querySelector('.email');
    const balance = document.querySelector('.balance');
    const played = document.querySelector('.played');
    const winrate = document.querySelector('.winrate');
    const avgattempt = document.querySelector('.avgattempt');
    const nodata = document.querySelector('.nodata');
    const table = document.querySelector('.history table');

    user = await request('http://127.0.0.1:8000/account/', 'GET', {"Authorization":`Bearer ${getCookie('access')}`})

    if (user['words']) {
        nodata.style.display = 'none';
        table.style.display = 'table';
    }

    username.textContent = user['username'];
    email.textContent = user['email'];
    balance.textContent = user['balance'];
    played.textContent = getPlayed(user['words']);
    winrate.textContent = getWinrate(user['words']) + '%';
    avgattempt.textContent = getAvgAttempts(user['words']);

    loadTable(user['words'])
}


main();
