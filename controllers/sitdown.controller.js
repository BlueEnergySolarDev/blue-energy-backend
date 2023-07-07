const { toPascalCase } = require("../helpers/pascalCase");
const { SitDown, SitDownCounter, SitDownSimple } = require("../models");

const addSitDownSimple = async (req, res = response) => {
  const { amount, office, fail_credit } = req.body;
  let newOffice = { name: '', sit_down: 0, fail_credit: 0 };
  try {
    const sitDownCounter = await SitDownCounter.find();
    if (sitDownCounter.length === 0) {
      //Initialize sitdown
      const newSitDownCounter = new SitDownCounter({
        boca_raton: { sit_down: 0, fail_credit: 0 },
        bradenton: { sit_down: 0, fail_credit: 0 },
        cape_coral: { sit_down: 0, fail_credit: 0 },
        jacksonville: { sit_down: 0, fail_credit: 0 }
      });

      // Save sitdown
      await newSitDownCounter.save();

      const id = newSitDownCounter._id;
      const query = { _id: id };

      //Adding the amount
      switch (office) {
        case 'Boca Raton':
          await SitDownCounter.findOneAndUpdate(query, { "boca_raton.sit_down": amount, "boca_raton.fail_credit": fail_credit }, { new: true });
          break;
        case 'Bradenton':
          await SitDownCounter.findOneAndUpdate(query, { "bradenton.sit_down": amount, "bradenton.fail_credit": fail_credit }, { new: true });
          break;
        case 'Cape Coral':
          await SitDownCounter.findOneAndUpdate(query, { "cape_coral.sit_down": amount, "cape_coral.fail_credit": fail_credit }, { new: true });
          break;
        case 'Jacksonville':
          await SitDownCounter.findOneAndUpdate(query, { "jacksonville.sit_down": amount, "jacksonville.fail_credit": fail_credit }, { new: true });
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
          sitDownCounterAmount = await SitDownCounter.findOneAndUpdate(query, { "boca_raton.sit_down": sitDownCounter[0].boca_raton.sit_down + amount, "boca_raton.fail_credit": sitDownCounter[0].boca_raton.fail_credit + fail_credit }, { new: true });
          newOffice = {
            name: 'Boca Raton',
            sit_down: sitDownCounterAmount.boca_raton.sit_down,
            fail_credit: sitDownCounterAmount.boca_raton.fail_credit
          }
          break;
        case 'Bradenton':
          sitDownCounterAmount = await SitDownCounter.findOneAndUpdate(query, { "bradenton.sit_down": sitDownCounter[0].bradenton.sit_down + amount, "bradenton.fail_credit": sitDownCounter[0].bradenton.fail_credit + fail_credit }, { new: true });
          newOffice = {
            name: 'Bradenton',
            sit_down: sitDownCounterAmount.bradenton.sit_down,
            fail_credit: sitDownCounterAmount.bradenton.fail_credit
          }
          break;
        case 'Cape Coral':
          sitDownCounterAmount = await SitDownCounter.findOneAndUpdate(query, { "cape_coral.sit_down": sitDownCounter[0].cape_coral.sit_down + amount, "cape_coral.fail_credit": sitDownCounter[0].cape_coral.fail_credit + fail_credit }, { new: true });
          newOffice = {
            name: 'Cape Coral',
            sit_down: sitDownCounterAmount.cape_coral.sit_down,
            fail_credit: sitDownCounterAmount.cape_coral.fail_credit
          }
          break;
        case 'Jacksonville':
          sitDownCounterAmount = await SitDownCounter.findOneAndUpdate(query, { "jacksonville.sit_down": sitDownCounter[0].jacksonville.sit_down + amount, "jacksonville.fail_credit": sitDownCounter[0].jacksonville.fail_credit + fail_credit }, { new: true });
          newOffice = {
            name: 'Jacksonville',
            sit_down: sitDownCounterAmount.jacksonville.sit_down,
            fail_credit: sitDownCounterAmount.jacksonville.fail_credit
          }
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
      office: newOffice
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
  const [total, sitDowns] = await Promise.all([
    SitDown.countDocuments(),
    SitDown.find()
      .populate('closer', ['firstName', 'lastName'])
      .populate('canvasser', ['firstName', 'lastName'])
  ]);
  res.json({ total, sitDowns });
};

const getSitDownsByOffice = async (req, res) => {
  const { office } = req.params;
  const query = { office };
  const [total, sitDowns] = await Promise.all([
    SitDown.countDocuments(query),
    SitDown.find(query)
      .populate('closer', ['firstName', 'lastName'])
      .populate('canvasser', ['firstName', 'lastName'])
  ]);
  res.json({ total, sitDowns });
};

const getSitDownsSimples = async (req, res) => {
  const [total, sitDownsSimples] = await Promise.all([
    SitDownSimple.countDocuments(),
    SitDownSimple.find()
      .populate('user', ['name', 'lastname'])
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
  let newOffice = { name: '', sit_down: 0, fail_credit: 0 };
  const sitDownCounter = await SitDownCounter.find();
  if (sitDownCounter.length === 0) {
    return res.status(500).json({
      ok: false,
      msg: "Please, contact the admin",
    });
  } else {
    //Get the office
    switch (office) {
      case 'Boca Raton':
        newOffice = {
          name: 'Boca Raton',
          sit_down: sitDownCounter[0].boca_raton.sit_down,
          fail_credit: sitDownCounter[0].boca_raton.fail_credit
        }
        return res.json({ ok: true, office: newOffice });
      case 'Bradenton':
        newOffice = {
          name: 'Bradenton',
          sit_down: sitDownCounter[0].bradenton.sit_down,
          fail_credit: sitDownCounter[0].bradenton.fail_credit
        }
        return res.json({ ok: true, office: newOffice });
      case 'Cape Coral':
        newOffice = {
          name: 'Cape Coral',
          sit_down: sitDownCounter[0].cape_coral.sit_down,
          fail_credit: sitDownCounter[0].cape_coral.fail_credit
        }
        return res.json({ ok: true, office: newOffice });
      case 'Jacksonville':
        newOffice = {
          name: 'Jacksonville',
          sit_down: sitDownCounter[0].jacksonville.sit_down,
          fail_credit: sitDownCounter[0].jacksonville.fail_credit
        }
        return res.json({ ok: true, office: newOffice });
      default:
        return res.json({ ok: true, office: newOffice });
    }
  }
};

const getSitDownCounter = async (req, res) => {
  const sitDownCounter = await SitDownCounter.find().lean();
  if (sitDownCounter.length === 0) {
    return res.status(500).json({
      ok: false,
      msg: "Please, contact the admin",
    });
  } else {
    const offices = [];
    const { __v, _id, ...data } = sitDownCounter[0];
    for (const [key, value] of Object.entries(data)) {
      const friendlyKey = toPascalCase(key.replace(/_/g, ' '));
      const office = {
        name: friendlyKey,
        sit_down: value.sit_down,
        fail_credit: value.fail_credit
      }
      offices.push(office);
    }
    return res.json({ ok: true, offices });
  }
};

module.exports = {
  createSitDown,
  addSitDownSimple,
  getSitDowns,
  getSitDownsSimples,
  getSitDownCounter,
  getSitDownsByOffice,
  getSitDownsSimplesByOffice,
  getSitDownCounterByOffice,
};
