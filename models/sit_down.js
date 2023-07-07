const { Schema, model, Types } = require("mongoose");

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
  reason: {
    type: String,
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
    type: Types.ObjectId,
    ref: 'Closer',
    default: null
  },
  canvasser: {
    type: Types.ObjectId,
    ref: 'Canvasser',
    default: null
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
