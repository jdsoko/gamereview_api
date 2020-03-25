const express = require('express')
const path = require('path')
const ReviewsService = require('./reviews-service')
const { requireAuth } = require('../middleware/jwt-auth')
const xss = require('xss')

const reviewsRouter = express.Router()
const jsonBodyParser = express.json()

const serializeReview = review => ({
    user_name: review.user_name,
    id: review.id,
    rating: review.rating,
    review_title: xss(review.review_title),
    content: xss(review.content),
})

reviewsRouter
    .route('/')
    .get((req, res, next) => {
        ReviewsService.getAllReviews(req.app.get('db'))
            .then(reviews => {
                res.json(reviews)
            })
            .catch(next)
    })
    .post(requireAuth, jsonBodyParser, (req,res,next) => {
        const { game_id, review_title, rating, content, } = req.body
        const newReview = { game_id, review_title, rating, content, }

        for(const [key, value] of Object.entries(newReview))
          if(value == null)
            return res.status(400).json({
                error: `Missing '${key}' in request body`
            })
    
        newReview.user_id = req.user_id
        ReviewsService.insertReview(
            req.app.get('db'),
            newReview
        )
        .then(review => {
            res
                .status(201)
                .location(`api/reviews/${review.id}`)
                .json(serializeReview(review))
        })
        .catch(next)
    })
reviewsRouter
    .route('/:review_id')
    .get((req, res, next) => {
        ReviewsService.getById(req.app.get('db'), req.params.review_id)
        .then(review => {
            res.json(review)
        })
        .catch(next)
    })

module.exports = reviewsRouter