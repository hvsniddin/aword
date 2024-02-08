const form = document.querySelector('.change-profile-form');
const usernameInput = document.querySelector('input[name="username"]');
const emailInput = document.querySelector('input[name="email"]');

// LOAD DATA
async function main() {
    user = await request('https://aword-api.onrender.com/account/', 'GET', {"Authorization":`Bearer ${getCookie('access')}`})
    usernameInput.value = user['username'];
    emailInput.value = user['email'];
}
main();

async function request(url, method, headers, body) {
    const response = await fetch(url, {method:method, headers:headers, body:JSON.stringify(body)})
    data = await response.json();
    if (data['detail']) {
        if (!getCookie('refresh')) {
            window.location.href = 'login.html';
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
function setCookie(name, value, days) {
    var date = new Date();
    date.setTime(date.getTime() + (days*24*60*60*1000));
    var expires = "expires="+ date.toUTCString();
    document.cookie = name + "=" + value + ";" + expires + ";path=/";
}

// HANDLE CHANGE TEXT CLICK
document.querySelectorAll('.input-change-activate').forEach((e) => {
    e.addEventListener('click', async () => {
        const input = e.parentElement.querySelector('input');
        if (input.classList.contains('idle')) {
            input.classList.remove('idle');
            e.textContent = 'Cancel';
            input.focus();
        } else {
            user = await request('https://aword-api.onrender.com/account/', 'GET', {"Authorization":`Bearer ${getCookie('access')}`})
            input.classList.add('idle');
            input.value = user[`${input.getAttribute('name')}`];
            e.textContent = 'Change';
        }
    });
});

// HANDLE FORM SUBMISSION
form.addEventListener('submit', async (e) => {
    e.preventDefault();
    refocusEmptyInput();
    let formData = new FormData(form);
    formData = clearFormData(formData)
    
    const data = await requestFD('https://aword-api.onrender.com/account/', 'PATCH', formData, headers={"Authorization":`Bearer ${getCookie('access')}`});
    if (data['ok']) {
        if (data['changed'].length===0) {
            reloadInputFields();
            showChangeInfo('Nothing changed', true);
            return;
        }
        
        showChangeInfo('Changes saved', true);
        reloadInputFields();
    }
    const [firstError] = Object.values(data['errors']);
    showChangeInfo(firstError[0], false);
});

function reloadInputFields() {
    [usernameInput, emailInput].forEach((e) => {
        e.classList.add('idle');
        e.blur();
        e.parentElement.querySelector('p').textContent = 'Change';
    });
}
function refocusEmptyInput() {
    if (usernameInput.value==='') {
        usernameInput.focus();
        return
    } else if (emailInput.value==='') {
        emailInput.focus();
        return;
    } 
}
function clearFormData(fd) {
    let r = new FormData();
    for (let [k, v] of fd) {
        if (v.trim() !=='') {
            r.append(k, v);
        }
    }
    return r
}
async function requestFD(url, method, body, headers={}) {
    const response = await fetch(url, {method:method, headers:headers, body:body})
    data = await response.json()
    return data
}

let showChangeInfoTimeoutId = null;
function showChangeInfo(msg, ok) {
    const info = document.querySelector('.change-info');
    const text = info.querySelector('p');
    const icon = info.querySelector('i');

    text.textContent = msg;
    if (ok) {
        icon.className = 'fa-solid fa-check';
        info.style.backgroundColor = 'green';
    } else {
        icon.className = 'fa-solid fa-circle-exclamation'
        info.style.backgroundColor = 'red';
    }

    info.style.animationPlayState = 'paused';
    info.classList.remove('showerror');
    info.offsetHeight;
    info.style.animationPlayState = 'running';
    info.classList.add('showerror');
}