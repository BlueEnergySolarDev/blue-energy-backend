const { Router } = require("express");
const { validarJWT } = require("../middlewares/validar-jwt");
const { addClosers, getClosers, getClosersByOffice } = require("../controllers/closer.controller");

const router = Router();
router.use(validarJWT);

router.post("/", addClosers);
router.get("/", getClosers);
router.get("/:office", getClosersByOffice);

module.exports = router;