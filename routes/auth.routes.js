const { Router } = require("express");
const { check } = require("express-validator");
const { validarCampos } = require("../middlewares/validar-campos");
const {
  crearUsuario,
  loginUsuario,
  revalidarToken,
  crearUsuarioCliente,
  getUser,
  actualizarUsuario,
  loginUsuarioGoogle,
} = require("../controllers/auth.controller");
const { validarJWT } = require("../middlewares/validar-jwt");

const router = Router();

router.post(
  "/new",
  [
    // middlewares
    check("nombre", "El nombre es obligatorio").not().isEmpty(),
    check("email", "El email es obligatorio").isEmail(),
    check("password", "El password debe de ser de 6 caracteres").isLength({
      min: 6,
    }),
    validarCampos,
  ],
  crearUsuario
);
router.post(
  "/newcliente",
  [
    // middlewares
    check("nombre", "El nombre es obligatorio").not().isEmpty(),
    check("email", "El email es obligatorio").isEmail(),
    check("password", "El password debe de ser de 6 caracteres").isLength({
      min: 6,
    }),
    validarCampos,
  ],
  crearUsuarioCliente
);
router.post(
  "/google",
  [
    check("email", "El email es obligatorio").isEmail(),
    check("nombre", "El nombre es obligatorio").not().isEmpty(),
    check("apellido", "El apellido es obligatorio").not().isEmpty(),
    validarCampos,
  ],
  loginUsuarioGoogle
);
// router.post(
//   "/newgoogle",
//   [
//     check("credential", "El apellido es obligatorio").not().isEmpty(),
//     validarCampos,
//   ],
//   loginUsuarioNuevoGoogle
// );
router.post(
  "/",
  [
    check("email", "El email es obligatorio").isEmail(),
    check("password", "El password debe de ser de 6 caracteres").isLength({
      min: 6,
    }),
    validarCampos,
  ],
  loginUsuario
);


router.get("/renew", validarJWT, revalidarToken);
router.get("/:id", getUser);
router.put("/editusuario", actualizarUsuario);


module.exports = router;
