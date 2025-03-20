const mongoose = require("mongoose");

const transactionSchema = new mongoose.Schema({
  userid: { type: String },
  amount: { type: Number },
  divisions: { type: String },
  type: { type: String },
  category: { type: String },
  date: { type: Date },
  reference: { type: String },
  description: { type: String },
});

const transactionModel = mongoose.model("Transactions", transactionSchema);

module.exports = transactionModel;
