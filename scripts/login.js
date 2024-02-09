const form = document.querySelector('form');
const username = document.querySelector('input[name="username"]');
const password = document.querySelector('input[name="password"]');

const errorText = document.querySelector(".error");

form.addEventListener('submit', async (e) => {
    e.preventDefault();
    formData = new FormData(form)
    console.log("sending login request");
    data = await requestFD(
        "https://aword-api.onrender.com/account/login/",
        "POST",
        formData
    )
    if (data["detail"]) {
        console.log(data['detail']);
        errorText.textContent = "Username or password incorrect";
        return;
    }

    
    // document.cookie = '';
    // document.cookie = `access=${data["access"]}; path=/`;
    // document.cookie = `refresh=${data["refresh"]}; path=/`;

    setCookie('access', data["access"], 1)
    setCookie('refresh', data["refresh"], 7)

    window.location.replace("home");
});



async function requestFD(url, method, body) {
    const response = await fetch(url, {method:method, body:body})
    data = await response.json()
    return data
}

function setCookie(name, value, days) {
    var date = new Date();
    date.setTime(date.getTime() + (days*24*60*60*1000));
    var expires = "expires="+ date.toUTCString();
    document.cookie = name + "=" + value + ";" + expires + ";path=/";
}

function seePassword(e) {
    const inp = e.parentElement.querySelector('input');
    if (inp.type === 'password') {
        inp.type = 'text';
        e.className = 'fa-regular fa-eye-slash'
    } else {
        inp.type = 'password';
        e.className = 'fa-regular fa-eye'
    }
}