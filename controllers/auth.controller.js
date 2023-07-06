const { response } = require("express");
const bcrypt = require("bcryptjs");
const { generarJWT } = require("../helpers/jwt");
const { User } = require("../models");
const { OAuth2Client } = require('google-auth-library');

const createUser = async (req, res = response) => {
  const { email, password, name, lastname, role, office } = req.body;
  try {
    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({
        ok: false,
        msg: "This email is already registered",
      });
    }
    //Initialize user
    user = new User({ email, password, name, lastname, role, office });

    // Encript password
    const salt = bcrypt.genSaltSync();
    user.password = bcrypt.hashSync(password, salt);

    // Save user
    await user.save();

    // Generate JWT
    const token = await generarJWT(user.id, user.name);

    res.status(201).json({
      ok: true,
      uid: user.id,
      name: user.name,
      role: user.role,
      office: user.office,
      token,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      ok: false,
      msg: "Please, contact the admin",
    });
  }
};
const loginUser = async (req, res = response) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email, status: true });
    if (!user) {
      return res.status(400).json({
        ok: false,
        msg: "User not exists with this email",
      });
    }

    // Confirmar los passwords
    const validPassword = bcrypt.compareSync(password, user.password);

    if (!validPassword) {
      return res.status(400).json({
        ok: false,
        msg: "Wrong password",
      });
    }

    // Generar JWT
    const token = await generarJWT(user.id, user.name);

    res.json({
      ok: true,
      uid: user.id,
      name: user.name,
      role: user.role,
      token,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      ok: false,
      msg: "Please, contact the admin",
    });
  }
};
const loginGoogleUser = async (req, res = response) => {
  const { email, name, lastname, role, office } = req.body;
  try {
    const user = await User.findOne({ email });
    let token, uid, namee, rolee, officee;
    if (!user) {
      const password = process.env.SECRET_PASSWORD;
      const newUser = new User({ password, email, name, lastname, role, office });
      const salt = bcrypt.genSaltSync();
      newUser.password = bcrypt.hashSync(password, salt);
      await newUser.save();
      token = await generarJWT(newUser._id, newUser.name);
      namee = newUser.name;
      uid = newUser._id;
      rolee = newUser.role;
      officee = newUser.office;
    } else {
      token = await generarJWT(user._id, user.name);
      namee = user.name;
      uid = user._id;
      rolee = user.role;
      officee = user.office;
    }
    res.json({
      ok: true,
      uid: uid,
      name: namee,
      role: rolee,
      office: officee,
      token,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      ok: false,
      msg: "Please, contact the admin",
    });
  }
};
const getGoogleDataByCredential = async (req, res = response) => {
  const { credential } = req.body;
  try {
    const client = new OAuth2Client(process.env.GOOGLE_CLIENTID);
    const ticket = await client.verifyIdToken({
      idToken: credential,
      audience: process.env.GOOGLE_CLIENTID,
    });
    const { email, email_verified, family_name, given_name } = ticket.getPayload();
    const lastname = family_name.trim();
    const name = given_name.trim();

    //Verify if user exists
    let alreadyCreatedUser = false;
    const user = await User.findOne({ email });
    if (user) {
      alreadyCreatedUser = true;
    }

    res.json({
      email,
      isVerified: email_verified,
      lastname,
      name,
      created: alreadyCreatedUser
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      ok: false,
      msg: "Please, contact the admin",
    });
  }
};
const revalidateToken = async (req, res = response) => {
  const { uid, name } = req;
  let role = "";
  let office = "";
  let user;
  try {
    user = await User.findById({ _id: uid });
    if (user) {
      role = user.role;
      office = user.office;
    } else {
      role = "closer";
      office = "Cape Coral";
    }
  } catch (error) {
    console.log(error)
  }
  // Generar JWT
  const token = await generarJWT(uid, name);

  res.json({
    ok: true,
    token,
    uid,
    name,
    role,
    office
  });
};
const getUser = async (req, res) => {
  const { id } = req.params;
  const query = { status: true, _id: id };
  try {
    const user = await User.findOne(query);
    if (!user) {
      return res.status(400).json({
        msg: `The user not exists`,
      });
    }
    return res.status(201).json({ ok: true, user });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      ok: false,
      msg: "Please, contact the admin",
    });
  }
};
const updateUser = async (req, res) => {
  const { email, name, lastname, office } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({
        ok: false,
        msg: `The user not exists`,
      });
    }
    const update = { email, name, lastname, office };
    const userUpdate = await User.findOneAndUpdate({ email }, update, { new: true });
    let uid = userUpdate._id;
    let role = userUpdate.role;
    let namee = userUpdate.name;
    let officee = userUpdate.office;
    return res.status(200).json({
      ok: true,
      uid,
      role,
      name: namee,
      office: officee,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      ok: false,
      msg: "Please, contact the admin",
    });
  }
};

const changePassword = async (req, res) => {
  const { id, password } = req.body;
  const query = { _id: id };
  try {
    const user = await User.findOne(query);
    if (!user) {
      return res.status(400).json({
        ok: false,
        msg: `The user not exists`,
      });
    }

    const salt = bcrypt.genSaltSync();
    const newPassword = bcrypt.hashSync(password.trim(), salt);
    const pass = newPassword.trim();
    const update = { password: pass };
    await User.findOneAndUpdate(query, update, { new: true });
    return res.status(200).json({ ok: true, msg: "Password changed successfully" });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      ok: false,
      msg: "Please, contact the admin",
    });
  }
};

module.exports = {
  createUser,
  loginUser,
  revalidateToken,
  getUser,
  updateUser,
  loginGoogleUser,
  getGoogleDataByCredential,
  changePassword
};
