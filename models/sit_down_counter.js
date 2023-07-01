const { Schema, model } = require("mongoose");

const SitDownCounterSchema = Schema({
  boca_raton: {
    type: Number,
  },
  bradenton: {
    type: Number,
  },
  cape_coral: {
    type: Number,
  },
  jacksonville: {
    type: Number,
  },
});
SitDownCounterSchema.methods.toJSON = function () {
  const { __v, _id, ...data } = this.toObject();
  data.id = _id;
  return data;
}
module.exports = model("SitDownCounter", SitDownCounterSchema);
