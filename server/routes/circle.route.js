import { Router } from 'express';
import Circle from '../models/circle.model.js';
import User from '../models/user.model.js';
import bot from '../bot/bot.js'

const circlesRouter = Router();

circlesRouter.route('/')
  .get((req, res) => {
    Circle.find({}).populate('connected_users')
      .exec()
      .then((data) => res.json({ data }));
});

circlesRouter.route('/follow')
  .post(async (req, res) => {
    const { currentUser } = req.body

    const circle = await Circle.findById(req.body.id);
    await circle.connected_users.push(currentUser);
    await circle.save();

    const user = await User.findById(currentUser._id);
    await user.connected_circles.push(circle);
    await user.save();

    bot.sendMessage(currentUser.chatId, `Вы вступили в круговорот ${circle.name}`);

    res.status(200).json({circle, user})
});

circlesRouter.route('/unfollow')
  .post(async (req, res) => {
    const { currentUser } = req.body;

    const circle = await Circle.findById(req.body.id);
    const idx =  circle.connected_users.indexOf(currentUser._id);
    await circle.connected_users.splice(idx, 1)
    await circle.save();

    const user = await User.findById(currentUser._id);
    const index =  user.connected_circles.indexOf(req.body.id);
    await user.connected_circles.splice(index, 1)
    await user.save();

    bot.sendMessage(currentUser.chatId, `Вы вышли из круговорота ${circle.name}`);

    res.status(200).json({circle, user})
});

circlesRouter.route('/getCurrent') 
  .post(async (req, res) => {
    const circle = await Circle.findById(req.body.circleId);
    res.status(201).send(circle)
  })

export default circlesRouter;
