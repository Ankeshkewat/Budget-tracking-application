function navbar(){
   return `
         <li id="home_logo"><a href="index.html"><img src="./images/Your paragraph text.png" alt="Home"></a></li>
            <div class="openMenu"><i class="fa fa-bars"></i></div>
            <ul class="mainMenu">
                <li><a href="index.html">Home</a></li>
                <li><a href="#">Records</a></li>
                <li><a href="#">Statistics</a></li>
                <li><a href="#">Shopping list</a></li>
                <li><a href="#">Warranties</a></li>
                <li><a href="signUp.html">Profile</a></li>
                <div class="closeMenu"><i class="fa fa-times"></i></div>
            </ul>
`
}

export {navbar}