const { Canvasser } = require("../models");
const { getSalesRabbit } = require("../helpers/salesRabbitAxios");

const addCanvassers = async (req, res = response) => {
  try {
    const reps = await getSalesRabbit('users?role=Rep');
    const repsLength = reps.length;
    for (let i = 0; i < repsLength; i++) {

      let office = "";
      if (reps[i].office === "Boca") {
        office = "Boca Raton";
      } else {
        if (reps[i].office) {
          office = reps[i].office.trim();
        } else {
          office = 'Not specify'
        }
      }

      const dbCanvasser = await Canvasser.findOne({ email: reps[i].email });
      if (!dbCanvasser) {
        const canvasser = {
          firstName: reps[i].firstName?.trim(),
          lastName: reps[i].lastName?.trim(),
          status: reps[i].active,
          phone_number: reps[i].phone,
          email: reps[i].email,
          hireDate: reps[i].hireDate,
          office
        }

        const newCanvasser = new Canvasser(canvasser);
        await newCanvasser.save();
      }
    }

    const treps = await getSalesRabbit('users?role=TRep');
    const trepsLength = treps.length;
    for (let i = 0; i < trepsLength; i++) {

      let office = "";
      if (treps[i].office === "Boca") {
        office = "Boca Raton";
      } else {
        if (treps[i].office) {
          office = treps[i].office.trim();
        } else {
          office = 'Not specify'
        }
      }

      const dbCanvasser = await Canvasser.findOne({ email: treps[i].email });
      if (!dbCanvasser) {

        const canvasser = {
          firstName: treps[i].firstName?.trim(),
          lastName: treps[i].lastName?.trim(),
          status: treps[i].active,
          phone_number: treps[i].phone,
          email: treps[i].email,
          hireDate: treps[i].hireDate,
          office
        }

        const newCanvasser = new Canvasser(canvasser);
        await newCanvasser.save();
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

const getCanvassers = async (req, res) => {
  const [total, canvassers] = await Promise.all([
    Canvasser.countDocuments(),
    Canvasser.find()
  ]);
  res.json({ total, canvassers });
};

const getCanvassersByOffice = async (req, res) => {
  const { office } = req.params;
  const query = { office };
  const [total, canvassers] = await Promise.all([
    Canvasser.countDocuments(query),
    Canvasser.find(query)
  ]);
  res.json({ total, canvassers });
};

const createCanvasser = async (req, res = response) => {
  try {
    //Initialize canvasser
    const canvasser = new Canvasser(req.body);

    // Save canvasser
    const newCanvasser = await canvasser.save();

    res.status(201).json({
      ok: true,
      canvasser: newCanvasser
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
  addCanvassers,
  getCanvassers,
  getCanvassersByOffice,
  createCanvasser
};
