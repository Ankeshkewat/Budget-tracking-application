const mainMenu = document.querySelector('.mainMenu');
const closeMenu = document.querySelector('.closeMenu');
const openMenu = document.querySelector('.openMenu');
const menu_items = document.querySelectorAll('nav .mainMenu li a');




openMenu.addEventListener('click',show);
closeMenu.addEventListener('click',close);

// close menu when you click on a menu item 
menu_items.forEach(item => {
    item.addEventListener('click',function(){
        close();
    })
})

function show(){
    mainMenu.style.display = 'flex';
    mainMenu.style.top = '0';
}
function close(){
    mainMenu.style.top = '-100%';
}


let token=localStorage.getItem('token')
let name=JSON.parse( localStorage.getItem('first_name'));
// console.log(token,name)
if(token){
    document.getElementById('profile').innerText=name
    let logout=document.createElement('a');
    logout.innerText='Logout'
    logout.setAttribute('href','#')
    logout.setAttribute('id','logout')

    let li=document.createElement('li')
    li.append(logout)
    document.querySelector('.mainMenu').append(li)
}

document.getElementById('logout').onclick=()=>{
    logout()
}

async function logout(){
    let res=await fetch('http://localhost:1000/logout');
    let data=await res.json();
    alert(data.msg)
   if(data.msg=='Logout succesfully'){
    localStorage.removeItem('token')
    location.reload()
   }


}