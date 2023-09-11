const prev = document.querySelector('.prev');
const next = document.querySelector('.next');
const steps = document.querySelectorAll('.step');
const container = document.querySelector('.registration-form');
const info = document.querySelectorAll('.info');
const password = document.querySelectorAll('.password');
const stepCounters = document.querySelectorAll('.counter');
const stepSubCounters = document.querySelectorAll('.sub-counter');

const codeInputs = document.querySelectorAll('.confirm-code-wrapper input[type="number"]');

let current = 0;
var confirmEmail = false;

// COLORS
var primary = getComputedStyle(document.documentElement).getPropertyValue('--primary');
var secondary = getComputedStyle(document.documentElement).getPropertyValue('--secondary');
var onPrimary = getComputedStyle(document.documentElement).getPropertyValue('--on-primary');
var onsecondary = getComputedStyle(document.documentElement).getPropertyValue('--on-secondary');

changeCurrent(0);

document.addEventListener('invalid', (function () {
    return function (e) {
        e.preventDefault();
        // document.querySelectorAll("info").focus();
    };
})(), true);

document.activeElement.blur();


container.addEventListener('wheel', function(e) {
    e.preventDefault();
}, { passive: false });
container.addEventListener('touchmove', function(e) {
    e.preventDefault();
}, { passive: false });

prev.addEventListener('click', () => {
    changeCurrent(-1);
});
next.addEventListener('click', () => {
    changeCurrent(1);
});


codeInputs.forEach((input, index) => {
    
    $(input).on('input', function(e) {
        this.value = this.value.replace(/[^0-9]/g, '')
        if (this.value.length > 1) {
            this.value = this.value.slice(-1);
        }


        if (index < 5 && this.value.length !== 0) setTimeout(() => codeInputs[index + 1].focus(), 0);


        var filled = true;
        for (let i = 0; i < codeInputs.length; i++) {
            const element = codeInputs[i];
            if (element.value === '') {
                filled = false;
                break;
            } 
        }

        if (filled) {
            correctCode();     
        }
    });
});




function changeCurrent(c) {
    if (current+c < 0 || current+c > 3) {
        return
    }

    prev_curr = current;
    current+=c;

    switch (current) {
        case 0:
            changeCounter(0);
            prev.style.display = 'none'

            next.classList.add('disabled')
            info.forEach(element => {
                if (element.reportValidity()) {
                    next.classList.remove('disabled');
                }
            });

            info[0].addEventListener('input', () => {
                if (info[0].reportValidity() && info[1].reportValidity()) {
                    next.classList.remove('disabled')
                } else {
                    next.classList.add('disabled')
                }
            });
            info[1].addEventListener('input', () => {
                confirmEmail = false;
                if (info[0].reportValidity() && info[1].reportValidity()) {
                    next.classList.remove('disabled')
                } else {
                    next.classList.add('disabled')
                }
            });

            // SCROLL
            if(prev_curr < current) {
                container.scrollBy({ left: container.offsetWidth, behavior: 'smooth' });
            } else {
                container.scrollBy({ left: -container.offsetWidth, behavior: 'smooth' });
            }
            break;

        case 1:
            changeCounter(1);
            prev.style.display = 'block';

            if (!confirmEmail) {
                next.classList.add('disabled');
                codeInputs.forEach(element => {
                    element.classList.remove('correct');
                    element.value = '';
                });
            }

            // TODO: send email


            // SCROLL
            if(prev_curr < current) {
                container.scrollBy({ left: container.offsetWidth, behavior: 'smooth' });
            } else {
                container.scrollBy({ left: -container.offsetWidth, behavior: 'smooth' });
            }
            break;
            
        case 2:
            changeCounter(2);
            prev.style.display = 'block';
            next.classList.remove('submit');
            next.textContent = 'Next';

            next.classList.add('disabled')
            password.forEach(element => {
                if (element.reportValidity()) {
                    next.classList.remove('disabled');
                }
            });

            password[0].addEventListener('input', () => {
                if (password[0].reportValidity() && password[1].reportValidity()) {
                    next.classList.remove('disabled')
                } else {
                    next.classList.add('disabled')
                }
            });
            password[1].addEventListener('input', () => {
                if (password[0].reportValidity() && password[1].reportValidity()) {
                    next.classList.remove('disabled')
                } else {
                    next.classList.add('disabled')
                }
            });
            if(prev_curr < current) {
                container.scrollBy({ left: container.offsetWidth, behavior: 'smooth' });
            } else {
                container.scrollBy({ left: -container.offsetWidth, behavior: 'smooth' });
            }

            break;

        
        case 3:
            changeCounter(3);
            next.classList.add('submit', 'disabled');
            next.textContent = 'SUBMIT';

            if (grecaptcha.getResponse().length !== 0) {
                next.classList.remove('disabled');
                stepCounters[3].classList.add('counted');
            }

            if(prev_curr < current) {
                container.scrollBy({ left: container.offsetWidth, behavior: 'smooth' });
            } else {
                container.scrollBy({ left: -container.offsetWidth, behavior: 'smooth' });
            }
            break;
            
        default:
            // next.style.backgroundColor = primary;
            break;
    }
}

function moveFocus(e, i) {
    if (e.key === "Backspace" || e.key === "Delete") {
        if (i.value.length === 0) {
            if (i.previousElementSibling) {
                setTimeout(() => i.previousElementSibling.focus(), 0);
                i.previousElementSibling.value = '';
            }
        }
    }
}

function wrongCode() {
    codeInputs.forEach(element => {
        element.classList.add('incorrect');
    });
    setTimeout(() => {
        codeInputs.forEach(element => {
            element.classList.remove('incorrect');
            element.value = '';
        });
        codeInputs[0].focus();
    }, 1000);
}

function correctCode() {
    codeInputs.forEach((element, index) => {
        setTimeout(() => {
            element.classList.add('correct');
        }, index* 70);
    });
    codeInputs[5].blur();
    next.classList.remove('disabled');
    confirmEmail = true;
}


function recaptchaSuccess() {
    next.classList.remove('disabled');
    if (current===3) {
        stepCounters[3].classList.add('counted');
    }
}

function recaptchaExpired() {
    next.classList.add('disabled');
    if (current===3) {
        stepCounters[3].classList.remove('counted');
    }
}

function changeCounter(c) {
    stepCounters.forEach(element => {
        element.classList.remove('counting', 'counted');
    });
    stepSubCounters.forEach(element => {
        element.classList.remove('counted');
    });


    for (let i = 0; i < c; i++) {
        stepCounters[i].classList.add('counted');
        stepSubCounters[i].classList.add('counted');
    }
    stepCounters[c].classList.add('counting');
}