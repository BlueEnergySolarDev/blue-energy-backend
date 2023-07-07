const { Router } = require("express");
const { validarJWT } = require("../middlewares/validar-jwt");
const { addCanvassers, getCanvassers, getCanvassersByOffice } = require("../controllers/canvasser.controller");

const router = Router();
router.use(validarJWT);

router.post("/", addCanvassers);
router.get("/", getCanvassers);
router.get("/:office", getCanvassersByOffice);

module.exports = router;