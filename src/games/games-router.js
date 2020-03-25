const express = require('express')
const GamesService = require('./games-service')
const { requireAuth } = require('../middleware/jwt-auth')
const xss = require('xss')

const gamesRouter = express.Router()
const jsonParser = express.json()

const serializeGames = games => {
    return games.map(serializeGame)
}

const serializeGame = game => ({
    id: game.id,
    title: xss(game.title),
    num_of_reviews: Number(game.num_of_reviews) || 0,
    average_rating: Math.round(game.average_rating) || 0,
})

const serializeReviews = reviews => {
    return reviews.map(serializeReview)
}

const serializeReview = review => ({
    user_name: review.user_name,
    id: review.id,
    rating: review.rating,
    review_title: xss(review.review_title),
    content: xss(review.content),
})

gamesRouter
    .route('/')
    .all(requireAuth)
    .get((req, res, next) => {
        GamesService.getAllGames(req.app.get('db'))
        .then(games => {
            res.json(serializeGames(games))
        })
        .catch(next)
    })
    .post(jsonParser, (req,res, next) => {
        const { title } = req.body
        const newGame = { title }
        if( newGame.title === null)
            return res.status(400).json({
                error: { message: `Missing game title in request body` }
            })
        GamesService.hasGameWithTitle(
            req.app.get('db'),
            newGame.title
        )
        .then(hasGameWithTitle => {
            if (hasGameWithTitle)
            return res.status(400).json({ error: `Game with title '${newGame.title}' already exists`})
            
            return GamesService.insertGame(
                req.app.get('db'),
                newGame
            )
            .then(game => {
                res
                    .status(201)
                    .location(`api/games/${game.id}`)
                    .json(serializeGame(game))
            })
        })
        .catch(next)
        
    })

gamesRouter
    .route('/:game_id')
    .all(requireAuth)
    .all(checkGameExists)
    .get((req, res) => {
        res.json(serializeGame(res.game))
    })

gamesRouter
    .route('/:game_id/reviews/')
    .all(requireAuth)
    .get((req, res, next) => {
        GamesService.getReviewsForGame(
            req.app.get('db'),
            req.params.game_id
        )
       
        .then(  
            reviews => {
            res.json(serializeReviews(reviews))
            })
        
        .catch(next)
    })


    async function checkGameExists(req, res, next) {
        try {
          const game = await GamesService.getById(
            req.app.get('db'),
            req.params.game_id
          )
      
          if (!game)
            return res.status(404).json({
              error: `game doesn't exist`
            })
      
          res.game = game
          next()
        } catch (error) {
          next(error)
        }
      }

module.exports = gamesRouter