const User = require("../models/user.model.js");
const axios = require("axios");

const addUser = async (req, res) => {
  try {
    const { name } = req.body;
    if (!name) {
      return res.status(400).json({
        success: false,
        message: "Missing required param name.",
      });
    }
    const newUser = {
      name: name,
      watchlists: [],
    };
    const updatedUsers = await User.findOneAndUpdate(
      { name },
      { $push: { users: newUser } },
      { new: true, upsert: true, setDefaultsOnInsert: true }
    );
    return res.status(200).json(updatedUsers);
  } catch (error) {
    console.log("Error adding user: ", error);
    return res.status(500).json({
      success: false,
      message: "Internal Serer Error. " + error.message,
    });
  }
};

const getUsers = async (req, res) => {
  try {
    const allUsers = await User.find();
    return res.status(200).json(allUsers);
  } catch (error) {
    console.log("Error getting users: ", error);
    return res.status(500).json({
      success: false,
      message: "Internal Serer Error. " + error.message,
    });
  }
};

const getFunds = async (req, res) => {
  console.log(`Bearer ${process.env.ACCESS_TOKEN}`);
  axios
    .get("https://api.upstox.com/v2/user/get-funds-and-margin", {
      Accept: "application/json",
      Authorization: `Bearer ${process.env.ACCESS_TOKEN}`,
    })
    .then((response) => {
      console.log(response.data);
      return res.status(200).json({
        success: true,
        message: response.data,
      });
    })
    .catch((error) => {
      return res.status(error.response?.status || 500).json({
        success: false,
        message: error.message,
      });
    });
};

module.exports = { addUser, getUsers, getFunds };
