const menu = document.querySelector('.menu');
const menuButtons = document.querySelectorAll('.buttons a');

let currentSelectedMenu = 0;
focusItem();

window.addEventListener('keydown', (e) => {
    switch (e.key) {
        case 'ArrowUp':
            currentSelectedMenu>0 && currentSelectedMenu--;
            focusItem();
            break;
        case 'ArrowDown':
            currentSelectedMenu<menuButtons.length-1 && currentSelectedMenu++;
            focusItem();
            break;
    }
});

menuButtons.forEach((e, i) => {
    e.addEventListener('blur', (event) => {
        event.preventDefault();
        focusItem();
    });

    e.addEventListener('mouseover', () => {
        currentSelectedMenu = i;
        focusItem();
    });

    e.addEventListener('click', (event) => {
        event.preventDefault();
        const href = e.getAttribute('href');
        menu.style.pointerEvents = 'none';
        menu.style.opacity = '0';
        clearInterval(floatingLetterInterval);

        const emptyObserver = new MutationObserver(() => {
            if (floatingLettersContainer.children.length == 0) {
                emptyObserver.disconnect();
                if (!getCookie("access")) {
                    setTimeout(() => {
                        window.location.href = '/front/login.html';
                    }, 200);
                    return
                }
                setTimeout(() => {
                    window.location.href = `/front/${href}`;
                }, 200);
            }
        });
        emptyObserver.observe(floatingLettersContainer, {childList: true});

    });
});


function focusItem() {
    menuButtons[currentSelectedMenu].focus();
}

function getCookie(key) {
    const cookies = document.cookie.split('; ');
    const cookie = cookies.find(c => c.startsWith(`${key}=`));
    if (!cookie) return undefined;
    return cookie.split('=')[1];
}