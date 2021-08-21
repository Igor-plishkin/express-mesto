const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/user");
const BadRequestError = require("../errors/bad-request-err");
const NotFoundError = require("../errors/not-found-err");
const RegConflictError = require("../errors/reg-conflict");
const UnauthorizedError = require("../errors/unauthorized-err");

module.exports.getAllUsers = (req, res, next) => {
  User.find({})
    .then((users) => res.send({ data: users }))
    .catch(next);
};

module.exports.getUserInfo = (req, res, next) => {
  User.findById(req.user._id)
    .orFail(() => {
      throw new NotFoundError("Нет пользователя по заданному id");
    })
    .then((user) => {
      res.send({ data: user });
    })
    .catch((err) => {
      if (err.name === "CastError") {
        throw new BadRequestError("Переданы некорректные данные");
      }
      next(err);
    })
    .catch(next);
};

module.exports.getUserById = (req, res, next) => {
  User.findById(req.params.userId)
    .orFail(() => {
      throw new NotFoundError("Нет пользователя по заданному id");
    })
    .then((user) => {
      res.send({ data: user });
    })
    .catch((err) => {
      if (err.name === "CastError") {
        throw new BadRequestError("Переданы некорректные данные");
      }
      next(err);
    })
    .catch(next);
};

module.exports.createUser = (req, res, next) => {
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
        throw new BadRequestError("Переданы некорректные данные");
      } else if (err.name === "MongoError" && err.code === 11000) {
        throw new RegConflictError("Пользователь с таким email существует");
      }
    })
    .catch(next);
};

module.exports.patchUser = (req, res, next) => {
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
      throw new NotFoundError("Нет пользователя по заданному id");
    })
    .then((user) => res.send({ data: user }))
    .catch((err) => {
      if (err.name === "CastError") {
        throw new BadRequestError("Переданы некорректные данные при обновлении профиля");
      } else if (err.name === "ValidationError") {
        throw new BadRequestError("Переданы некорректные данные при обновлении профиля");
      }
    })
    .catch(next);
};

module.exports.patchAvatar = (req, res, next) => {
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
      throw new NotFoundError("Нет пользователя по заданному id");
    })
    .then((user) => res.send({ data: user }))
    .catch((err) => {
      if (err.name === "CastError") {
        throw new BadRequestError("Переданы некорректные данные при обновлении аватара");
      } else if (err.name === "ValidationError") {
        throw new BadRequestError("Переданы некорректные данные при обновлении аватара");
      }
    })
    .catch(next);
};

module.exports.login = (req, res, next) => {
  const { email, password } = req.body;

  return User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign({ _id: user._id }, "secret-key", {
        expiresIn: "7d",
      });

      res.send({ token });
    })
    .catch(() => {
      throw new UnauthorizedError("Не правильные почта или пароль");
    })
    .catch(next);
};
