const knex = require('knex')
const app = require('../src/app')

describe('Games Endpoints', function() {
    let db

    function cleanTables(db){
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

    describe(`GET /api/games`, () => {
        context(`Given no games`, () => {
            it('responds with 200 and an empty list', () => {
                return supertest(app)
                    .get('/api/games')
                    .expect(200, [])
            })
        })
        context('Given there are games', () =>{
            const testGame = { id: 1, title: 'test-title'}
            const expectedGame =  { id: 1,
                title: 'test-title',
                num_of_reviews: 0,
                average_rating: 0 }
            beforeEach('insert test game', () => {
                return db
                    .into('gamereview_games')
                    .insert(testGame)
            })
            it('responds with 200 and all of the things', () => {
                
                return supertest(app)
                 .get('/api/games')
                 .expect(200, [expectedGame])
            })
        })
    })

    describe('GET /api/games/:game_id', () => {
        context('Given no games', () => {
            it('responds with 404', () => {
                return supertest(app)
                    .get('/api/games/1')
                    .expect(404, { error: `game doesn't exist` })
            })
        })
        context('Given there are games', () => {
            const testGame = { id: 1, title: 'test-title'}
            const expectedGame =  { id: 1,
                title: 'test-title',
                num_of_reviews: 0,
                average_rating: 0 }
            beforeEach('insert test game', () => {
                return db
                    .into('gamereview_games')
                    .insert(testGame)
            })
            it('responds with 200 and the specific game', () => {
                return supertest(app)
                    .get('/api/games/1')
                    .expect(200, expectedGame)
            })
        })
    })

    
    
    
})