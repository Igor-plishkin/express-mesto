const Card = require("../models/card");

const ERROR_BADREQUEST = 400;
const ERROR_NOTFOUND = 404;
const ERROR_DEFAULT = 500;

module.exports.getAllCards = (req, res) => {
  Card.find({})
    .then((cards) => res.send({ data: cards }))
    .catch(() => {
      res.status(ERROR_DEFAULT).send({ message: "Произошла ошибка" });
    });
};

module.exports.deleteCard = (req, res) => {
  const { cardId } = req.params;

  Card.findById(cardId).then((card) => {
    if (!card) {
      res.status(ERROR_BADREQUEST).send({
        message: "Карточка с указанным _id не найдена.",
      });
    } else if (JSON.stringify(req.user._id) === JSON.stringify(card.owner)) {
      Card.findByIdAndRemove(req.params.cardId)
        .orFail(() => {
          const error = new Error("Нет карточки по заданному id");
          error.statusCode = ERROR_NOTFOUND;
          throw error;
        })
        .then((delCard) => res.send({ data: delCard }))
        .catch((err) => {
          if (err.name === "CastError") {
            res.status(ERROR_BADREQUEST).send({
              message: "Карточка с указанным _id не найдена.",
            });
          } else if (err.statusCode === ERROR_NOTFOUND) {
            res.status(ERROR_NOTFOUND).send({
              message: err.message,
            });
          }
          res.status(ERROR_DEFAULT).send({ message: "Произошла ошибка" });
        });
    } else {
      res.status(ERROR_BADREQUEST).send({
        message: "нельзя удалять чужие карточки",
      });
    }
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
    // eslint-disable-next-line comma-dangle
    { new: true }
  )
    .orFail(() => {
      const error = new Error("Нет карточки по заданному id");
      error.statusCode = ERROR_NOTFOUND;
      throw error;
    })
    .then((card) => res.send({ data: card }))
    .catch((err) => {
      if (err.name === "ValidationError") {
        res.status(ERROR_BADREQUEST).send({
          message: "Переданы некорректные данные для постановки лайка",
        });
      } else if (err.name === "CastError") {
        res.status(ERROR_BADREQUEST).send({
          message: "Карточка с указанным _id не найдена.",
        });
      } else if (err.statusCode === ERROR_NOTFOUND) {
        res.status(ERROR_NOTFOUND).send({
          message: err.message,
        });
      }
      res.status(ERROR_DEFAULT).send({ message: "Произошла ошибка" });
    });
};
module.exports.dislikeCard = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } },
    // eslint-disable-next-line comma-dangle
    { new: true }
  )
    .orFail(() => {
      const error = new Error("Нет карточки по заданному id");
      error.statusCode = ERROR_NOTFOUND;
      throw error;
    })
    .then((card) => res.send({ data: card }))
    .catch((err) => {
      if (err.name === "ValidationError") {
        res.status(ERROR_BADREQUEST).send({
          message: "Переданы некорректные данные для снятия лайка",
        });
      } else if (err.name === "CastError") {
        res.status(ERROR_BADREQUEST).send({
          message: "Карточка с указанным _id не найдена.",
        });
      } else if (err.statusCode === ERROR_NOTFOUND) {
        res.status(ERROR_NOTFOUND).send({
          message: err.message,
        });
      }
      res.status(ERROR_DEFAULT).send({ message: "Произошла ошибка" });
    });
};
