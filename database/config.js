const mongoose = require("mongoose");

const dbConnection = async () => {
  try {
    await mongoose.connect(process.env.DB_CNN, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true,
      useFindAndModify: false,
    });
    console.log("Base de datos online");
  } catch (error) {
    throw new Error("Error a la hora de iniciar la base de datos");
  }
};
//COMANDO PARA RETORNAR EL OBJETO CON VALOR ACTUALIZADO, Y NO EL VALOR ANTES DE ACTUALIZAR
//mongoose.set('returnOriginal', false);
module.exports = {
  dbConnection,
};