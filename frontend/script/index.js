let loader = () => {
    if (document.querySelector('.spinner').style.visibility == 'visible') {
        document.querySelector('.spinner').style.visibility = 'hidden'
    } else {
        document.querySelector('.spinner').style.visibility = 'visible'
    }
}
window.onload = () => {

    if (localStorage.getItem('token') && localStorage.getItem('name')) {
        getDataCat()
        getCash()
        getList()
    }
}
document.getElementById('add').onclick = () => {
    update_cash()
}


if (!localStorage.getItem('token') && !localStorage.getItem('loginWithGoogle')) {
    Swal.fire({
        title: 'You are not authorized',
        text: "You have to login first",
        icon: 'warning',
        showCancelButton: false,
        background: '#ffffff',
        confirmButtonColor: '#C6604C',
        cancelButtonColor: "#AAAAAA",

    })
    setTimeout(() => {
        location.href = 'signup.html'
    }, 3000)
}

if (localStorage.getItem('login') && localStorage.getItem('token') && localStorage.getItem('name')) {

    Swal.fire({
        title: 'Login successful',
        text: "Now you can use all the features",
        icon: 'success',
        showCancelButton: false,
        background: '#ffffff',
        confirmButtonColor: '#C6604C',
        cancelButtonColor: "#AAAAAA",

    })
    localStorage.removeItem('login')

}



async function getDataCat() {
    const res = await fetch(`https://sore-tan-gecko-tam.cyclic.app/shopping/cat`, {
        method: "GET",
        headers: {
            'Content-Type': "application/json",
            "token": localStorage.getItem('token')
        }
    })
    let { msg } = await res.json();
    console.log(msg)
    let count = 0
    msg.forEach((el) => {
        let div = document.createElement('div');
        div.className = 'lists_con'

        let title = document.createElement('h4');
        title.innerText = el._id
        let total = document.createElement('h4')
        total.innerText = '-₹' + el.total + '.00'
        count += (+el.total)
        total.className = 'money_minus'

        div.append(title, total)

        document.getElementById('circle').append(div)
    })
    document.getElementById('cash_minus').innerText = "₹" + count + ".00"

}

document.querySelector('#add_cash_btn button').onclick = () => {
    document.getElementById('add_cash').style.display = 'block'
    document.querySelector('#add_cash_btn button').style.display = 'none'
}



async function update_cash() {
    loader()
    let value = document.getElementById('cash').value;
    let form = { cash: value }
    let res = await fetch('http://localhost:1600/update', {
        method: "PATCH",
        body: JSON.stringify(form),
        headers: {
            "token": localStorage.getItem('token'),
            'Content-type': 'application/json'
        }
    });
    let data = await res.json();
    loader()
    alert(data.msg)
    location.reload()

}

async function getCash() {
    let res = await fetch('https://sore-tan-gecko-tam.cyclic.app/get/cash', {
        headers: {
            "token": localStorage.getItem('token'),
        }
    });
    let { msg } = await res.json();
    console.log(msg)
    if (msg == 'PLease login again' || msg == 'Something went wrong') {
        document.getElementById('cash_plus').innerText = '₹' + 0 + '.00'

    } else {
        document.getElementById('cash_plus').innerText = '₹' + msg.cash + '.00'
    }
}



async function getList() {
    loader()
    const res = await fetch('https://sore-tan-gecko-tam.cyclic.app/shopping', {
        method: "GET",
        headers: {
            "token": localStorage.getItem('token'),
        }
    })
    let { msg } = await res.json();
    loader()

    msg.forEach((el) => {
        let div = document.createElement('div');
        div.className = 'lists_con'

        let div1 = document.createElement('div');
        div1.className = 'lists1'

        let title = document.createElement('h4');
        title.innerText = el._id

        let length = document.createElement('p');
        length.innerText = el.count + " items"

        div1.append(title, length)

        let div2 = document.createElement('div');
        div2.className = 'lists2'

        let total = document.createElement('h4');
        total.innerText = `₹` + el.total + ".00"
        let p = document.createElement('p');
        p.innerText = "Estimated"

        div2.append(total, p)

        div.append(div1, div2)

        document.getElementById('all').append(div)
    })

}
