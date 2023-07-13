const { Closer } = require("../models");
const { getSalesRabbit } = require("../helpers/salesRabbitAxios");

const addClosers = async (req, res = response) => {
  try {
    const closers = await getSalesRabbit('users?role=Closer');
    const closersLength = closers.length;
    for (let i = 0; i < closersLength; i++) {

      let office = "";
      if (closers[i].office === "Boca") {
        office = "Boca Raton";
      } else {
        if (closers[i].office) {
          office = closers[i].office.trim();
        } else {
          office = 'Not specify'
        }
      }

      const dbCloser = await Closer.findOne({ email: closers[i].email });
      if (!dbCloser) {
        const closer = {
          firstName: closers[i].firstName.trim(),
          lastName: closers[i].lastName.trim(),
          status: closers[i].active,
          phone_number: closers[i].phone,
          email: closers[i].email,
          hireDate: closers[i].hireDate,
          office
        }

        const newCloser = new Closer(closer);
        await newCloser.save();
      }

    }

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

const getClosers = async (req, res) => {
  const [total, closers] = await Promise.all([
    Closer.countDocuments(),
    Closer.find()
  ]);
  res.json({ total, closers });
};

const getClosersByOffice = async (req, res) => {
  const { office } = req.params;
  const query = { office };
  const [total, closers] = await Promise.all([
    Closer.countDocuments(query),
    Closer.find(query)
  ]);
  res.json({ total, closers });
};

const createCloser = async (req, res = response) => {
  try {
    //Initialize closer
    const closer = new Closer(req.body);

    // Save closer
    const newCloser = await closer.save();

    res.status(201).json({
      ok: true,
      closer: newCloser
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      ok: false,
      msg: "Please, contact the admin",
    });
  }
};

module.exports = {
  addClosers,
  getClosers,
  getClosersByOffice,
  createCloser
};
