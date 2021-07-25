const router = require("express").Router();
const { getAllUsers, getUser, createUser } = require("../controllers/users");

router.get("/users", getAllUsers);
router.get("/user/:userId", getUser);
router.post("/users", createUser);

module.exports = router;
