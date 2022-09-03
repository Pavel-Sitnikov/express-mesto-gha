const User = require('../models/user');

const {
  BAD_REQUEST_ERROR,
  NOT_FOUND_ERROR,
  INTERNAL_SERVER_ERROR,
  STATUS_OK,
} = require('../utils/constants');

const getUsers = async (req, res) => {
  try {
    const users = await User.find({});
    return res.status(STATUS_OK).send(users);
  } catch (err) {
    return res.status(INTERNAL_SERVER_ERROR).send({ message: 'Произошла ошибка на сервере', ...err });
  }
};

const getUserById = async (req, res) => {
  const { id } = req.params;
  try {
    const user = await User.findById(id);
    if (!user) {
      return res.status(NOT_FOUND_ERROR).send({ message: 'Пользователь по указанному id не найден' });
    }
    return res.status(STATUS_OK).send(user);
  } catch (err) {
    if (err.name === 'CastError') {
      return res.status(BAD_REQUEST_ERROR).send({ message: 'Невалидный id пользователя' });
    }
    return res.status(INTERNAL_SERVER_ERROR).send({ message: 'Произошла ошибка на сервере', ...err });
  }
};

const createUser = async (req, res) => {
  const { name, about, avatar } = req.body;
  try {
    const user = await User.create({ name, about, avatar });
    return res.status(STATUS_OK).send(user);
  } catch (err) {
    if (err.name === 'ValidationError') {
      return res.status(BAD_REQUEST_ERROR).send({ message: 'Переданы некорректные данные при создании пользователя' });
    }
    return res.status(INTERNAL_SERVER_ERROR).send({ message: 'Произошла ошибка на сервере', ...err });
  }
};

const editProfile = async (req, res) => {
  const id = req.user._id;
  const { name, about } = req.body;
  try {
    const user = await User.findByIdAndUpdate(
      id,
      { name, about },
      { new: true, runValidators: true },
    );
    if (!user) {
      return res.status(NOT_FOUND_ERROR).send({ message: 'Пользователь с указанным id не найден' });
    }
    return res.status(STATUS_OK).send(user);
  } catch (err) {
    if (err.name === 'ValidationError') {
      return res.status(BAD_REQUEST_ERROR).send({ message: 'Переданы некорректные данные при обновлении профиля' });
    }
    return res.status(INTERNAL_SERVER_ERROR).send({ message: 'Произошла ошибка на сервере', ...err });
  }
};

const editAvatar = async (req, res) => {
  const id = req.user._id;
  const { avatar } = req.body;
  try {
    const user = await User.findByIdAndUpdate(
      id,
      { avatar },
      { new: true, runValidators: true },
    );
    if (!user) {
      return res.status(NOT_FOUND_ERROR).send({ message: 'Пользователь с указанным id не найден' });
    }
    return res.status(STATUS_OK).send(user);
  } catch (err) {
    if (err.name === 'ValidationError') {
      return res.status(BAD_REQUEST_ERROR).send({ message: 'Переданы некорректные данные при обновлении аватара' });
    }
    return res.status(INTERNAL_SERVER_ERROR).send({ message: 'Произошла ошибка на сервере', ...err });
  }
};

module.exports = {
  getUsers,
  getUserById,
  createUser,
  editProfile,
  editAvatar,
};
