import express from "express";

const router = express.Router();

// Models
import { UserModel } from "../../database/user";

// Validation
import { ValidateSignin, ValidateSignup } from "../../validation/auth";

//GET – list user
router.get('/users', async (req, res) => {
  try {
    const users = await UserModel.find({});
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

//GET - /worko/user/:userId - get user details
router.get('/user/:userId', async (req, res) => {
  try {
    const user = await UserModel.findById(req.params.userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

//PUT - update user
router.put('/user/:userId', async (req, res) => {
  try {
    const updatedUser = await UserModel.findByIdAndUpdate(req.params.userId, req.body, { new: true });
    res.status(200).json(updatedUser);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

//PATCH - update user
router.patch('/user/:userId', async (req, res) => {
  try {
    const updatedUser = await UserModel.findByIdAndUpdate(req.params.userId, req.body, { new: true });
    res.status(200).json(updatedUser);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

//DELETE - soft delete user in DB
router.delete('/user/:userId', async (req, res) => {
  try {
    const deletedUser = await UserModel.findByIdAndUpdate(req.params.userId, { isDeleted: true }, { new: true });
    res.status(200).json(deletedUser);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


/*
Route         /signup
Descrip       Signup with email and password, age, city, and zipCode
Params        None
Access        Public
Method        POST
*/

router.post("/signup", async (req, res) => {
  try {
    await ValidateSignup(req.body.credentials);
    await UserModel.findEmailAndPhone(req.body.credentials);
    // DB
    const newUser = await UserModel.create(req.body.credentials);
    // JWT Auth Token
    const token = newUser.generateJwtToken();
    return res.status(200).json({ token });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

/*
Route         /signin
Descrip       Signin with email and password
Params        None
Access        Public
Method        POST
*/

router.post("/signin", async (req, res) => {
  try {
    await ValidateSignin(req.body.credentials);
    const user = await UserModel.findByEmailAndPassword(req.body.credentials);
    // JWT Auth Token
    const token = user.generateJwtToken();
    return res.status(200).json({ token, status: "Success" });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

export default router;