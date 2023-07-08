const { Router } = require("express");
const { check } = require("express-validator");
const { validarCampos } = require("../middlewares/validar-campos");
const {
  getUser,
  getGoogleDataByCredential,
  loginUser,
  createUser,
  revalidateToken,
  updateUser,
  loginGoogleUser,
  changePassword,
  getUsers,
  updateUserFromAdmin,
} = require("../controllers/auth.controller");
const { validarJWT } = require("../middlewares/validar-jwt");

const router = Router();

router.post(
  "/new",
  [
    // middlewares
    check("name", "Name is required").not().isEmpty(),
    check("email", "Email is required").isEmail(),
    check("password", "Password must have at least 6 characters").isLength({
      min: 6,
    }),
    validarCampos,
  ],
  createUser
);
router.post(
  "/google",
  [
    check("email", "Email is required").isEmail(),
    check("name", "Name is required").not().isEmpty(),
    check("lastname", "Lastname is required").not().isEmpty(),
    validarCampos,
  ],
  loginGoogleUser
);
router.post(
  "/newgoogle",
  [
    check("credential", "Credential is required").not().isEmpty(),
    validarCampos,
  ],
  getGoogleDataByCredential
);
router.post(
  "/",
  [
    check("email", "Email is required").isEmail(),
    check("password", "Password must have at least 6 characters").isLength({
      min: 6,
    }),
    validarCampos,
  ],
  loginUser
);
router.get("/renew", validarJWT, revalidateToken);

router.put("/edit", updateUser);
router.put("/editadmin", updateUserFromAdmin);
router.put("/changepass/:id",
  [
    check("id", "Invalid ID").isMongoId(),
    validarCampos,
  ],
  changePassword
);

router.get("/users", getUsers);
router.get("/:id",
  [
    check("id", "Invalid ID").isMongoId(),
    validarCampos,
  ],
  getUser
);

module.exports = router;
