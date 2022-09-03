const Card = require('../models/card');

const {
  BAD_REQUEST_ERROR,
  NOT_FOUND_ERROR,
  INTERNAL_SERVER_ERROR,
  STATUS_OK,
} = require('../utils/constants');

const getCards = async (req, res) => {
  try {
    const cards = await Card.find({});
    return res.status(STATUS_OK).send(cards);
  } catch (err) {
    return res.status(INTERNAL_SERVER_ERROR).send({ message: 'Произошла ошибка на сервере' });
  }
};

const createCard = async (req, res) => {
  const owner = req.user._id;
  const { name, link } = req.body;
  try {
    const card = await Card.create({ name, link, owner });
    return res.status(STATUS_OK).send(card);
  } catch (err) {
    if (err.name === 'ValidationError') {
      return res.status(BAD_REQUEST_ERROR).send({ message: 'Переданы некорректные данные при создании карточки' });
    }
    return res.status(INTERNAL_SERVER_ERROR).send({ message: 'Произошла ошибка на сервере' });
  }
};

const deleteCardById = async (req, res) => {
  const { id } = req.params;
  try {
    const card = await Card.findByIdAndRemove(id);
    if (!card) {
      return res.status(NOT_FOUND_ERROR).send({ message: 'Карточка не найдена' });
    }
    return res.status(STATUS_OK).send(card);
  } catch (err) {
    if (err.name === 'CastError') {
      return res.status(BAD_REQUEST_ERROR).send({ message: 'Переданы некорректные данные для удаления карточки' });
    }
    return res.status(INTERNAL_SERVER_ERROR).send({ message: 'Произошла ошибка на сервере' });
  }
};

const likeCard = async (req, res) => {
  const { id } = req.params;
  try {
    const card = await Card.findByIdAndUpdate(
      id,
      { $addToSet: { likes: req.user._id } },
      { new: true, runValidators: true },
    );
    if (!card) {
      return res.status(NOT_FOUND_ERROR).send({ message: 'Передан несуществующий id карточки' });
    }
    return res.status(STATUS_OK).send(card);
  } catch (err) {
    if (err.name === 'CastError') {
      return res.status(BAD_REQUEST_ERROR).send({ message: 'Переданы некорректные данные для постановки лайка' });
    }
    return res.status(INTERNAL_SERVER_ERROR).send({ message: 'Произошла ошибка на сервере' });
  }
};

const dislikeCard = async (req, res) => {
  const { id } = req.params;
  try {
    const card = await Card.findByIdAndRemove(
      id,
      { $pull: { likes: req.user._id } },
      { new: true },
    );
    if (!card) {
      return res.status(NOT_FOUND_ERROR).send({ message: 'Передан несуществующий id карточки' });
    }
    return res.status(STATUS_OK).send(card);
  } catch (err) {
    if (err.name === 'CastError') {
      return res.status(BAD_REQUEST_ERROR).send({ message: 'Переданы некорректные данные для снятии лайка' });
    }
    return res.status(INTERNAL_SERVER_ERROR).send({ message: 'Произошла ошибка на сервере' });
  }
};

module.exports = {
  getCards,
  createCard,
  deleteCardById,
  likeCard,
  dislikeCard,
};
