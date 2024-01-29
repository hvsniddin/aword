const form = document.querySelector('form');
const username = document.querySelector('input[name="username"]');
const password = document.querySelector('input[name="password"]');

const errorText = document.querySelector(".error");

form.addEventListener('submit', async (e) => {
    e.preventDefault();
    formData = new FormData(form)
    console.log("sending login request");
    data = await requestFD(
        "http://127.0.0.1:8000/account/login/",
        "POST",
        formData
    )
    if (data["detail"]) {
        errorText.textContent = "Username or password incorrect";
        return;
    }

    document.cookie = '';
    document.cookie = `access=${data["access"]}; path=/`;
    document.cookie = `refresh=${data["refresh"]}; path=/`;

    window.location.replace("http://127.0.0.1:5500/front/home.html");
});



async function requestFD(url, method, body) {
    const response = await fetch(url, {method:method, body:body})
    data = await response.json()
    return data
}