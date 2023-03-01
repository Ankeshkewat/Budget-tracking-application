// import { navbar } from "../component/navbar.js";
// document.querySelector('nav').innerHTML=navbar()


let signUp=document.getElementById('createAcc');
signUp.onclick=()=>{
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


async function createAccout(){
    //loder start running
    loader()
    let email=document.getElementById('email').value;
    let first_name=document.getElementById('first_name').value;
    let last_name=document.getElementById('last_name').value ;
    let password=document.getElementById('password').value
    let form={email,password,first_name,last_name};
    let res=await fetch('https://sore-tan-gecko-tam.cyclic.app/signup',{
        method:'POST',
        body:JSON.stringify(form),
        headers:{
            "Content-Type":'application/json'
        }
    })
    let data=await res.json();
    console.log(data)

    if (data.msg == 'Account has been already created') {
        Swal.fire({
            title: 'User Already Exist!!',
            text: "Try with diffrent Email Id!",
            icon: 'warning',
            showCancelButton: false,
            background: '#202030',
            confirmButtonColor: '#C6604C',
            cancelButtonColor: "#AAAAAA",
            // confirmButtonText: 'Yes, add this hotel!'
        })

    }
    
    if(data.msg=='Otp Sent Successfully'){
        alert(data.msg)
        // document.cookie=`token=${data.token}`
        // document.cookie=`refrestoken=${data.refreshtoken}`
        // localStorage.setItem('token',data.token)
        // localStorage.setItem('email',data.email)
        window.location.href='otp.html'
       
    }else{
        alert(data.msg)
    }
}

let googleButton=document.getElementById('google')
googleButton.onclick=()=>{
    signupBygoogle()
}
async function signupBygoogle(){
    
   const res= await window.open('http://localhost:1600/auth/google');
  console.log(document.cookie)
   
}