document.addEventListener('alpine:init', () => {
    Alpine.data('products', () => ({
        items: [
            { id: 1, name: 'Americano', img: '1.png', price: 15000},
            { id: 2, name: 'Espresso', img: '2.png', price: 25000},
            { id: 3, name: 'Matcha Latte', img: '3.png', price: 35000},
            { id: 4, name: 'Coffee Milk', img: '4.png', price: 30000},
            { id: 5, name: 'Vanilla Latte', img: '5.jpg', price: 30000},
            { id: 6, name: 'Mocha', img: '6.jpg', price: 35000},
            { id: 7, name: 'Cappucino', img: '7.jpg', price: 25000},
        ],
    }));

    Alpine.store('cart', {
        items: [],
        total: 0,
        quantity: 0,
        add(newItem){
            //apakah ada barang yang sama di dalam cart?
            const cartItem = this.items.find((item) => item.id === newItem.id);
            
            //jika belum ada / cart masih kosong
            if(!cartItem) {
                this.items.push({...newItem, quantity: 1, total: newItem.price });
                this.quantity++;
                this.total += newItem.price;

            }
            else {
                //jika barang sudah ada di cart, apakah barang sama atau beda
                this.items = this.items.map((item) => {
                    //jika barang berbeda
                    if (item.id !== newItem.id){
                        return item;
                    }
                    else {
                        //jika barang sudah ada, tambah quantity dan sub total
                        item.quantity++;
                        item.total = item.price * item.quantity;
                        this.quantity++;
                        this.total += newItem.price;
                        return item;
                    }
                });
            }
        },
        
        remove(id) {
            //ambil item yang mau di remove berdasarkan idnya
            const cartItem = this.items.find((item) => item.id === id);

            //jika lebih dari satu (1)
            if(cartItem.quantity > 1) {

                //telusuri satu-satu
                this.items = this.items.map((item) => {

                    //jika bukan barang yang di klik
                    if(item.id !== id) {
                        return item;
                    } 
                    else {
                        item.quantity--;
                        item.total = item.price * item.quantity;
                        this.quantity--;
                        this.total -= item.price;
                        return item;
                    }
                })
            } 
            else if (cartItem.quantity === 1) {
                
                //jika barang sisa 1
                this.items = this.items.filter((item) => item.id !== id);
                this.quantity--;
                this.total -= cartItem.price;
            }
        }
    });
});

//konversi ke rupiah
const rupiah =(number) => {
    return new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        minimumFractionDigits: 0,
    }).format(number);
};