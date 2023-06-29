const { SitDown } = require("../models");

const getSitDowns = async (req, res) => {
  // const { limit = 5, from = 0 } = req.query;
  const query = { estado: true };

  const [total, sitdowns] = await Promise.all([
    SitDown.countDocuments(query),
    SitDown.find(query)
      // .populate("usuario", "nombre")
  ]);
  res.json({ total, sitdowns });
};

module.exports = {
  getSitDowns
};
