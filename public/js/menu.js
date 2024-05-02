const searchForm = document.querySelector('.search-form');
const searchBox = document.querySelector('#search-box');

document.querySelector('#search-button').onclick = (e) => {
    searchForm.classList.toggle('active');
    searchBox.focus();
    e.preventDefault();
}

const sb = document.querySelector('#search-button');
const sc = document.querySelector('#shopping-cart-button');

document.addEventListener('click', function (e){
    if (!sb.contains(e.target) && !searchForm.contains(e.target)){
        searchForm.classList.remove('active');
    }
    if (!sc.contains(e.target) && !shoppingCart.contains(e.target)){
        shoppingCart.classList.remove('active');
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

//toggle class active
const shoppingCart = document.querySelector('.shopping-cart');
document.querySelector('#shopping-cart-button').onclick = (e) => {
  shoppingCart.classList.toggle('active');
  e.preventDefault();
};

//modal box
const itemDetailModal = document.querySelector('#item_detail_modal');
const itemDetailButton = document.querySelector('.item_detail_button');

itemDetailButton.onclick = (e) => {
    itemDetailModal.style.display = 'flex';
    e.preventDefault();
};

//klik tombol close modal
document.querySelector('.modal .close-icon').onclick = (e) => {
    itemDetailModal.style.display = 'none' ;
    e.preventDefault();
};

//klik diluar modal
const modal = document.querySelector('#item-detail-modal');
window.onclick = (e) => {
    if (e.target === modal) {
        modal.style.display = 'none'
    }
};