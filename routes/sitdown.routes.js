const { Router } = require("express");
const { validarJWT } = require("../middlewares/validar-jwt");
const { getSitDowns } = require("../controllers/sitdown.controller");

const router = Router();
router.get("/", getSitDowns);
router.use(validarJWT);

module.exports = router;