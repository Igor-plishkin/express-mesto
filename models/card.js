const mongoose = require("mongoose");

const cardSchema = new mongoose.Schema({
  name: {
    type: String,
    minlength: 2,
    maxlength: 30,
    required: true,
  },
  link: {
    type: String,
    required: true,
  },
  owner: {
    // eslint-disable-next-line no-undef
    type: ObjectId,
    required: true,
  },
  likes: [
    {
      // eslint-disable-next-line no-undef
      type: ObjectId,
      default: "",
    },
  ],
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("card", cardSchema);