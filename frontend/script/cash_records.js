

window.onload = () => {
    if (!localStorage.getItem('token')) {
        Swal.fire({
            title: 'You are not authorized',
            text: "You have to login first. redirecting you to signup page",
            icon: 'warning',
            showCancelButton: false,
            background: '#ffffff',
            confirmButtonColor: '#C6604C',
            cancelButtonColor: "#AAAAAA",

        })
        setTimeout(() => {
            location.href = 'signup.html'
        }, 4000)
    }
    //************** */
    getCash()
}

let loader = () => {
    if (document.querySelector('.spinner').style.visibility == 'visible') {
        document.querySelector('.spinner').style.visibility = 'hidden'
    } else {
        document.querySelector('.spinner').style.visibility = 'visible'
    }
}


let money = [];
let dateArray = [];
async function getCash() {
    loader()
    const res = await fetch('https://sore-tan-gecko-tam.cyclic.app/get/cash/record', {
        method: "GET",
        headers: {
            'Content-Type': "application/json",
            'token': localStorage.getItem('token')

        }
    })
    let { msg } = await res.json();
    loader()
    console.log(msg)

    msg.forEach((el) => {
        let div = document.createElement('div');
        div.className = 'lists_con'

        let div1 = document.createElement('div');
        div1.className = 'lists1'

        let date = el.date.split(' ');
        let day = date[2];
        let month = date[1];
        let year = date[3];
        let time = date[4]
        dateArray.push(day + " " + month)

        let title = document.createElement('h4');
        title.innerText = day + ' ' + month + ' ' + year

        let length = document.createElement('p');
        length.innerText = time

        div1.append(title, length)

        let div2 = document.createElement('div');
        div2.className = 'lists2'
        let p = document.createElement('p');
        let total = document.createElement('h4');
        let cash = el.cash
        money.push(cash)
        if (cash < 0) {
            total.style.color = 'red'
            p.innerText = 'Debited'
        } else {
            total.style.color = 'green'
            p.innerText = 'Credited'

        }
        cash = Math.abs(cash)
        total.innerText = `₹` + cash + ".00"

        div2.append(total, p)

        div.append(div1, div2)
        document.getElementById('all').append(div)

    })
    money.reverse()
    dateArray.reverse()
    appendChart()
    document.getElementById('myChart').style.display = 'block';
}


//append chart
async function appendChart() {
    // console.log('date is', dateArray)
    // console.log('money is', money)
    var ctx = document.getElementById('myChart');
    var myChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: dateArray,
            datasets: [{
                label: 'Cash records',
                data: money,
                fill: false,
                borderColor: 'rgb(75, 192, 192)',
                tension: 0.1
            }],
        },
        options: {
            scales: {
                xAxes: [{
                    ticks: {
                        beginAtZero: true
                    }
                }]
            }
        }
    })
}