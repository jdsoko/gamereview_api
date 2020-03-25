const xss = require('xss')

const GamesService = {
    hasGameWithTitle (db, title){
        return db('gamereview_games')
                .where({ title })
                .first()
                .then(game => !!game)
    },
    getAllGames(db) {
        return db
        .from('gamereview_games as game')
        .select(
            'game.id',
            'game.title',
            db.raw(
                'count(DISTINCT review) AS num_of_reviews'
            ),
            db.raw('AVG(review.rating) AS average_rating'
            ),
            
        )
        .leftJoin(
            'gamereview_reviews AS review',
            'game.id',
            'review.game_id'
        )
        .groupBy('game.id')
    },

    getById(db, id) {
        return GamesService.getAllGames(db)
        .where('game.id', id)
        .first()
    },

    getReviewsForGame(db, game_id){
        return db
        .from('gamereview_reviews AS review')
        .select(
            'user.user_name',
            'review.id',
            'review.rating',
            'review.review_title',
            'review.content',

        )
        .where('review.game_id', game_id)
        .leftJoin(
            'gamereview_users AS user',
            'review.user_id',
            'user.id',
        )
        .groupBy('review.id', 'user.id')
    },

    insertGame(db, newGame) {
        return db
            .insert(newGame)
            .into('gamereview_games')
            .returning('*')
            .then(([game]) => game)
            .then(game => GamesService.getById(db, game.id))
    }
    
}


module.exports = GamesService