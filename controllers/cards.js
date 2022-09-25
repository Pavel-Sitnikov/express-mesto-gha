const Card = require('../models/card');

const CREATED = require('../utils/constants');

const BadRequestError = require('../errors/BadRequestError');
const ForbiddenError = require('../errors/ForbiddenError');
const NotFoundError = require('../errors/NotFoundError');

const getCards = async (req, res, next) => {
  try {
    const cards = await Card.find({});
    return res.send(cards);
  } catch (err) {
    return next(err);
  }
};

const createCard = async (req, res, next) => {
  const owner = req.user._id;
  const { name, link } = req.body;
  try {
    const card = await Card.create({ name, link, owner });
    return res.status(CREATED).send(card);
  } catch (err) {
    if (err.name === 'ValidationError') {
      return next(new BadRequestError('Переданы некорректные данные при создании карточки'));
    }
    return next(err);
  }
};

const deleteCardById = async (req, res, next) => {
  const { cardId } = req.params;
  const id = req.user._id;
  try {
    const card = await Card.findById(cardId);
    if (!card) {
      return next(new NotFoundError('Карточка не найдена'));
    }
    if (id !== card.owner.toString()) {
      return next(new ForbiddenError('Нет прав на удаление карточки'));
    }
    await Card.remove();
    return res.send(card);
  } catch (err) {
    if (err.name === 'CastError') {
      return next(new BadRequestError('Переданы некорректные данные для удаления карточки'));
    }
    return next(err);
  }
};

const likeCard = async (req, res, next) => {
  const { cardId } = req.params;
  try {
    const card = await Card.findByIdAndUpdate(
      cardId,
      { $addToSet: { likes: req.user._id } },
      { new: true, runValidators: true },
    );
    if (!card) {
      return next(new NotFoundError('Карточка не найдена'));
    }
    return res.send(card);
  } catch (err) {
    if (err.name === 'CastError') {
      return next(new BadRequestError('Переданы некорректные данные для установки лайка'));
    }
    return next(err);
  }
};

const dislikeCard = async (req, res, next) => {
  const { cardId } = req.params;
  try {
    const card = await Card.findByIdAndUpdate(
      cardId,
      { $pull: { likes: req.user._id } },
      { new: true },
    );
    if (!card) {
      return next(new NotFoundError('Карточка не найдена'));
    }
    return res.send(card);
  } catch (err) {
    if (err.name === 'CastError') {
      return next(new BadRequestError('Переданы некорректные данные для снятия лайка'));
    }
    return next(err);
  }
};

module.exports = {
  getCards,
  createCard,
  deleteCardById,
  likeCard,
  dislikeCard,
};
