const floatingLettersContainer = document.querySelector(".floating-letters");

const floatingLetterTimeDelta = 500;
const floatingLetterMaxNum = 5;

const floatingLetterSizes = ['3rem', '2rem', '2.5rem'];
const floatingLetterAnimTimes = [400, 800, 600, 1000];

const floatingLetterInterval = setInterval(() => {
    const l = document.createElement("span");
    l.className = `fa-solid fa-${random(effectLetters)} fl`;
    l.style.fontSize = random(floatingLetterSizes);
    l.style.color = random(effectLetterColors);

    const animTime = random(floatingLetterAnimTimes);
    l.style.animationDuration = animTime+'ms';
    l.style.transition = `all ${animTime*5}ms linear`;

    const screenHeight = window.innerHeight;
    const screenWidth = window.innerWidth;

    const startEdge = Math.floor(Math.random()*4)+1;
    // const startEdge = 1;

    let startPos;
    if (startEdge===1 || startEdge===3) {
        // Top or bottom edge
        startPos = Math.random() * screenWidth;
    } else {
        // Left or right edge
        startPos = Math.random() * screenHeight;
    }

    let endEdge;
    do {
        endEdge = Math.floor(Math.random()*4)+1;
    } while (endEdge===startEdge);

    let endPos;
    if (endEdge === 1 || endEdge === 3) {
        // Top or bottom edge
        endPos = Math.random() * screenWidth;
    } else { 
        // Left or right edge
        endPos = Math.random() * screenHeight;
    }

    if (startEdge === 1) { 
        // Top edge
        l.style.left = startPos + 'px';
        l.style.top = '-100px';
    } else if (startEdge === 2) { 
        // Right edge
        l.style.left = screenWidth + 'px';
        l.style.top = startPos + 'px';
    } else if (startEdge === 3) { 
        // Bottom edge
        l.style.left = startPos + 'px';
        l.style.top = screenHeight + 'px';
    } else { 
        // Left edge
        l.style.left = '-100px';
        l.style.top = startPos + 'px';
    }

    const enoughSpace = floatingLettersContainer.children.length < floatingLetterMaxNum;

    if (enoughSpace) {
        floatingLettersContainer.appendChild(l);
    }

    setTimeout(() => {
        switch (endEdge) {
            case 1:
                l.style.top = '-100px';
                l.style.left = endPos + 'px';
                break;
            case 2:
                l.style.top = endPos + 'px';
                l.style.left = screenWidth + 100 + 'px';
                break;
            case 3:
                l.style.top = screenHeight + 100 + 'px';
                l.style.left = endPos + 'px';
                break;
            case 4:
                l.style.top = endPos + 'px';
                l.style.left = '-100px';
                break;
        }
    }, 100);

    l.addEventListener("transitionend", function removehandler() {
        l.removeEventListener('transitionend', removehandler);
        l.parentNode.removeChild(l);
    });
}, floatingLetterTimeDelta);  