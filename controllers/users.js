const bcrypt = require("bcryptjs");
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
    .orFail(() => {
      const error = new Error("Нет пользователя по заданному id");
      error.statusCode = ERROR_NOTFOUND;
      throw error;
    })
    .then((user) => {
      res.send({ data: user });
    })
    .catch((err) => {
      if (err.name === "CastError") {
        res.status(ERROR_BADREQUEST).send({
          message: "Переданы некорректные данные",
        });
      } else if (err.statusCode === ERROR_NOTFOUND) {
        res.status(ERROR_NOTFOUND).send({
          message: err.message,
        });
      }
      res.status(ERROR_DEFAULT).send({ message: "Произошла ошибка" });
    });
};

module.exports.createUser = (req, res) => {
  // eslint-disable-next-line object-curly-newline
  const { name, about, avatar, email, password } = req.body;

  bcrypt
    .hash(password, 10)
    .then((hash) => User.create({
      name, about, avatar, email, password: hash,
    }))
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
    .orFail(() => {
      const error = new Error("Нет пользователя по заданному id");
      error.statusCode = ERROR_NOTFOUND;
      throw error;
    })
    .then((user) => res.send({ data: user }))
    .catch((err) => {
      if (err.name === "CastError") {
        res.status(ERROR_BADREQUEST).send({
          message: "Переданы некорректные данные",
        });
      } else if (err.name === "ValidationError") {
        res.status(ERROR_BADREQUEST).send({
          message: "Переданы некорректные данные при обновлении профиля",
        });
      } else if (err.statusCode === ERROR_NOTFOUND) {
        res.status(ERROR_NOTFOUND).send({
          message: err.message,
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
    .orFail(() => {
      const error = new Error("Нет пользователя по заданному id");
      error.statusCode = ERROR_NOTFOUND;
      throw error;
    })
    .then((user) => res.send({ data: user }))
    .catch((err) => {
      if (err.name === "CastError") {
        res.status(ERROR_BADREQUEST).send({
          message: "Переданы некорректные данные",
        });
      } else if (err.name === "ValidationError") {
        res.status(ERROR_BADREQUEST).send({
          message: "Переданы некорректные данные при обновлении аватара",
        });
      } else if (err.statusCode === ERROR_NOTFOUND) {
        res.status(ERROR_NOTFOUND).send({
          message: err.message,
        });
      }
      res.status(ERROR_DEFAULT).send({ message: "Произошла ошибка" });
    });
};
