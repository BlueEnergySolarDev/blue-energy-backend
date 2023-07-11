const { Router } = require("express");
const { validarJWT } = require("../middlewares/validar-jwt");
const { getSitDowns, createSitDown, getSitDownsSimples, addSitDownSimple, getSitDownCounterByOffice, getSitDownsSimplesByOffice, getSitDownCounter, getSitDownsByOffice, getSitDownsById, getSitDownCounterById, getSitDownsSimplesById, getSitDown, updateSitDown, getSitDownsBySearch, getSitDownsBySearchByCloser, getSitDownsBySearchByStatus, getSitDownsBySearchByCanvasser, getSitDownsSimplesBySearchByDate } = require("../controllers/sitdown.controller");

const router = Router();
router.use(validarJWT);

//Simple
router.post("/addsimple", addSitDownSimple);
router.get("/simple", getSitDownsSimples);
router.get("/simple/id/:id", getSitDownsSimplesById);
router.get("/simple/searchbydate/:date", getSitDownsSimplesBySearchByDate);
router.get("/simple/:office", getSitDownsSimplesByOffice);

//Counter

router.get("/counter/id/:id", getSitDownCounterById);
router.get("/counter", getSitDownCounter);
router.get("/counter/:office", getSitDownCounterByOffice);

//Detailed
router.post("/", createSitDown);
router.get("/", getSitDowns);
router.get("/getbyid/:id", getSitDown);
router.put("/update", updateSitDown);
router.get("/id/:id", getSitDownsById);
router.get("/search/:search", getSitDownsBySearch);
router.get("/searchbycloser/:closer", getSitDownsBySearchByCloser);
router.get("/searchbycanvasser/:canvasser", getSitDownsBySearchByCanvasser);
router.get("/searchbystatus/:status", getSitDownsBySearchByStatus);
router.get("/:office", getSitDownsByOffice);

module.exports = router;