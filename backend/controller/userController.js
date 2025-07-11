const mongoose = require('mongoose');
const User = require('../model/userModel');

const newUser = async (req, res) => {
    const { name, email, password } = req.body;

    try {
        const newUser = new User({
            name,
            email,
            password
        });
        await newUser.save();
        res.status(201).json(newUser);
    } catch (error) {
        res.status(500).json({ message: 'Error creating user' });
    }
}

const getUser = async (req, res) => {
    const { id } = req.params;

    try {
        const user = await User.findById(id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.status(200).json(user);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching user' });
    }
}

module.exports = {
    newUser,
    getUser
};