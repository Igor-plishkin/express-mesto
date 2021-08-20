const router = require("express").Router();
const {
  getAllUsers,
  getUser,
  patchUser,
  patchAvatar,
} = require("../controllers/users");

router.get("/users", getAllUsers);
router.get("/users/:userId", getUser);
router.patch("/users/me", patchUser);
router.patch("/users/me/avatar", patchAvatar);

module.exports = router;
