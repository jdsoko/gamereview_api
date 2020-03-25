const xss = require('xss')

const ReviewsService = {
    getAllReviews(db) {
        return db
        .from('gamereview_reviews')
        .select('*')
    },
    getById(db, id){
        return db
            .from('gamereview_reviews AS review')
            .select(
                'user.user_name',
                'review.id',
                'review.rating',
                'review.review_title',
                'review.content',
                'review.game_id'
            )
            .leftJoin(
                'gamereview_users as user',
                'review.user_id',
                'user.id'
            )
            .where('review.id', id)
            .first()
    },
    insertReview(db, newReview) {
        return db
            .insert(newReview)
            .into('gamereview_reviews')
            .returning('*')
            .then(([review]) => review)
            .then(review => 
                ReviewsService.getById(db, review.id)
            )
    },
} 


module.exports = ReviewsService