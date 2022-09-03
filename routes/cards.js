const express = require('express');
const router = require('express').Router();

const {
  getCards,
  createCard,
  deleteCardById,
  likeCard,
  dislikeCard,
} = require('../controllers/cards');

router.get('/cards', express.json(), getCards);
router.post('/cards', express.json(), createCard);
router.delete('/cards/:cardId', express.json(), deleteCardById);
router.put('/cards/:cardId/likes', express.json(), likeCard);
router.delete('/cards/:cardId/likes', express.json(), dislikeCard);

module.exports = router;
