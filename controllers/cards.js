const Card = require("../models/card");

const ERROR_BADREQUEST = 400;
const ERROR_NOTFOUND = 404;
const ERROR_DEFAULT = 500;

module.exports.getAllCards = (req, res) => {
  Card.find({})
    .then((cards) => res.send({ data: cards }))
    .catch(() => res.status(ERROR_DEFAULT).send({ message: "Произошла ошибка" }));
};

module.exports.deleteCard = (req, res) => {
  Card.findByIdAndRemove(req.params.cardId)
    .then((card) => res.send({ data: card }))
    .catch((err) => {
      if (err.name === "CastError") {
        res.status(ERROR_NOTFOUND).send({
          message: "Карточка с указанным _id не найдена.",
        });
      }
      res.status(ERROR_DEFAULT).send({ message: "Произошла ошибка" });
    });
};

module.exports.createCard = (req, res) => {
  const { name, link } = req.body;
  const owner = req.user._id;

  Card.create({ name, link, owner })
    .then((card) => res.send({ data: card }))
    .catch((err) => {
      if (err.name === "ValidationError") {
        res.status(ERROR_BADREQUEST).send({
          message: "Переданы некорректные данные при создании карточки",
        });
      }
      res.status(ERROR_DEFAULT).send({ message: "Произошла ошибка" });
    });
};

module.exports.likeCard = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } },
    { new: true },
  )
    .then((card) => res.send({ data: card }))
    .catch((err) => {
      if (err.name === "ValidationError") {
        res.status(ERROR_BADREQUEST).send({
          message: "Переданы некорректные данные для постановки лайка",
        });
      }
      res.status(ERROR_DEFAULT).send({ message: "Произошла ошибка" });
    });
};
module.exports.dislikeCard = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } },
    { new: true },
  )
    .then((card) => res.send({ data: card }))
    .catch((err) => {
      if (err.name === "ValidationError") {
        res.status(ERROR_BADREQUEST).send({
          message: "Переданы некорректные данные для снятия лайка",
        });
      }
      res.status(ERROR_DEFAULT).send({ message: "Произошла ошибка" });
    });
};
