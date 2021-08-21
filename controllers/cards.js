const Card = require("../models/card");
const BadRequestError = require("../errors/bad-request-err");
const NotFoundError = require("../errors/not-found-err");
const PermissionError = require("../errors/permission-err");

module.exports.getAllCards = (req, res, next) => {
  Card.find({})
    .then((cards) => res.send({ data: cards }))
    .catch(next);
};

module.exports.deleteCard = (req, res, next) => {
  const { cardId } = req.params;

  Card.findById(cardId)
    .then((card) => {
      if (!card) {
        throw new NotFoundError("Карточка с указанным _id не найдена.");
      } else if (JSON.stringify(req.user._id) === JSON.stringify(card.owner)) {
        Card.findByIdAndRemove(cardId).then((delCard) => {
          res.send({ data: delCard });
        });
      } else {
        throw new PermissionError("Нельзя удалять чужие карточки");
      }
    })
    .catch((err) => {
      if (err.name === "CastError") {
        throw new BadRequestError("Переданы некорректные данные при удалении карточки");
      }
      next(err);
    })
    .catch(next);
};

module.exports.createCard = (req, res, next) => {
  const { name, link } = req.body;
  const owner = req.user._id;

  Card.create({ name, link, owner })
    .then((card) => res.send({ data: card }))
    .catch((err) => {
      if (err.name === "ValidationError") {
        throw new BadRequestError("Переданы некорректные данные при создании карточки");
      }
      next(err);
    })
    .catch(next);
};

module.exports.likeCard = (req, res, next) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } },
    // eslint-disable-next-line comma-dangle
    { new: true }
  )
    .orFail(() => {
      throw new NotFoundError("Карточка с указанным _id не найдена.");
    })
    .then((card) => res.send({ data: card }))
    .catch((err) => {
      if (err.name === "ValidationError") {
        throw new BadRequestError("Переданы некорректные данные для постановки лайка");
      } else if (err.name === "CastError") {
        throw new BadRequestError("Переданы некорректные данные для постановки лайка");
      }
      next(err);
    })
    .catch(next);
};
module.exports.dislikeCard = (req, res, next) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } },
    // eslint-disable-next-line comma-dangle
    { new: true }
  )
    .orFail(() => {
      throw new NotFoundError("Карточка с указанным _id не найдена.");
    })
    .then((card) => res.send({ data: card }))
    .catch((err) => {
      if (err.name === "ValidationError") {
        throw new BadRequestError("Переданы некорректные данные для снятия лайка");
      } else if (err.name === "CastError") {
        throw new BadRequestError("Переданы некорректные данные для снятия лайка");
      }
      next(err);
    })
    .catch(next);
};
