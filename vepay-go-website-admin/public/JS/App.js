const button = document.querySelector('.call');
button.addEventListener('click', () => {
    //getfunction 
    const sayHello = firebase.functions().httpsCallable('sayHello');
    sayHello({ name : 'marcel' }).then(result => {
        console.log(result.data)
    });
})
