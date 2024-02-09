const steps = document.querySelectorAll('.step');
const steppers = document.querySelectorAll('.stepper');

const counters = document.querySelectorAll('.counter');
const subcounters = document.querySelectorAll('.sub-counter');

const errorText = document.querySelector('.error');

const codeInputs = document.querySelectorAll('input[name="codeInput"]');

const usernameInput = document.querySelector('.input input[type="text"]');
const icnLoading = document.querySelector('.icn-loading');
const emailInput = document.querySelector('.input input[type="email"]');
const passwordInput = document.querySelector('.input input[name="password1"]');
const passwordConfirmInput = document.querySelector('.input input[name="password2"]');

const form = document.querySelector('.signup-form');
const submit = document.querySelector('.stepper-container button[type="submit"]');

const grecaptcha = document.querySelector('.g-recaptcha');

// getCookie()

[usernameInput, emailInput, passwordInput, errorText].forEach((e) => {
    e.addEventListener('animationend', () => {
        e.classList.remove('shake');
    });
    
    e.addEventListener('input', function() {
        invalidateInput(e, '');
    });
});
form.addEventListener('submit', async (e) => {
    e.preventDefault()

    formData = new FormData(form)
    data = await requestFD(
        url='https://aword-api.onrender.com/account/signup/',
        method='POST',
        body=formData
    )

    if (data['error']) {
        err = data["error"]
        if (err['username']) {
            errorText.textContent = err['username'][0]
            return
        } else if (err["email"]) {
            errorText.textContent = err['email'][0]
            return
        } else if (err["password1"]) {
            errorText.textContent = err['password1'][0]
            return
        } else if (err["password2"]) {
            errorText.textContent = err['password2'][0]
            return
        }
    }

    setCookie('access', data['access'], 1);
    setCookie('refresh', data['refresh'], 7);

    window.location.replace("home");
})
passwordConfirmInput.addEventListener('input', () => {
    if (passwordInput.value!==passwordConfirmInput.value) {
        invalidateInput(passwordConfirmInput, 'Passwords do not match');
    } else {
        invalidateInput(passwordConfirmInput, '');
    }
});
usernameInput.addEventListener('blur', async () => {
    if (!usernameInput.checkValidity()) return;
    icnLoading.style.display = 'block';
    data = await request(
        'https://aword-api.onrender.com/account/signup/checkAvailability/',
        'POST',
        {'Content-Type': 'application/json'},
        {'username': usernameInput.value}
    )
    icnLoading.style.display = 'none';

    if (!data['ok']) {
        invalidateInput(usernameInput, 'Username is taken');
        showErrorMessage(usernameInput);
        usernameInput.blur();
    }
});
emailInput.addEventListener('blur', async () => {
    if (!emailInput.checkValidity()) return;
    data = await request(
        'https://aword-api.onrender.com/account/signup/checkAvailability/',
        'POST',
        {'Content-Type': 'application/json'},
        {'email': emailInput.value}
    )

    if (!data['ok']) {
        invalidateInput(emailInput, 'E-mail is already in use');
        showErrorMessage(emailInput);
        emailInput.blur();
    }
});

let currentStep = 0;
changeSteppers();


let emailConfirmed = false;
steppers.forEach((e, i) => {
    e.addEventListener('click', async () => {
        if (i==1) {
            if (currentStep==3) return;
            switch (currentStep) {
                case 0:
                    if (!validateInput(usernameInput, "Invalid username")) return;
                    if (!validateInput(emailInput, "Invalid e-mail")) return;
                    data = await request('https://aword-api.onrender.com/account/signup/requestOTP/',
                            'POST',
                            {'Content-Type': 'application/json'},
                            {'email': emailInput.value}
                    )
                    if (!data['ok']) return;
                    break;
                case 1:
                    // TODO: Send otp email
                    
                    if (emailConfirmed) break; 
                    codeInputs.forEach(e => {
                        e.classList.add('shake');
                    });
                    return;
                case 2:
                    if (!validateInput(passwordInput, 'Invalid password')) return;
                    if (!validateInput(passwordConfirmInput, 'Passwords do not match')) return;
                    break;
            }
            currentStep++;
            errorText.textContent = '';
            changeSteppers();
            changeCounter();
            changeStep();
        } else {
            if (currentStep==0) return;
            currentStep--;
            errorText.textContent = '';
            changeSteppers();
            changeCounter();
            changeStep();
        }
    });
});

