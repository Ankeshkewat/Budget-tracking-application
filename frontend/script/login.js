

let signUp=document.getElementById('createAcc');
signUp.onclick=()=>{
    createAccout()
}

async function createAccout(){
    let email=document.getElementById('email').value
    let password=document.getElementById('password').value
    let form={email,password};
    let res=await fetch('http://localhost:1600/login',{
        method:'POST',
        body:JSON.stringify(form),
        headers:{
            "Content-Type":'application/json',
        }
    })
    let {msg,token,name}=await res.json();
    alert(msg)
    if(msg=='Login succesfull'){
        localStorage.setItem('token',token)
        localStorage.setItem('name',name)
       window.location.href='index.html'
    }
}