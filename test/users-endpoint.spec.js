const knex = require('knex')
const app = require('../src/app')


describe.only('User Endpoints', function() {
    let db

    const testUser = {
        id: 1,
        full_name: 'fullname',
        user_name: 'user_name',
        password: 'password'
    }

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
            connection: process.env.TEST_DB_URL,
        })
        app.set('db', db)
    })

    after('disconnect from db', () => db.destroy())
    before('cleanup', () => cleanTables(db))
    afterEach('cleanup', () => cleanTables(db))

    describe(`POST /api/users`, () => {
        context('User Validation', () => {
            const requireFields = ['user_name', 'full_name', 'password']
            
            requireFields.forEach(field => {
                const registerBody = {
                    user_name: 'test user',
                    password: 'test pass',
                    full_name: 'test full',
                }
                it(`responds with 400 required error when '${field}' is missing`, () => {
                    delete registerBody[field]
        
                    return supertest(app)
                        .post('/api/users')
                        .send(registerBody)
                        .expect(400, {
                            error: `Missing '${field}' in request body`,
                        })
                })
                it(`responds 400 'User name already taken' when user_name isn't unique`, () => {
                    const duplicateUser = {
                        user_name: testUser.user_name,
                        password: '11AAaa!!',
                        full_name: 'test full_name',
                    }
                    return supertest(app)
                        .post('/api/users')
                        .send(duplicateUser)
                        .expect(400, {error: `Username already taken` })
                })
                it(`responds 400 'Password must be longer than 8 characters' when empty password`, () => {
                    const userShortPassword = {
                        user_name: 'test user_name',
                        password: '1234567',
                        full_name: 'test full_name',
                    }
                    return supertest(app)
                        .post('/api/users')
                        .send(userShortPassword)
                        .expect(400, { error: `Password must be longer then 8 characters` })
                })
                it(`responds 400 'Password must be less than 72 characters' when long password`, () =>{
                    const userLongPassword = {
                        user_name: 'test user_name',
                        password: '*'.repeat(73),
                        full_name: 'test full_name',
                    }
                    return supertest(app)
                        .post('/api/users')
                        .send(userLongPassword)
                        .expect(400, { error: `Password must be less than 72 characters` })
                })
            })
        }
            
        )
    })
})