

let signUp=document.getElementById('createAcc');
signUp.onclick=()=>{
    createAccout()
}
let loader = () => {
    if (document.querySelector('.spinner').style.visibility == 'visible') {
      document.querySelector('.spinner').style.visibility = 'hidden'
    } else {
      document.querySelector('.spinner').style.visibility = 'visible'
    }
  }

async function createAccout(){
    let email=document.getElementById('email').value
    let password=document.getElementById('password').value
    if(!email||!password){
        return alert("Please give all fields")
    }
    loader()
    let form={email,password};
    let res=await fetch('https://sore-tan-gecko-tam.cyclic.app/login',{
        method:'POST',
        body:JSON.stringify(form),
        headers:{
            "Content-Type":'application/json',
        }
    })
    let {msg,token,name}=await res.json();
    loader()
    if(msg=='Login succesfull'){
        localStorage.setItem('token',token)
        localStorage.setItem('name',name)
        localStorage.setItem('login',true)
        window.location.href='index.html'
     
    }
    else if(msg=='Somethng went wrong'){
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
    else if(msg=='incorrect password'){
        Swal.fire({
            title: 'Incorrect password!!',
            text: "Try again",
            icon: 'warning',
            showCancelButton: false,
            background: '#ffffff',

            confirmButtonColor: '#C6604C',
            cancelButtonColor: "#AAAAAA",
          })
    }
    else if(msg=='Invailid credentials'){
        Swal.fire({
            title: 'Account not found!!',
            text: "Try again",
            icon: 'warning',
            showCancelButton: false,
            background: '#ffffff',
            confirmButtonColor: '#C6604C',
            cancelButtonColor: "#AAAAAA",
          })
    }
}