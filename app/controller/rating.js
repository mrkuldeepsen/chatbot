const { Ratings } = require("../model");
const { handleResponse, handleError } = require("../utils/helper");
const responseMsg = require("../utils/responseMsg");

exports.create = async (req, res) => {
    try {
        const { rating } = req.body;
        const data = { user_id: req.user._id, rating }
        const newRating = new Ratings(data)
        await newRating.save()
        handleResponse(res, responseMsg.Rating, 201)
    } catch (error) {
        handleError(error.message, req, res)
    }
};

exports.findAll = async (req, res) => {
    try {
        const ratings = await Ratings.find()
        handleResponse(res, ratings, 200);
    } catch (error) {
        handleError(error.message, req, res)
    }
};