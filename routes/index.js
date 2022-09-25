const express = require('express');
const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const cookieParser = require('cookie-parser');

const { login, createUser } = require('../controllers/users');

const NotFoundError = require('../errors/NotFoundError');

const auth = require('../middlewares/auth');

const userRouter = require('./users');
const cardRouter = require('./cards');

const regex = require('../utils/validateUrl');

router.use(cookieParser());

router.post('/signup', express.json(), celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(30),
    avatar: Joi.string().pattern(regex),
    email: Joi.string().required().email(),
    password: Joi.string().required(),
  }),
}), createUser);

router.post('/signin', express.json(), celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required(),
  }),
}), login);

router.use(auth);

router.use(userRouter);
router.use(cardRouter);

router.use((req, res, next) => {
  next(new NotFoundError('Страница не найдена'));
});

module.exports = router;
