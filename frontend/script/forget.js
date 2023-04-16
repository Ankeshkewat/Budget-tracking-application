

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

  const url = window.location.search;
  console.log("url",url);
  const query = new URLSearchParams(url);
  console.log("query",query)
  const email = query.get('token');
  console.log("email",email)
async function createAccout(){
    let password=document.getElementById('password').value
    let c_password=document.getElementById('c_password').value
 
    if(!c_password||!password){
        return alert("Please give all fields")
    }
    loader()
    let form={c_password,password,token:email};
    console.log(form)
    let res=await fetch('https://sore-tan-gecko-tam.cyclic.app/reset',{
        method:'PATCH',
        body:JSON.stringify(form),
        headers:{
            "Content-Type":'application/json',
        }
    })
    let {msg}=await res.json();
    console.log(msg)
    loader()
    if(msg=='Password updated'){
        Swal.fire({
            title: 'Congratulations!!',
            text: "Your password has been reset",
            icon: 'success',
            showCancelButton: false,
            background: '#ffffff',
            confirmButtonColor: '#C6604C',
            cancelButtonColor: "#AAAAAA",
          })
    }
    else if(msg=='Password did not match'){
      Swal.fire({
        title: 'Password did not match!!',
        text: "Try again later",
        icon: 'warning',
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