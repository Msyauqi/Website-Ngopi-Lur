const searchForm = document.querySelector('.search-form');
const searchBox = document.querySelector('#search-box');

document.querySelector('#search-button').onclick = (e) => {
    searchForm.classList.toggle('active');
    searchBox.focus();
    e.preventDefault();
}

const sb = document.querySelector('#search-button');

document.addEventListener('click', function (e){
    if (!sb.contains(e.target) && !searchForm.contains(e.target)){
        searchForm.classList.remove('active');
    }
});

function searchMenu() {
    // Mendapatkan nilai input pencarian
    var input = document.getElementById('search-box').value.toUpperCase();

    // Mendapatkan semua menu cards
    var menuCards = document.querySelectorAll('.menu-card');

    // Loop melalui setiap menu card
    menuCards.forEach(function(card) {
        var title = card.querySelector('.menu-card-title').innerText.toUpperCase();
        // Memeriksa apakah judul menu cocok dengan input pencarian
        if (title.indexOf(input) > -1) {
            card.style.display = '';
        } else {
            card.style.display = 'none';
        }
    });
}
