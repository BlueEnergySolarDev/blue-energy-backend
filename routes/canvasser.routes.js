const { Router } = require("express");
const { validarJWT } = require("../middlewares/validar-jwt");
const { addCanvassers, getCanvassers, getCanvassersByOffice, createCanvasser } = require("../controllers/canvasser.controller");

const router = Router();
router.use(validarJWT);

router.post("/", addCanvassers);
router.get("/", getCanvassers);
router.post("/create", createCanvasser);
router.get("/:office", getCanvassersByOffice);

module.exports = router;