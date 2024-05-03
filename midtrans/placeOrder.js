const midtransClient = require('midtrans-client');

// Create Snap API instance
let snap = new midtransClient.Snap({
    // Set to true if you want Production Environment (accept real transaction).
    isProduction: false,
    serverKey: 'SB-Mid-server-BVXzseiSxeOXCCWy0rDthENJ'
});

// Fungsi untuk menghasilkan id pesanan secara acak
function generateOrderId() {
    return Math.floor(Math.random() * 1000000);
}

// Mendefinisikan parameter transaksi
function createTransactionParameter(body) {
    return {
        "transaction_details": {
            "order_id": generateOrderId(),
            "gross_amount": body.total,
        },
        "credit_card": {
            "secure": true
        },
        "item_details": JSON.parse(body.items),
        "customer_details": {
            "first_name": body.name,
            "email": body.email,
            "phone": body.phone
        }
    };
}

// Menangani permintaan untuk membuat transaksi
async function handlePlaceOrder(req, res) {
    try {
        // Membuat parameter transaksi berdasarkan data dari permintaan
        let parameter = createTransactionParameter(req.body);

        // Membuat transaksi menggunakan Snap API
        const transaction = await snap.createTransaction(parameter);

        // Mendapatkan token transaksi
        const transactionToken = transaction.token;

        // Mengirimkan token transaksi sebagai respons
        res.send(transactionToken);
    } catch (error) {
        console.error('Error:', error);
        res.status(500).send('Terjadi kesalahan saat membuat transaksi.');
    }
}

module.exports = handlePlaceOrder;
