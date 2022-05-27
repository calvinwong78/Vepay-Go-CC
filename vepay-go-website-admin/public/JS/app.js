

const getButton =document.getElementById('get')
const postButton =document.getElementById('post')
const inputing =document.getElementById('inputing')

const baseUrl = 'https://us-central1-vepay-go.cloudfunctions.net/user/users'

getButton.addEventListener('click', getInfo)
async function getInfo(e){
    e.preventDefault()
    const res = await fetch(baseUrl,
    {
        method: 'GET'
    })
    console.log(res)
    const data = await res.json()
    inputing.value = data.users
}