const menu = document.querySelector(".menu")
let menuOpen = menu.dataset.open;

function pause() {
    menu.dataset.open = 'true'
}

function play() {
    menu.dataset.open = 'false'
}