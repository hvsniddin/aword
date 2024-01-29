const play = document.querySelector('.play');
const menu = document.querySelector('.menu');

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
            window.location.href = '/front/game.html';
        }, 200);
    }
});

play.addEventListener('click', () => {
    menu.style.pointerEvents = 'none';
    menu.style.opacity = '0';
    clearInterval(floatingLetterInterval);
    emptyObserver.observe(floatingLettersContainer, {childList: true});
        
});


function getCookie(key) {
    const cookies = document.cookie.split('; ');
    const cookie = cookies.find(c => c.startsWith(`${key}=`));
    if (!cookie) return undefined;
    return cookie.split('=')[1];
}