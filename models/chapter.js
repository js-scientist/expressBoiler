const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const chapterSchema = new Schema(
  {
    name: {
      type: String,
      required: true 
    },
    description: {
      type: String,
      required: true
    }
  },
  {
    timestamps: true
  }
);

// var Chapters = mongoose.model("Chapter", chapterSchema);

module.exports = chapterSchema;
