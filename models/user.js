const mongoose = require('mongoose');
const validator = require('validator');

const regex = require('../utils/validateUrl');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    default: 'Жак-Ив Кусто',
    minlength: 2,
    maxlength: 30,
  },
  about: {
    type: String,
    default: 'Исследователь',
    minlength: 2,
    maxlength: 30,
  },
  avatar: {
    type: String,
    default: 'https://pictures.s3.yandex.net/resources/jacques-cousteau_1604399756.png',
    validate: {
      validator(v) {
        return regex.test(v);
      },
    },
  },
  email: {
    type: String,
    required: true,
    // db.members.createIndex( { "user_id": 1 })
    unique: true,
    validate: {
      validator(e) {
        return validator.isEmail(e);
      },
    },
  },
  password: {
    type: String,
    required: true,
    select: false,
  },
}, { versionKey: false, toObject: { useProjection: true }, toJSON: { useProjection: true } });

module.exports = mongoose.model('user', userSchema);
