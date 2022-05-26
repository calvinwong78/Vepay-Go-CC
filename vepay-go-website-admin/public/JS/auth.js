/* eslint-disable no-undef */
const authenticationswitch = document.querySelectorAll('.switch');
const authenticationmodal = document.querySelectorAll('.auth .modal');
const authenticationwrapping = document.querySelector('.auth');
const register = document.querySelector('.register');
const login = document.querySelector('.login');
const signout = document.querySelector('.signout');

authenticationswitch.forEach(link => {
    link.addEventListener('click', () => {
        authenticationmodal.forEach((modal) => modal.classList.toggle('active'))
    });
});

register.addEventListener('submit', (e) => {
    e.preventDefault();

    const email = register.email.value;
    const password = register.password.value;

    // eslint-disable-next-line no-undef
    firebase.auth().createUserWithEmailAndPassword(email, password)
        .then((user) => {
            console.log('registered', user);
            register.reset();
        })
        .catch((error) => {
            register.querySelector('.error').textContent = error.message;
        })
})

login.addEventListener('submit', (e) => {
    e.preventDefault();

    const email = login.email.value;
    const password = login.password.value;

    // eslint-disable-next-line no-undef
    firebase.auth().signInWithEmailAndPassword(email, password)
        .then((user) => {
            console.log('logged in !!', user);
            login.reset();
        })
        .catch((error) => {
            login.querySelector('.error').textContent = error.message;
        })
});

 firebase.auth().onAuthStateChanged((user) => {
    if(user) {
        authenticationwrapping.classList.remove('open');
        authenticationmodal.forEach(modal => modal.classList.remove('active'));
    } else {
        authenticationwrapping.classList.add('open');
        authenticationmodal[0].classList.add('active');
    }
})

signout.addEventListener('click', () => {
    firebase.auth().signOut()
        .then(() => console.log('signing out !!'))
})