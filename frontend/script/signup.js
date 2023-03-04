
window.onload=()=>{
    if(localStorage.getItem('loginWithGoogle')){
        loginWithGoogle()
      }
    
}
function loginWithGoogle() {
    const url = window.location.search;
    const query = new URLSearchParams(url);
    const token = query.get('token');
    const name = query.get('name')
    console.log(token, name)
    if (token && name) {
        localStorage.setItem('token', token)
        localStorage.setItem('name', name)
    }
    localStorage.removeItem('loginWithGoogle')
   location.href='index.html'
}

let signUp = document.getElementById('createAcc');
signUp.onclick = () => {
    createAccout()
}
let otp;

let loader = () => {
    if (document.querySelector('.spinner').style.visibility == 'visible') {
        document.querySelector('.spinner').style.visibility = 'hidden'
    } else {
        document.querySelector('.spinner').style.visibility = 'visible'
    }
}



async function createAccout() {
    //loder start running
    loader()
    let email = document.getElementById('email').value;
    let first_name = document.getElementById('first_name').value;
    let last_name = document.getElementById('last_name').value;
    let password = document.getElementById('password').value
    let form = { email, password, first_name, last_name };
    let res = await fetch('https://sore-tan-gecko-tam.cyclic.app/signup', {
        method: 'POST',
        body: JSON.stringify(form),
        headers: {
            "Content-Type": 'application/json'
        }
    })
    let { msg } = await res.json();
    loader()

    if (msg == 'User already exists') {
        Swal.fire({
            title: 'User Already Exist!!',
            text: "Try with different email Id!",
            icon: 'warning',
            showCancelButton: true,
            background: '#ffffff',

            confirmButtonColor: '#C6604C',
            cancelButtonColor: "#AAAAAA",
        })

    }
    else if (msg == "Something went wrong") {
        Swal.fire({
            title: 'Something went wrong!!',
            text: "Try again later",
            icon: 'warning',
            showCancelButton: false,
            background: '#ffffff',

            confirmButtonColor: '#C6604C',
            cancelButtonColor: "#AAAAAA",
        })
    }
    else if (msg == 'Otp Sent Successfully') {
        Swal.fire({
            title: 'Otp Sent Successfully',
            text: "Verify otp",
            icon: 'success',
            showCancelButton: false,
            background: '#ffffff',
            confirmButtonColor: '#C6604C',
            cancelButtonColor: "#AAAAAA",

        })
        setTimeout(() => {
            window.location.href = 'otp.html'
        }, 2000)
    }
    else if(msg=='Please choose strong password'){
        Swal.fire({
            title: 'Weak password!!',
            text: "Please choose strong password!",
            icon: 'warning',
            showCancelButton: false,
            background: '#ffffff',
            confirmButtonColor: '#C6604C',
            cancelButtonColor: "#AAAAAA",

        })
    }
    else {
        Swal.fire({
            title: 'All fields required',
            text: "Please provide all details",
            icon: 'warning',
            showCancelButton: false,
            background: '#ffffff',

            confirmButtonColor: '#C6604C',
            cancelButtonColor: "#AAAAAA",

        })
    }
}

let googleButton = document.getElementById('google')
googleButton.onclick = () => {
    signupBygoogle()
}
async function signupBygoogle() {
    localStorage.setItem('loginWithGoogle',true)
    localStorage.setItem('login',true)
   window.open('https://sore-tan-gecko-tam.cyclic.app/auth/google');

}

let github=document.getElementById('github')
github.onclick=()=>{
    signUpByGithub()
}
async function signUpByGithub() {
    localStorage.setItem('loginWithGoogle',true)
    localStorage.setItem('login',true)


}