codeInputs.forEach((e, i) => {
    e.addEventListener('input', async () => {
        e.value = e.value.replace(/[^0-9]/g, '');
        if (e.value.length > 1) {
            e.value = e.value.slice(-1);
        }
        
        if (i < 5 && e.value.length !== 0) codeInputs[i + 1].focus();

        let filled = true;
        for (j=0; j<codeInputs.length; j++) {
            if (codeInputs[j].value.length == 0) {
                filled = false;
                break;
            }
        }

        if (filled) {
            let otp=[]
            codeInputs.forEach(element => {
                otp.push(element.value)
            });
            data = await request('https://aword-api.onrender.com/account/signup/verifyOTP/',
                    'POST',
                    {'Content-Type': 'application/json'},
                    {'otp': otp}
            )


            data['ok'] ? correctCode() : incorrectCode();
        }

    });
    e.addEventListener('animationend', () => {
        e.classList.remove('jump', 'shake');
    });
});


function changeSteppers() {
    if (currentStep == 3) {
        steppers[1].classList.add('disabled');
    } else if (currentStep == 0) {
        steppers[0].classList.add('disabled');
    } else {
        steppers[0].classList.remove('disabled');
        steppers[1].classList.remove('disabled');
    }
}

function changeStep() {
    steps.forEach((e) => {        
        if (e.classList.contains('step-active')) {
            e.classList.remove('step-active');
        }
    });

    steps[currentStep].classList.add('step-active', 'anim-in');
}

function changeCounter() {
    for (i = 0; i < currentStep; i++) {
        counters[i].classList.remove('counting');
        counters[i].classList.add('counted');
        subcounters[i].classList.remove('counting');
        subcounters[i].classList.add('counted');
    }
    for (i = 3; i >= currentStep; i--) {
        counters[i].classList.remove('counting', 'counted');
        i<=2 && subcounters[i].classList.remove('counted');
    }
    counters[currentStep].classList.add('counting');
    if (currentStep===3 && !submit.classList.contains('disabled')) {
        counters[currentStep].classList.remove('counting');
        counters[currentStep].classList.add('counted');
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



function correctCode() {
    codeInputs.forEach((e, i) => {
        e.blur();
        e.tabIndex = -1;
        e.classList.add('correct');
        setTimeout(() => {
            e.classList.add('jump');
        }, i*70);
    });
    emailConfirmed = true;
}
function incorrectCode() {
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

function validateInput(input, invalidMessage) {
    if (input.value.length == 0) {
        input.classList.add('shake');
        return false;
    } else if (!input.checkValidity()) {
        !input.validity.customError && invalidateInput(input, invalidMessage);
        showErrorMessage(input);
        return false;
    }
    return true;
}

function invalidateInput(input, message) {
    input.setCustomValidity(message);
}

function showErrorMessage(e) {
    if (!e.checkValidity()) {
        errorText.textContent = e.validationMessage;
        errorText.classList.add('shake');
        e.focus();
    } else {
        errorText.textContent = '';
    }
}


function recaptchaSuccess() {
    submit.classList.remove('disabled');
    if (currentStep===3) {
        counters[3].classList.remove('counting');
        counters[3].classList.add('counted');
    }
}

function recaptchaExpired() {
    submit.classList.add('disabled');
    if (currentStep === 3) {
        counters[3].classList.remove('counted');
        counters[3].classList.add('counting');
    }
}

async function request(url, method, headers, body) {
    const response = await fetch(url, {method:method, headers:headers, body:JSON.stringify(body)})
    data = await response.json();
    if (data['detail']) {
        if (!getCookie('refresh')) {
            window.location.href = 'login';
        }
        console.log(data);
        // Invalid ACCESS token
        if (data['code']==='token_not_valid' && data['messages'] && data['messages'][0]['token_type']==='access') {
            const refreshData = await request('https://aword-api.onrender.com/account/refresh/', 'POST', {'Content-Type': 'application/json'}, {'refresh':getCookie('refresh')});
            setCookie('access', refreshData['access'], 1);
        }
    }

    return data;
}

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