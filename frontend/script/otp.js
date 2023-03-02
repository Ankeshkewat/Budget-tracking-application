
// let otp= window.prompt('Please enter 4 digits otp');
document.getElementById('Check').onclick = () => {
  OTPFUN()
}

let loader = () => {
  if (document.querySelector('.spinner').style.visibility == 'visible') {
    document.querySelector('.spinner').style.visibility = 'hidden'
  } else {
    document.querySelector('.spinner').style.visibility = 'visible'
  }
}


async function OTPFUN() {
  loader()
  let otp = document.getElementById('otp').value;
  let form = { otp }



  let otp_res = await fetch('https://sore-tan-gecko-tam.cyclic.app/verify', {
    method: "POST",
    body: JSON.stringify(form),
    headers: {
      'Content-Type': 'application/json'
    }
  })
  let otp_stream = await otp_res.json();
  loader()

  if (otp_stream.msg == 'Account Created Successfully') {
    localStorage.setItem('token', otp_stream.token)
    localStorage.setItem('name', otp_stream.name)

    Swal.fire({
      title: 'Congratulations!',
      text: "Account created successfully",
      icon: 'success',
      showCancelButton: false,
      background: '#ffffff',
      confirmButtonColor: '#C6604C',
      cancelButtonColor: "#AAAAAA",

    })
    localStorage.setItem('login',true)
    setTimeout(() => {
      window.location.href = 'index.html'
    }, 2000)

  }
  else if (otp_stream.msg == 'Something went wrong' || otp_stream.msg == 'Some error') {
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
  else if(otp_stream.msg=='Wrong otp'){
    Swal.fire({
      title: 'Wrong OTP!!',
      text: "Please enter correct OTP",
      icon: 'warning',
      showCancelButton: false,
      background: '#ffffff',
      confirmButtonColor: '#C6604C',
      cancelButtonColor: "#AAAAAA",
    }) 
  }else{
    Swal.fire({
      title: 'OTP not found!!',
      text: "Please enter correct OTP ",
      icon: 'warning',
      showCancelButton: false,
      background: '#ffffff',
      confirmButtonColor: '#C6604C',
      cancelButtonColor: "#AAAAAA",
    })
  }
}