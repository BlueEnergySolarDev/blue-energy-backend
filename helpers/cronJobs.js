const { Canvasser, Closer } = require("../models");
const { getSalesRabbit } = require("./salesRabbitAxios");

const addCanvassersCron = async () => {
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
    console.log("Canvassers finished successfully")
  } catch (error) {
    console.log(error);
  }
};

const addClosersCron = async () => {
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
    console.log("Closers finished successfully")
  } catch (error) {
    console.log(error);
  }
};

module.exports = {
  addCanvassersCron,
  addClosersCron
};
