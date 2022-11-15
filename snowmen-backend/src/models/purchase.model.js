const mongoose = require('mongoose');

const purchaseSchema = new mongoose.Schema(
  {
    account: { type: String, unique: true, required: true, lowercase: true },
    totalPurchased: { type: Number, required: false },
  });

const Purchase = mongoose.model('Purchase', purchaseSchema);

module.exports = Purchase;