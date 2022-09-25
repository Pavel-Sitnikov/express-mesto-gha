const express = require('express');
const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');

const regex = require('../utils/validateUrl');

const {
  getUsers,
  getUserInfo,
  getUserById,
  editProfile,
  editAvatar,
} = require('../controllers/users');

router.get('/users', express.json(), getUsers);
router.get('/users/me', express.json(), getUserInfo);

router.get('/users/:userId', express.json(), celebrate({
  params: Joi.object().keys({
    userId: Joi.string().alphanum().length(24),
  }),
}), getUserById);

router.patch('/users/me', express.json(), celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(30),
  }),
}), editProfile);

router.patch('/users/me/avatar', express.json(), celebrate({
  body: Joi.object().keys({
    avatar: Joi.string().required().pattern(regex),
  }),
}), editAvatar);

module.exports = router;
