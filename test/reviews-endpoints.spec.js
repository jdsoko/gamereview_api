const knex = require('knex')
const app = require('../src/app')

describe('Reviews Endpoints', function() {
    let db

    function cleanTables(db) {
        return db.raw(
          `TRUNCATE
            gamereview_games,
            gamereview_users,
            gamereview_reviews
            RESTART IDENTITY CASCADE`
        )
      }
    
    before('make knex instance', () => {
        db = knex({
            client: 'pg',
            connection: process.env.TEST_DATABASE_URL,
        })
        app.set('db', db)
    })

    after('disconnect from db', () => db.destroy())
    before('cleanup', () => cleanTables(db))
    afterEach('cleanup', () => cleanTables(db))

    describe(`POST /api/reviews`, () => {
        const testGame = { id: 1, title: 'test-title'}
        const testUser = {
            id: 1,
            full_name: 'fullname',
            user_name: 'user_name',
            password: 'password'
        }
        this.beforeEach('insert test game', () => {
          return db
            .into('gamereview_games')
            .insert(testGame)
            .then(() =>
              db
                .into('gamereview_users')
                .insert(testUser)
            )
        })

        it(`creates a review, responding with 201 and the new review`, function() {
            this.retries(3)
            
            
            const newReview = {
                
                review_title: 'test-title',
                content: 'test-content',
                rating: 2,
                game_id: testGame.id,
                user_id: testUser.id
            }
            return supertest(app)
            .post('/api/reviews')
            .send(newReview)
            .expect(201)
            .expect(res => {
                expect(res.body).to.have.property('id')
                expect(res.body.rating).to.eql(newReview.rating)
                expect(res.body.review_title).to.eql(newReview.review_title)
                expect(res.body.content).to.eql(newReview.content)
                
                expect(res.headers.location).to.eql(`/api/reviews/${res.body.id}`)
            })
            
        })

        const requireFields = ['game_id', 'review_title', 'rating', 'content', 'user_id']
        
        requireFields.forEach(field => {
            const newReview = {
                game_id: testGame.id,
                review_title: 'test-title',
                rating: 2,
                content: 'test-content',
                user_id: testUser.id
            }
            

            it(`responds with 400 and an error message when the '${field}' is missing`, () => {
                delete newReview[field]
        
                return supertest(app)
                  .post('/api/reviews')
                  .send(newReview)
                  .expect(400, {
                    error: `Missing '${field}' in request body`,
                  })
                })
        }) 
       

    })
})