const { response } = require("express");
const bcrypt = require("bcryptjs");
const { generarJWT } = require("../helpers/jwt");
const { User } = require("../models");
// const { OAuth2Client } = require('google-auth-library');

const crearUsuario = async (req, res = response) => {
  const { email, password, dni, rrpp, comisionRRPP, comisionEnt, maxFree, evento, rolEvento, eventoNombre, rrppNombre } = req.body;
  try {
    let usuario = await User.findOne({ email });
    let usuarioDb = await User.findOne({ dni });
    if (usuarioDb) {
      return res.status(400).json({
        ok: false,
        msg: "El DNI de rpp ya existe en el sistema, ingrese otro",
      });
    }
    //let evento = await Evento.findOne({ evento });
    if (usuario) {
      return res.status(400).json({
        ok: false,
        msg: "El EMAIL rpp ya existe en el sistema, ingrese otro",
      });
    }
    //usuario.evento = evento.uid;
    usuario = new User(req.body);

    // Encriptar contraseña
    const salt = bcrypt.genSaltSync();
    usuario.password = bcrypt.hashSync(password, salt);

    const userdb = await usuario.save();
    //ASOCIANDO EVENTOS A RRPP
    // const queryevento = { estado: true };
    // const eventos = await Evento.find(queryevento);
    const eventoss = [];
    // for(let i = 0; i<eventos.length;i++){
    const eventod = {
      evento,
      eventoNombre,
      deuda: 0,
      deudaComision: 0,
      cantFreeCargados: 0,
      totalEntradas: 0,
      rrpp,
      rrppNombre,
      comisionRRPP,
      comisionEnt,
      maxFree,
      rolEvento
    }
    eventoss.push(eventod);
    // }
    const queryeventous = { estado: true, _id: userdb.id };
    await User.findOneAndUpdate(queryeventous, { $push: { eventos: eventoss } }, { new: true });
    // let update;
    // if(comisionRRPP===undefined||comisionRRPP===''||comisionRRPP===null){
    //   update = {rrpp,comisionRRPP:0};
    // }else{
    //   update = {rrpp};
    // }
    // await User.findOneAndUpdate(queryeventous,update,{new:true});
    // Generar JWT
    const token = await generarJWT(usuario.id, usuario.nombre);

    res.status(201).json({
      ok: true,
      uid: usuario.id,
      nombre: usuario.nombre,
      rol: usuario.nombre,
      token,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      ok: false,
      msg: "Por favor hable con el administrador",
    });
  }
};
const crearUsuarioCliente = async (req, res = response) => {
  const { email, password } = req.body;
  try {
    let usuario = await User.findOne({ email: email });
    if (usuario) {
      return res.status(400).json({
        ok: false,
        msg: "El EMAIL ya esta registrado, ingrese otro",
      });
    }
    let usuarioNuevo = new User(req.body);
    // Encriptar contraseña
    const salt = bcrypt.genSaltSync();
    usuarioNuevo.password = bcrypt.hashSync(password, salt);
    await usuarioNuevo.save();
    // Generar JWT
    const token = await generarJWT(usuarioNuevo.id, usuarioNuevo.nombre);

    res.status(201).json({
      ok: true,
      uid: usuarioNuevo.id,
      nombre: usuarioNuevo.nombre,
      rol: usuarioNuevo.nombre,
      token,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      ok: false,
      msg: "Por favor hable con el administrador",
    });
  }
};
const loginUsuario = async (req, res = response) => {
  const { email, password } = req.body;

  try {
    const usuario = await User.findOne({ email, online: true });
    if (!usuario) {
      return res.status(400).json({
        ok: false,
        msg: "El usuario no existe con ese email",
      });
    }

    // Confirmar los passwords
    const validPassword = bcrypt.compareSync(password, usuario.password);

    if (!validPassword) {
      return res.status(400).json({
        ok: false,
        msg: "Password incorrecto",
      });
    }

    // Generar JWT
    const token = await generarJWT(usuario.id, usuario.nombre);

    res.json({
      ok: true,
      uid: usuario.id,
      nombre: usuario.nombre,
      rol: usuario.rol,
      // maxFree: usuario.maxFree ? usuario.maxFree : 0,
      token,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      ok: false,
      msg: "Por favor hable con el administrador",
    });
  }
};
const loginUsuarioGoogle = async (req, res = response) => {
  const { email, nombre, apellido } = req.body;
  try {
    const usuario = await User.findOne({ email, online: true });
    let token, uid, nombree, rol;
    if (!usuario) {
      const password = process.env.SECRET_PASSWORD;
      const usuarioNuevo = new User({ password, email, nombre, apellido, rol: "CLIENTE", online: true });
      const salt = bcrypt.genSaltSync();
      usuarioNuevo.password = bcrypt.hashSync(password, salt);
      await usuarioNuevo.save();
      token = await generarJWT(usuarioNuevo._id, usuarioNuevo.nombre);
      nombree = usuarioNuevo.nombre;
      uid = usuarioNuevo._id;
      rol = usuarioNuevo.rol;

    } else {
      token = await generarJWT(usuario._id, usuario.nombre);
      nombree = usuario.nombre;
      uid = usuario._id;
      rol = usuario.rol;
    }
    res.json({
      ok: true,
      uid: uid,
      nombre: nombree,
      rol: rol,
      token,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      ok: false,
      msg: "Por favor hable con el administrador",
    });
  }
};
// const loginUsuarioNuevoGoogle = async (req, res = response) => {
//   const { credential } = req.body;
//   try {
//     const client = new OAuth2Client(process.env.GOOGLE_CLIENTID);
//     const ticket = await client.verifyIdToken({
//       idToken: credential,
//       audience: process.env.GOOGLE_CLIENTID,
//     });
//     const { email, email_verified, family_name, given_name } = ticket.getPayload();
//     res.json({
//       email,
//       isVerified: email_verified,
//       apellido: family_name,
//       nombre: given_name
//     });
//   } catch (error) {
//     console.log(error);
//     res.status(500).json({
//       ok: false,
//       msg: "Por favor hable con el administrador",
//     });
//   }
// };
const revalidarToken = async (req, res = response) => {
  const { uid, nombre } = req;
  let rol = "";
  let usuario;
  try {
    usuario = await User.findById({ _id: uid });
    if (usuario) {
      rol = usuario.rol;
    } else {
      const cliente = await Cliente.findById({ _id: uid });
      if (cliente) {
        rol = cliente.rol;
      } else {
        rol = "CLIENTE";
      }
    }
  } catch (error) {
    console.log(error)
  }
  // Generar JWT
  const token = await generarJWT(uid, nombre);

  res.json({
    ok: true,
    token,
    uid,
    nombre,
    rol
  });
};
const getUser = async (req, res) => {
  const { id } = req.params;
  const query = { estado: true, _id: id };
  try {
    const usuario = await User.findOne(query);
    //const clientes = await Cliente..populate("usuario", "nombre");
    if (!usuario) {
      return res.status(400).json({
        msg: `El usuario no existe`,
      });
    }
    return res.status(201).json({ usuario });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      ok: false,
      msg: "Hable con el administrador",
    });
  }
};
const actualizarUsuario = async (req, res) => {
  const { email, nombre, password, apellido } = req.body;
  try {
    const usuario = await User.findOne({ email });
    if (!usuario) {
      return res.status(400).json({
        ok: false,
        msg: "El usuario no existe",
      });
    }

    const salt = bcrypt.genSaltSync();
    const newPassword = bcrypt.hashSync(password.trim(), salt);
    const pass = newPassword.trim();
    const update = { email, nombre, password: pass, apellido };
    const usuarioUpdate = await User.findOneAndUpdate({ email }, update, { new: true });
    return res.status(201).json({ ok: true, usuario: usuarioUpdate });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      ok: false,
      msg: "Hable con el administrador",
    });
  }
};

module.exports = {
  crearUsuario,
  loginUsuario,
  revalidarToken,
  crearUsuarioCliente,
  getUser,
  actualizarUsuario,
  loginUsuarioGoogle,
};
