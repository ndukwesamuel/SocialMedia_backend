const { request } = require("express");
const bcrypt = require("bcrypt");
const UsersData = require("../models/UserModel");

const update_user = async (req, res) => {
  if (req.body.userId === req.params.id || req.body.isAdmin) {
    if (req.body.password) {
      try {
        const salt = await bcrypt.genSalt(10);
        req.body.password = await bcrypt.hash(req.body.password, salt);
      } catch (err) {
        return res.status(500).json(err);
      }
    }
    try {
      const user = await UsersData.findByIdAndUpdate(
        req.params.id,
        {
          $set: req.body,
        },
        { upsert: true, new: true }
      );
      console.log(user);
      res.status(200).json("Account has been updated");
    } catch (err) {
      return res.status(500).json(err);
    }
  } else {
    return res.status(403).json("You can update only your account!");
  }
};

const delete_user = async (req, res) => {
  if (req.body.userId === req.params.id || req.body.isAdmin) {
    try {
      const user = await UsersData.findByIdAndDelete(req.params.id, {
        $set: req.body,
      });
      res.status(200).json("Account has been deleted");
    } catch (error) {
      console.log(error);
      return res.status(500).json(error);
    }
  } else {
    return res.status(403).json("You can delete only your account!");
  }
};

// get a user
const get_user = async (req, res) => {
  const userId = req.query.userId;
  const username = req.query.username;
  console.log(userId, username);

  try {
    const user = userId
      ? await UsersData.findById(userId)
      : await UsersData.findOne({ username: username });
    const { password, updatedAt, ...others } = user._doc;
    res.status(200).json(others);
  } catch (err) {
    res.status(500).json(err);
  }
};

// const get_user = async (req, res) => {
//   try {
//     const post = await UsersData.findById(req.params.id);
//     const { password, updatedAt, ...others } = post._doc;
//     res.status(200).json(others);
//   } catch (err) {
//     res.status(500).json(err);
//   }
// };

//follow a user
const follow_user = async (req, res) => {
  if (req.body.userId !== req.params.id) {
    try {
      const user = await UsersData.findById(req.params.id);
      const currentUser = await UsersData.findById(req.body.userId);
      if (!user.followers.includes(req.body.userId)) {
        await user.updateOne({ $push: { followers: req.body.userId } });
        await currentUser.updateOne({ $push: { following: req.params.id } });
        res.status(200).json("user has been followed");
      } else {
        res.status(403).json("you already follow this user");
      }
    } catch (error) {
      console.log(error.stack);
      res.json(500).json(error);
    }
  } else {
    res.status(403).json("you cant follow yourself");
  }
};

//follow a user
const Unfollow_user = async (req, res) => {
  if (req.body.userId !== req.params.id) {
    try {
      const user = await UsersData.findById(req.params.id);
      const currentUser = await UsersData.findById(req.body.userId);
      if (user.followers.includes(req.body.userId)) {
        await user.updateOne({ $pull: { followers: req.body.userId } });
        await currentUser.updateOne({ $pull: { following: req.params.id } });
        res.status(200).json("user has been unfollowed");
      } else {
        res.status(403).json("you dont follow this user");
      }
    } catch (error) {
      console.log(error.stack);
      res.json(500).json(error);
    }
  } else {
    res.status(403).json("you cant unfollow yourself");
  }
};

const get_friend = async (req, res) => {
  try {
    const user = await UsersData.findById(req.params.userId);
    const friends = await Promise.all(
      user.following.map((friendId) => {
        return UsersData.findById(friendId);
      })
    );
    let friendList = [];
    friends.map((friend) => {
      const { _id, username, profilePicture } = friend;
      friendList.push({ _id, username, profilePicture });
    });
    res.status(200).json(friendList);
  } catch (err) {
    res.status(500).json(err);
  }
};

module.exports = {
  update_user,
  delete_user,
  get_user,
  follow_user,
  Unfollow_user,
  get_friend,
};
