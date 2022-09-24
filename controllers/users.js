const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const User = require('../models/user');

const {
  STATUS_OK,
  CREATED,
} = require('../utils/constants');

const BadRequestError = require('../errors/BadRequestError');
const ConflictError = require('../errors/ConflictError');
const NotFoundError = require('../errors/NotFoundError');
const UnauthorizedError = require('../errors/UnauthorizedError');

const getUsers = async (req, res, next) => {
  try {
    const users = await User.find({});
    return res.status(STATUS_OK).send(users);
  } catch (err) {
    return next(err);
  }
};

const getUserById = async (req, res, next) => {
  const { userId } = req.params;
  try {
    const user = await User.findById(userId);
    if (!user) {
      return next(new NotFoundError('Пользователь не найден'));
    }
    return res.status(STATUS_OK).send(user);
  } catch (err) {
    if (err.name === 'CastError') {
      return next(new BadRequestError('Переданы некорректные данные пользователя'));
    }
    return next(err);
  }
};

const getUserInfo = async (res, req, next) => {
  const id = req.user._id;
  try {
    const user = await User.findById(id);
    if (!user) {
      return next(new NotFoundError('Пользователь не найден'));
    }
    return res.status(STATUS_OK).send(user);
  } catch (err) {
    return next(err);
  }
};

const createUser = async (req, res, next) => {
  const
    {
      name,
      about,
      avatar,
      email,
      password,
    } = req.body;
  try {
    const hashPassword = await bcrypt.hash(password, 10);
    const user = await User.create({
      name,
      about,
      avatar,
      email,
      password: hashPassword,
    });
    return res.status(CREATED).send(user);
  } catch (err) {
    if (err.name === 'ValidationError') {
      return next(new BadRequestError('Переданы некорректные данные при создании пользователя'));
    }
    if (err.code === 11000) {
      return next(new ConflictError('Email уже занят'));
    }
    return next(err);
  }
};

const editProfile = async (req, res, next) => {
  const id = req.user._id;
  const { name, about } = req.body;
  try {
    const user = await User.findByIdAndUpdate(
      id,
      { name, about },
      { new: true, runValidators: true },
    );
    if (!user) {
      return next(new NotFoundError('Пользователь не найден'));
    }
    return res.status(STATUS_OK).send(user);
  } catch (err) {
    if (err.name === 'ValidationError') {
      return next(new BadRequestError('Переданы некорректные данные пользователя'));
    }
    return next(err);
  }
};

const editAvatar = async (req, res, next) => {
  const id = req.user._id;
  const { avatar } = req.body;
  try {
    const user = await User.findByIdAndUpdate(
      id,
      { avatar },
      { new: true, runValidators: true },
    );
    if (!user) {
      return next(new NotFoundError('Пользователь не найден'));
    }
    return res.status(STATUS_OK).send(user);
  } catch (err) {
    if (err.name === 'ValidationError') {
      return next(new BadRequestError('Переданы некорректные данные при обновлении аватара'));
    }
    return next(err);
  }
};

const login = async (req, res, next) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      return next(new UnauthorizedError('Неверный email или пароль'));
    }
    const truePassword = await bcrypt.compare(password, user.password);
    if (!truePassword) {
      return next(new UnauthorizedError('Неверный email или пароль'));
    }

    const token = await jwt.sign({ _id: user._id }, 'some-secret-key');

    await res.cookie('jwt', token, {
      maxAge: 360000 * 24 * 7,
      httpOnly: true,
      sameSite: true,
    });

    return res.status(STATUS_OK).send(user);
  } catch (err) {
    return next(err);
  }
};

module.exports = {
  getUsers,
  getUserById,
  createUser,
  editProfile,
  editAvatar,
  login,
  getUserInfo,
};
