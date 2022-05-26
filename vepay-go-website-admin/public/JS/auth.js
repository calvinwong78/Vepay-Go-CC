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

