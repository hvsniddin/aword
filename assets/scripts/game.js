const menu = document.querySelector(".menu");
const openMenu = document.querySelector(".pause");
const closeMenu = document.querySelector(".play");

closeMenu.addEventListener('click', (e) => {
    menu.close();
});

openMenu.addEventListener('click', (e) => {
    menu.showModal();
});