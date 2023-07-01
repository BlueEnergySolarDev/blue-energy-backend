const { Router } = require("express");
const { validarJWT } = require("../middlewares/validar-jwt");
const { getSitDowns, createSitDown, getSitDownsSimples, addSitDownSimple, getSitDownCounterByOffice, getSitDownsSimplesByOffice } = require("../controllers/sitdown.controller");

const router = Router();
router.use(validarJWT);

//Detailed
router.post("/", createSitDown);
router.get("/", getSitDowns);

//Simple
router.post("/addsimple", addSitDownSimple);
router.get("/simple", getSitDownsSimples);
router.get("/simple/:office", getSitDownsSimplesByOffice);

//Counter
router.get("/counter/:office", getSitDownCounterByOffice);

module.exports = router;