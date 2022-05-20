const { request } = require("express");
const bcrypt = require("bcrypt");
const UsersData = require("../models/UserModel");

// Register
const index_page___ = async (req, res) => {
  const user = await new UsersData({
    username: "tundae",
    email: "tundaw@gmail.com",
    password: "12345678901234567890",
  });

  await user.save();
  res.status(200).json(user);

  // res.send(" Data created AUth World @!");
};

const register_user = async (req, res) => {
  try {
    // generate password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(req.body.password, salt);
    const user = await new UsersData({
      username: req.body.username,
      email: req.body.email,
      password: hashedPassword,
    });

    // reurn password
    const newuser = await user.save();
    res.status(200).json(newuser);
  } catch (error) {
    console.log(error.stack);
    console.log(error);
  }
};

// const login_user = async (req, res) => {
//   try {
//     const user = await UsersData.findOne({ email: req.body.email });
//     !user && res.status(404).json("not found");
//     const validPassword = await bcrypt.compare(
//       req.body.password,
//       user.password
//     );
//     !validPassword && res.status(400).json("wrong password ");
//     res.status(200).json(user);
//     return;
//   } catch (error) {
//     res.status(500).json(error);
//     return;
//   }
// };

const login_user = async (req, res) => {
  try {
    const user = await UsersData.findOne({ email: req.body.email });

    if (!user) {
      return res.status(404).json("not found");
    } else if (user) {
      const validPassword = await bcrypt.compare(
        req.body.password,
        user.password
      );
      if (!validPassword) {
        return res.status(400).json("wrong password ");
      } else {
        return res.status(200).json(user);
      }
    }
  } catch (error) {
    return res.status(500).json(error);
  }
};
module.exports = {
  index_page___,
  register_user,
  login_user, // creat_page_get,
  // creat_page_post,
  // bloglist_page_get,
  // delete_article,
  // creat_page_edit,
  // creat_page_edit_post,
};
