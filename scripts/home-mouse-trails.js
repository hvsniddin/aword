const effectLetterColors = ["rgb(0, 187, 249)", "rgb(0, 245, 212)", "rgb(252, 254, 255)"];
const effectLetterAnimations = ['fall-1', 'fall-2', 'fall-3'];
const effectLetters = "abcdefghijklmnopqrstuvwxyz".split("");
const effectLetterSizes = ["1.8rem", "1.2rem", "0.8rem"]

let effectLetterStartTime = new Date().getTime();
const effectLetterOriginalPos = {x:0, y:0}

const effectLetterLatsPos = {
    letterTime: effectLetterStartTime,
    letterPos:effectLetterOriginalPos,
    mousePos:effectLetterOriginalPos,
}

window.onmousemove = e => {
    letterEffect(e)
}
window.onmousedown = e => {
    letterEffect(e)
}

function random(array) {
    let randomIndex = Math.floor(Math.random() * array.length);
    return array[randomIndex];
}

const calcDistance = (a, b) => {
    const diffX = b.x - a.x,
            diffY = b.y - a.y;
    
    return Math.sqrt(Math.pow(diffX, 2)+Math.pow(diffY, 2));
}

const calcTimeDifference = (s, e) => e-s;

function letterEffect(e) {
    const letter = document.createElement("i");
    letter.className = `fa-solid fa-${random(effectLetters)} l`;

    let mouseX = e.clientX;
    let mouseY = e.clientY;

    letter.style.left = `${mouseX}px`;
    letter.style.top = `${mouseY}px`;
    letter.style.color = random(effectLetterColors);
    letter.style.fontSize = random(effectLetterSizes);
    letter.style.textShadow = `0px 0px 1.5rem rgb(${random(effectLetterColors)} / 0.5)`;
    letter.style.animationName = random(effectLetterAnimations);

    const now = new Date().getTime()
        hasMovedFarEnough = calcDistance(effectLetterLatsPos.letterPos, effectLetterLatsPos.mousePos) >= 75,
        hasBeenLongEnough = calcTimeDifference(effectLetterLatsPos.letterTime, now) > 250;

    effectLetterLatsPos.mousePos = {x: e.clientX, y: e.clientY};
    if (hasBeenLongEnough || hasMovedFarEnough) {
        document.body.appendChild(letter);
        effectLetterLatsPos.letterPos = effectLetterLatsPos.mousePos;
        effectLetterLatsPos.letterTime = new Date().getTime();
        setTimeout(() => { document.body.removeChild(letter) }, 1500);
    }   
}