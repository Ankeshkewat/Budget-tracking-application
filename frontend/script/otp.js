
// let otp= window.prompt('Please enter 4 digits otp');
async function OTPFUN(){
    let otp=document.getElementById('otp').value;
    let email=localStorage.getItem('email')||null
    let form={otp,email}

       
       let otp_res=await fetch('http://localhost:1000/verify',{
         method:"POST",
         body:JSON.stringify(form),
         headers:{
             'Content-Type':'application/json'
         }
       })
       let otp_stream=await otp_res.json();
       alert(otp_stream.msg)
       if(otp_stream.msg=='Account Created Successfully'){
        localStorage.setItem('token',otp_stream.token)
        localStorage.setItem('name',otp_stream.name)
       window.location.href='index.html'
       }
   }