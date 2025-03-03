// рут для авторизации
import { Router } from 'express';
import jwt from 'jsonwebtoken';
import { authMiddleware } from '../middleware/authMiddleware.js';
import Admin from '../models/admin.model.js';
import User from '../models/user.model.js';

const userRouter = Router();

// userRouter.post('/create', async (req, res) => {
//   try {
//     const newUser = await User.create(req.body);
//     await res.status(201).send({ message: 'успешно зарегистрированы' });
//   } catch (error) {
//     await res.status(501).send({ message: 'Ошибка регистрации' });
//   }
// });

// userRouter.post('/login', async (req, res) => {
//   try {
//     const user = await User.findOneAndUpdate(
//       { chatId: req.body.chatId },
//       { $set: { secretId: req.body.secretId } }
//     );
//   } catch (error) {
//     console.log(error);
//   }
// });

userRouter.get('/auth', authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    const token = await jwt.sign({ id: user.id }, process.env.SC, {
      expiresIn: '1h',
    });
    res.status(200).send({ user, token });
  } catch (error) {
    console.log(error);
    res
      .status(400)
      .send({ message: 'Что-то пошло не так! Автовизируйтесь снова.' });
  }
});

userRouter.post('/auth', async (req, res) => {
  try {
    const user = await User.findOneAndUpdate(
      { secretId: req.body.secretId },
      { $set: { secretId: '' } }
    );
    console.log("USER", user)
    const token = await jwt.sign({ id: user._id }, process.env.SC, {
      expiresIn: '1h',
    });
    res.status(200).send({ user, token });
  } catch (error) {
    console.log(error);
    res.status(401).send({ message: 'ссылка неверна или устарела!' });
  }
});

userRouter.put('/edit_situation', async (req, res) => {
  const { situation, _id } = req.body;

  try {
    const user = await User.findOneAndUpdate({ _id }, { $set: { situation }}, {
      new: true
    });

    // Надо ли токен еще проверять ???

    res.json({ user });
  } catch (error) {
    res.status(503).send({ message: 'Ошибка базы данных' });
  }
});

export default userRouter;
