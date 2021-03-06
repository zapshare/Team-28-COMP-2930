const mongoose = require('mongoose')
const validator = require('validator')

// Creates mongoose data model for a review object and adds validator to data
const Review = mongoose.model('Review', {
    //reviewer ID
    reviewer: {
        type: String,
        required: true,
        trim: true
    },
    //reviewee ID
    reviewee: {
        type: String,
        required: true,
        trim: true
    },
    details: {
        type: String,
        required: false,
        trim: true
    },
    rating: {
        type: Number,
        required: true,
        trim: true
    },
    date: {
        type: Date,
        required: true,
    }
})

module.exports = Review