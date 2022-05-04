const { request } = require("express");
const bcrypt = require("bcrypt");
const PostData = require("../models/Post");
const UsersData = require("../models/UserModel");

// get a user
const create_post = async (req, res) => {
  const newPost = new PostData(req.body);
  try {
    const savePost = await newPost.save();
    res.status(200).json(savePost);
    return;
  } catch (error) {
    // console.log(e);/
    res.status(500).res.json(error);
  }
};

// create a post /// this will allow user to create a post
// update a post /// this will allow user to update a post

const update_post = async (req, res) => {
  try {
    const mainPost = await PostData.findById(req.params.id);
    if (mainPost.userId === req.body.userId) {
      await mainPost.updateOne({ $set: req.body });
      res.status(200).json(mainPost);
    } else {
      res.status(403).json("you can update only your post");
      return;
    }
  } catch (error) {
    res.status(500).json(error);
  }
};
// delete a post /// this will allow user to delete a post

const delete_post = async (req, res) => {
  try {
    const mainPost = await PostData.findById(req.params.id);
    if (mainPost.userId === req.body.userId) {
      await mainPost.deleteOne();
      res.status(200).json("the post has been deleted");
    } else {
      res.status(403).json("you can delete only your post");

      return;
    }
  } catch (error) {
    res.status(500).json(error);
  }
};

//like post
const like_dislike_post = async (req, res) => {
  try {
    const mainPost = await PostData.findById(req.params.id);

    if (!mainPost.likes.includes(req.body.userId)) {
      await mainPost.updateOne({ $push: { likes: req.body.userId } });
      res.status(200).json("The post has been liked");
    } else {
      await mainPost.updateOne({ $pull: { likes: req.body.userId } });
      res.status(200).json("The post has been disliked");
    }
  } catch (error) {
    console.log(error.stack);
    res.status(500).json(error);
  }
};

// get a post

const get_single_post = async (req, res) => {
  try {
    const post = await PostData.findById(req.params.id);
    res.status(200).json(post);
  } catch (err) {
    res.status(500).json(err);
  }
};

//get timeline this is just to see post of people you follow

const get_timeline = async (req, res) => {
  // try {
  //   const currentUser = await UsersData.findById(req.body.userId);
  //   const userPost = await PostData.find({ userId: currentUser._id });

  //   // so we want to map all the post of all the people the user is following
  //   const friendsPost = await Promise.all(
  //     currentUser.following.map((friendId) => {
  //       PostData.find({ userId: friendId });
  //     })
  //   );
  //   res.json(userPost.concat(...friendsPost));
  //   // res.json(friendsPost);
  // } catch (error) {
  //   res.status(500).json(error);
  // }

  try {
    const currentUser = await UsersData.findById(req.body.userId);
    const userPosts = await PostData.find({ userId: currentUser._id });
    const friendPosts = await Promise.all(
      currentUser.following.map((friendId) => {
        return PostData.find({ userId: friendId });
      })
    );
    res.json(userPosts.concat(...friendPosts));
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
};

module.exports = {
  create_post,
  update_post,
  delete_post,
  like_dislike_post,
  get_single_post,
  get_timeline,
};

// when folowing the userid is for  the current user that want to folow someone
// why the id is for the person we want to follower
