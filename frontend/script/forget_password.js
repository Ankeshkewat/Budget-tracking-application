

let signUp = document.getElementById('createAcc');
signUp.onclick = () => {
    createAccout()
}
let loader = () => {
    if (document.querySelector('.spinner').style.visibility == 'visible') {
        document.querySelector('.spinner').style.visibility = 'hidden'
    } else {
        document.querySelector('.spinner').style.visibility = 'visible'
    }
}

async function createAccout() {
    let email = document.getElementById('email').value
    if (!email) {
        return alert("Please give all fields")
    }
    loader()
    let form = { email };
    let res = await fetch('https://sore-tan-gecko-tam.cyclic.app/forget', {
        method: 'POST',
        body: JSON.stringify(form),
        headers: {
            "Content-Type": 'application/json',
        }
    })
    let { msg } = await res.json();
    loader()
    document.getElementById('email').value=''
    if (msg == 'A verification link is sent to your email address') {
        Swal.fire({
            title: 'Link sent',
            text: "A verification link is sent to your email address",
            icon: 'success',
            showCancelButton: false,
            background: '#ffffff',

            confirmButtonColor: '#C6604C',
            cancelButtonColor: "#AAAAAA",
        })
    }
    else {

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
}