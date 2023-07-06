const { Schema, model } = require("mongoose");

const SitDownCounterSchema = Schema({
  boca_raton: {
    sit_down: Number,
    fail_credit: Number
  },
  bradenton: {
    sit_down: Number,
    fail_credit: Number
  },
  cape_coral: {
    sit_down: Number,
    fail_credit: Number
  },
  jacksonville: {
    sit_down: Number,
    fail_credit: Number
  },
});
SitDownCounterSchema.methods.toJSON = function () {
  const { __v, _id, ...data } = this.toObject();
  data.id = _id;
  return data;
}
module.exports = model("SitDownCounter", SitDownCounterSchema);
