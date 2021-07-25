const User = require("../models/user");

const ERROR_BADREQUEST = 400;
const ERROR_NOTFOUND = 404;
const ERROR_DEFAULT = 500;

module.exports.getAllUsers = (req, res) => {
  User.find({})
    .then((users) => res.send({ data: users }))
    .catch(() => {
      res.status(ERROR_DEFAULT).send({ message: "Произошла ошибка" });
    });
};

module.exports.getUser = (req, res) => {
  User.findById(req.params.userId)
    .then((user) => {
      if (!user) {
        res.status(ERROR_NOTFOUND).send({
          message: "Пользователь по указанному _id не найден.",
        });
      } else {
        res.send({ data: user });
      }
    })
    .catch((err) => {
      if (err.name === "CastError") {
        res.status(ERROR_NOTFOUND).send({
          message: "Пользователь по указанному _id не найден.",
        });
      }
      res.status(ERROR_DEFAULT).send({ message: "Произошла ошибка" });
    });
};

module.exports.createUser = (req, res) => {
  const { name, about, avatar } = req.body;

  User.create({ name, about, avatar })
    .then((user) => res.send({ data: user }))
    .catch((err) => {
      if (err.name === "ValidationError") {
        res.status(ERROR_BADREQUEST).send({
          message: "Переданы некорректные данные при создании пользователя",
        });
      }
      res.status(ERROR_DEFAULT).send({ message: "Произошла ошибка" });
    });
};

module.exports.patchUser = (req, res) => {
  const { name, about } = req.body;

  User.findByIdAndUpdate(
    req.user._id,
    { name, about },
    {
      new: true,
      runValidators: true,
      // eslint-disable-next-line comma-dangle
    }
  )
    .then((user) => res.send({ data: user }))
    .catch((err) => {
      if (err.name === "CastError") {
        res.status(ERROR_NOTFOUND).send({
          message: "Пользователь по указанному _id не найден.",
        });
      } else if (err.name === "ValidationError") {
        res.status(ERROR_BADREQUEST).send({
          message: "Переданы некорректные данные при обновлении профиля",
        });
      }
      res.status(ERROR_DEFAULT).send({ message: "Произошла ошибка" });
    });
};

module.exports.patchAvatar = (req, res) => {
  const { avatar } = req.body;

  User.findByIdAndUpdate(
    req.user._id,
    { avatar },
    {
      new: true,
      runValidators: true,
      // eslint-disable-next-line comma-dangle
    }
  )
    .then((user) => res.send({ data: user }))
    .catch((err) => {
      if (err.name === "CastError") {
        res.status(ERROR_NOTFOUND).send({
          message: "Пользователь по указанному _id не найден.",
        });
      } else if (err.name === "ValidationError") {
        res.status(ERROR_BADREQUEST).send({
          message: "Переданы некорректные данные при обновлении аватара",
        });
      }
      res.status(ERROR_DEFAULT).send({ message: "Произошла ошибка" });
    });
};
