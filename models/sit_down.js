const { Schema, model } = require("mongoose");

const SitDownSchema = Schema({
  name: {
    type: String,
    required: true,
  },
  address: {
    type: String,
    required: true,
  },
  phone_number: {
    type: String,
    required: true,
  },
  email: {
    type: String,
  },
  proposal: {
    type: String,
    required: true,
  },
  reason: {
    type: String,
    required: true,
  },
  date: {
    type: Date,
    required: true,
  },
  status: {
    type: String,
    default: true,
  },
  closer: {
    type: String,
    default: true,
  },
  canvasser: {
    type: String,
    default: true,
  },
  office: {
    type: String,
    default: true,
  },
});
SitDownSchema.methods.toJSON = function () {
  const { __v, _id, ...data } = this.toObject();
  data.id = _id;
  return data;
}
module.exports = model("SitDown", SitDownSchema);
