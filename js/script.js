//animasi tombol menu
const navbarNav = document.querySelector(".navbar-nav");

document.querySelector("#menu").onclick = () => {
  navbarNav.classList.toggle("active");
};

//menghilangkan menu
const menunya = document.querySelector('#menu');

document.addEventListener('click', function(e){
    if(!menunya.contains(e.target) && !navbarNav.contains(e.target)){
        navbarNav.classList.remove('active');
    }
});
