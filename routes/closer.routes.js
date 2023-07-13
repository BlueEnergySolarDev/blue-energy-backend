const { Router } = require("express");
const { validarJWT } = require("../middlewares/validar-jwt");
const { addClosers, getClosers, getClosersByOffice, createCloser } = require("../controllers/closer.controller");

const router = Router();
router.use(validarJWT);

router.post("/", addClosers);
router.get("/", getClosers);
router.post("/create", createCloser);
router.get("/:office", getClosersByOffice);

module.exports = router;