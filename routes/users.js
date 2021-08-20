const { celebrate, Joi } = require("celebrate");
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
router.get("/users/:userId", celebrate({
  params: Joi.object().keys({
    userId: Joi.string().length(24).alphanum(),
  }),
}), getUserById);
router.patch("/users/me", celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    about: Joi.string().required().min(2).max(30),
  }),
}), patchUser);
router.patch("/users/me/avatar", celebrate({
  body: Joi.object().keys({
    avatar: Joi.string().required(),
  }),
}), patchAvatar);

module.exports = router;
