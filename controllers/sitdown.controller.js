const { SitDown, SitDownCounter, SitDownSimple } = require("../models");

const addSitDownSimple = async (req, res = response) => {
  const { amount, office, user } = req.body;
  let newAmount = 0;
  try {
    const sitDownCounter = await SitDownCounter.find();
    if (sitDownCounter.length === 0) {
      //Initialize sitdown
      const newSitDownCounter = new SitDownCounter({
        boca_raton: 0,
        bradenton: 0,
        cape_coral: 0,
        jacksonville: 0
      });

      // Save sitdown
      await newSitDownCounter.save();

      const id = newSitDownCounter._id;
      const query = { _id: id };

      //Adding the amount
      switch (office) {
        case 'Boca Raton':
          await SitDownCounter.findOneAndUpdate(query, { boca_raton: amount }, { new: true });
          break;
        case 'Bradenton':
          await SitDownCounter.findOneAndUpdate(query, { bradenton: amount }, { new: true });
          break;
        case 'Cape Coral':
          await SitDownCounter.findOneAndUpdate(query, { cape_coral: amount }, { new: true });
          break;
        case 'Jacksonville':
          await SitDownCounter.findOneAndUpdate(query, { jacksonville: amount }, { new: true });
          break;
        default:
          break;
      }
    } else {
      const query = { _id: sitDownCounter[0]._id };
      let sitDownCounterAmount = null;
      //Adding the amount
      switch (office) {
        case 'Boca Raton':
          sitDownCounterAmount = await SitDownCounter.findOneAndUpdate(query, { boca_raton: sitDownCounter[0].boca_raton + amount }, { new: true });
          newAmount = sitDownCounterAmount.boca_raton;
          break;
        case 'Bradenton':
          sitDownCounterAmount = await SitDownCounter.findOneAndUpdate(query, { bradenton: sitDownCounter[0].bradenton + amount }, { new: true });
          newAmount = sitDownCounterAmount.bradenton;
          break;
        case 'Cape Coral':
          sitDownCounterAmount = await SitDownCounter.findOneAndUpdate(query, { cape_coral: sitDownCounter[0].cape_coral + amount }, { new: true });
          newAmount = sitDownCounterAmount.cape_coral;
          break;
        case 'Jacksonville':
          sitDownCounterAmount = await SitDownCounter.findOneAndUpdate(query, { jacksonville: sitDownCounter[0].jacksonville + amount }, { new: true });
          newAmount = sitDownCounterAmount.jacksonville;
          break;
        default:
          break;
      }
    }
    //Initialize sitdown
    const sitDownSimple = new SitDownSimple(req.body);

    // Save sitdown
    await sitDownSimple.save();

    res.status(201).json({
      ok: true,
      amount: newAmount
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      ok: false,
      msg: "Please, contact the admin",
    });
  }
};

const createSitDown = async (req, res = response) => {
  // const { email, password, name, lastname, role } = req.body;
  try {
    //Initialize sitdown
    const sitDown = new SitDown(req.body);

    // Save sitdown
    await sitDown.save();

    res.status(201).json({
      ok: true
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      ok: false,
      msg: "Please, contact the admin",
    });
  }
};
const getSitDowns = async (req, res) => {
  const query = { estado: true };

  const [total, sitdowns] = await Promise.all([
    SitDown.countDocuments(query),
    SitDown.find(query)
  ]);
  res.json({ total, sitdowns });
};

const getSitDownsByOffice = async (req, res) => {
  const { limit = 5, from = 0 } = req.params;
  const query = { estado: true };

  const [total, sitdowns] = await Promise.all([
    SitDown.countDocuments(query),
    SitDown.find(query)
  ]);
  res.json({ total, sitdowns });
};

const getSitDownsSimples = async (req, res) => {
  const [total, sitDownsSimples] = await Promise.all([
    SitDownSimple.countDocuments(query),
    SitDownSimple.find(query)
  ]);
  res.json({ total, sitDownsSimples });
};

const getSitDownsSimplesByOffice = async (req, res) => {
  const { office } = req.params;
  const query = { office };

  const [total, sitDownsSimples] = await Promise.all([
    SitDownSimple.countDocuments(query),
    SitDownSimple.find(query)
      .populate('user', ['name', 'lastname'])
  ]);
  res.json({ total, sitDownsSimples });
};

const getSitDownCounterByOffice = async (req, res) => {
  const { office } = req.params;
  let amount = 0;
  const sitDownCounter = await SitDownCounter.find();
  if (sitDownCounter.length === 0) {
    return res.status(500).json({
      ok: false,
      msg: "Please, contact the admin",
    });
  } else {
    //Get the office amount
    switch (office) {
      case 'Boca Raton':
        amount = sitDownCounter[0].boca_raton;
        return res.json({ ok: true, amount });
      case 'Bradenton':
        amount = sitDownCounter[0].bradenton;
        return res.json({ ok: true, amount });
      case 'Cape Coral':
        amount = sitDownCounter[0].cape_coral;
        return res.json({ ok: true, amount });
      case 'Jacksonville':
        amount = sitDownCounter[0].jacksonville;
        return res.json({ ok: true, amount });
      default:
        return res.json({ ok: true, amount });
    }
  }
};

module.exports = {
  createSitDown,
  addSitDownSimple,
  getSitDowns,
  getSitDownsSimples,
  getSitDownsByOffice,
  getSitDownsSimplesByOffice,
  getSitDownCounterByOffice,
};
