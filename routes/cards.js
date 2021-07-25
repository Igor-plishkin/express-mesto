const router = require("express").Router();
const { getAllCards, deleteCard, createCard } = require("../controllers/cards");

router.get("/cards", getAllCards);
router.delete("/cards/:cardId", deleteCard);
router.post("/cards", createCard);

module.exports = router;
