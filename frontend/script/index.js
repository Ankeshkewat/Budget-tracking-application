

window.onload=()=>{
    getDataCat()
    getCash()
    getList()
}

document.getElementById('add').onclick=()=>{
    update_cash()
 }

async function getDataCat(){
    const res=await fetch('http://localhost:1000/shopping/cat',{
        method:"GET",
        headers:{
            'Content-Type':"application/json"
        }
     })
     let {msg}=await res.json();
     console.log(msg)
     msg.forEach((el)=>{
        let div=document.createElement('div');
        div.className='lists_con'
       
        let title=document.createElement('h4');
        title.innerText=el._id
        let total=document.createElement('h4')
        total.innerText='-₹'+el.total+'.00'
        total.className='money_minus'

        div.append(title,total)
       
        document.getElementById('circle').append(div)

     })

}

document.querySelector('#add_cash_btn button').onclick=()=>{
    console.log("YEs")
    document.getElementById('add_cash').style.display='block'
    document.querySelector('#add_cash_btn button').style.display='none'
}



async function update_cash(){
    let value=document.getElementById('cash').value;
    let form={cash:value}
    let res=await fetch('http://localhost:1000/update',{
        method:"PATCH",
        body:JSON.stringify(form),
        headers:{
            'Content-type':'application/json'
        }
    });
    let data=await res.json();
    alert(data.msg)
    location.reload()

}

async function getCash(){
    let res=await fetch('http://localhost:1000/get/cash');
    let {msg}=await res.json();
    console.log(msg)
    document.getElementById('cash_plus').innerText='₹'+msg.cash+'.00'
}



async function getList(){
    const res=await fetch('http://localhost:1000/shopping',{
        method:"GET",
        headers:{
            'Content-Type':"application/json"
        }
     })
     let {msg}=await res.json();
     console.log(msg)

     msg.forEach((el)=>{
        let div=document.createElement('div');
        div.className='lists_con'

        let div1=document.createElement('div');
        div1.className='lists1'

        let title=document.createElement('h4');
        title.innerText=el._id

        let length=document.createElement('p');
        length.innerText=el.count+" items"

        div1.append(title,length)
 
        let div2=document.createElement('div');
        div2.className='lists2'
        
        let total=document.createElement('h4');
        total.innerText= `₹`+el.total+".00"
        let p=document.createElement('p');
        p.innerText="Estimated"

        div2.append(total,p)
        
        div.append(div1,div2)

        document.getElementById('all').append(div)

     })
    
}
// window.onload = () => {
//     document.getElementById('logo').onclick = () => {
//         console.log('clicking on');
//         location = './index.html'
//     }
//     if (localStorage.getItem('token')) {
//         document.getElementById('sign-in').innerText = JSON.parse(localStorage.getItem('first_name'))
//         let dom = document.getElementById('navigate')
//         let btn = document.createElement('button')
//         // let btn = document.createElement('button')
//         btn.innerText = 'logout'
//         btn.style.backgroundColor = 'rgb(1, 36, 58)'
//         btn.style.color = 'white'
//         btn.style.border = 'none'
//         btn.id = 'logout'
//         btn.onmouseenter = () => {
//             btn.style.color = '#2F71CD'
//         }
//         btn.onmouseleave = () => {
//             btn.style.color = 'white'
//         }
//         dom.append(btn)
//         dom.style.width = '40%'
//     }
//     document.getElementById('logout').onclick = () => {
//         localStorage.removeItem('token')
//         localStorage.removeItem('first_name')
//         location.reload()
//     }

//     if (localStorage.getItem('firstTimeLogdin')) {
//         Swal.fire({
//             title: 'Hey, Good job!!',
//             text: `You logged in successfully!!`,
//             textColor: "white",
//             icon: 'success',
//             // color: 'white',
//             // iconColor: 'white',
//             showCancelButton: false,
//             // background: '#202030',
//             // confirmButtonColor: '#C6604C',
//             confirmButtonText: 'Ok'
//         })
//         localStorage.removeItem('firstTimeLogdin')
//     }

// }