const express = require('express');
const mongoose = require('mongoose');

const { PORT = 3000 } = process.env;

const app = express();

const userRouter = require('./routes/users');
const cardRouter = require('./routes/cards');

// const { NOT_FOUND_ERROR } = require('./utils/constants');
const NOT_FOUND_ERROR = 404;

app.use((req, res, next) => {
  req.user = {
    _id: '631364cd2152db01c54711e2',
  };

  next();
});

app.use(userRouter);
app.use(cardRouter);

app.use((req, res) => {
  res.status(NOT_FOUND_ERROR).send({ message: 'Страница не найдена' });
});

async function main() {
  await mongoose.connect('mongodb://localhost:27017/mestodb', {
    useNewUrlParser: true,
    useUnifiedTopology: false,
  });
  await app.listen(PORT);
}

main();
