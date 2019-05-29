const mongoose = require("mongoose");
require('mongoose-currency').loadType(mongoose);
const Currency = mongoose.Types.Currency;
const Schema = mongoose.Schema;
var chapterSchema = require("./chapter");
const bookSchema = new Schema(
  {
    name: {
      type: String,
      required: true, 
    },
    price: {
        type: Currency,
        required: true,
        min: 0
    },
    chapters:[chapterSchema] 
  },
  {
    timestamps: true
  }
);

var Books = mongoose.model("Book", bookSchema);

module.exports = Books;
