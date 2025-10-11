const { default: mongoose } = require("mongoose");

module.exports = mongoose.model(
  "Students",
  new mongoose.Schema({
    studentId: {
      type: String,
      required: true,
      unique: true,
    },
    grades: {
      type: Array,
      required: true,
      default: [],
    },
    classId: {
      type: String,
      required: true,
      unique: false,
      default: "",
    },
    fName: {
      type: String,
      required: true,
      unique: false,
    },
    lName: {
      type: String,
      required: true,
      unique: false,
    },
    email: {
      type: String,
      required: true,
      unique: false,
    },
    birthday: {
      type: String,
      required: true,
      unique: false,
    },
  })
);
