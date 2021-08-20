const router = require("express").Router();
const {
  getAllUsers,
  getUserById,
  patchUser,
  patchAvatar,
  getUserInfo,
} = require("../controllers/users");

router.get("/users", getAllUsers);
router.get("/users/me", getUserInfo);
router.get("/users/:userId", getUserById);
router.patch("/users/me", patchUser);
router.patch("/users/me/avatar", patchAvatar);

module.exports = router;
