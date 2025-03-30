const mongoose = require('mongoose');

const medicineOrderSchema = new mongoose.Schema({
    address: { type: String, required: true },
    specialInstructions: { type: String },
    cart: [
        {
            id: { type: String, required: true },
            name: { type: String, required: true },
            genericName: { type: String, required: true },
            price: { type: Number, required: true },
            quantity: { type: Number, required: true },
            prescriptionRequired: { type: Boolean, required: true }
        }
    ],
    createdAt: { type: Date, default: Date.now }
});

const MedicineOrder = mongoose.model('MedicineOrder', medicineOrderSchema);

module.exports = MedicineOrder;
