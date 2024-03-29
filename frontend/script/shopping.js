

document.getElementById('add').onclick = () => {
    addMoreRow()
    addData()
}

document.getElementById('create_recodes').onclick = () => {
    postData()
}
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
    getList()
}

let loader = () => {
    if (document.querySelector('.spinner').style.visibility == 'visible') {
        document.querySelector('.spinner').style.visibility = 'hidden'
    } else {
        document.querySelector('.spinner').style.visibility = 'visible'
    }
}
let shopping_list = [];

function addMoreRow() {

    // document.getElementById('item_name').removeAttribute('id');
    // document.getElementById('item_quan').removeAttribute('id');
    // document.getElementById('item_price').removeAttribute('id');


    let list_div = document.getElementById('list_div');

    let div = document.createElement('div');
    div.className = 'list';

    let item = document.createElement('input');
    item.placeholder = 'Item name'
    item.setAttribute('id', 'item_name')

    let quan = document.createElement('input');
    quan.placeholder = 'Quantity'
    quan.setAttribute('id', 'item_quan')
    quan.type = 'number'

    let price = document.createElement('input');
    price.placeholder = 'Price 1 piece'
    price.setAttribute('id', 'item_price')
    price.type = 'number'

    div.append(item, quan, price)

    list_div.append(div)
}

function addData() {
    let title = document.getElementById('list_name').value;

    let cat = document.getElementById('cat').value

    let name = document.getElementById('item_name').value;
    document.getElementById('item_name').removeAttribute('id');

    let quan = document.getElementById('item_quan').value;
    document.getElementById('item_quan').removeAttribute('id');

    let price = document.getElementById('item_price').value;
    document.getElementById('item_price').removeAttribute('id');

    // let obj={
    //     list_name:title,
    //     list:[
    //         {"name":name,"quan":quan,"price":price,"total":quan*price}
    //     ]
    // }

    let obj = {
        "title": title,
        "list": name,
        "total": quan * price,
        "cat": cat
    }

    if (!title || !name || !quan || !price) {

        return alert('All input fields are mandatery')
    } else {

        // if(shopping_list.length==0){
        //     shopping_list.push(obj)
        // }else{
        //     shopping_list[0].list.push(
        //         {"name":name,"quan":quan,"price":price,"total":quan*price}
        //     )
        // }
        shopping_list.push(obj)

    }
    console.log(shopping_list)
}


async function postData() {

    if (shopping_list.length == 0) {
        return alert("Please all fields")
    }
    loader()
    const res = await fetch('https://sore-tan-gecko-tam.cyclic.app/shopping', {
        method: "POST",
        body: JSON.stringify(shopping_list),
        headers: {
            'Content-Type': "application/json",
            'list': `${document.getElementById('list_name').value}`,
            'token': localStorage.getItem('token')
        }
    })
    let data = await res.json();
    loader()
    if (data.msg == 'List created succesfully') {
        Swal.fire({
            title: 'Nice Job!',
            text: "List created succesfully",
            icon: 'success',
            showCancelButton: false,
            background: '#ffffff',
            confirmButtonColor: '#C6604C',
            cancelButtonColor: "#AAAAAA",

        })
        setTimeout(() => {
            location.reload()
        }, 3000)
    }
}

async function getList() {
    loader()
    const res = await fetch('https://sore-tan-gecko-tam.cyclic.app/shopping', {
        method: "GET",
        headers: {
            'Content-Type': "application/json",
            'token': localStorage.getItem('token')

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

    console.log(msg)
}