const { Schema, model, Types } = require("mongoose");

const SitDownSimpleSchema = Schema({
  office: {
    type: String,
    required: true,
  },
  amount: {
    type: Number,
    required: true,
  },
  fail_credit: {
    type: Number,
    required: true,
  },
  user: {
    type: Types.ObjectId,
    ref: 'User',
    required: true,
  },
  date:{
    type: Date,
    default: Date.now,
  }
});
SitDownSimpleSchema.methods.toJSON = function () {
  const { __v, _id, ...data } = this.toObject();
  data.id = _id;
  return data;
}
module.exports = model("SitDownSimple", SitDownSimpleSchema);
