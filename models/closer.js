const { Schema, model } = require("mongoose");

const CloserSchema = Schema({
  firstName: {
    type: String,
    required: true,
  },
  lastName: {
    type: String,
    required: true,
  },
  status: {
    type: Boolean,
  },
  phone_number: {
    type: String,
  },
  email: {
    type: String,
  },
  hireDate: {
    type: Date,
  },
  office: {
    type: String,
  },
});
CloserSchema.methods.toJSON = function () {
  const { __v, _id, ...data } = this.toObject();
  data.id = _id;
  return data;
}
module.exports = model("Closer", CloserSchema);
