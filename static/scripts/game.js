const menu = document.querySelector(".menu");
const openMenu = document.querySelector(".pause");
const closeMenu = document.querySelector(".play");

closeMenu.addEventListener('click', (e) => {
    menu.close();
});

openMenu.addEventListener('click', (e) => {
    menu.showModal();
});

var letterContainer = document.querySelector(".word-container");
var letters = letterContainer.querySelectorAll('.word');
var letterCount = letters.length;

if (letterCount>9 && letterCount<12) {
    letters.forEach(element => {
        element.classList.add('word-small');
    });
} else if (letterCount>=12) {
    letters.forEach(element => {
        element.classList.add('word-xsmall');
    });
}