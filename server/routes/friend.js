// routes/friend.js
const express = require('express');
const router = express.Router();
const { authenticateUser } = require('../middlewares/auth');
const { 
  addFriend, 
  getAllFriends, 
  getFriendById, 
  updateFriend, 
  deleteFriend 
} = require('../controllers/friendController');

router.use(authenticateUser);

router.route('/')
  .post(authenticateUser ,addFriend)
  .get(authenticateUser ,getAllFriends);

router.route('/:id')
  .get(authenticateUser ,getFriendById)
  .patch(authenticateUser ,updateFriend)
  .delete(authenticateUser ,deleteFriend);

module.exports = router;