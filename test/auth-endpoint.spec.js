const knex = require('knex')
const jwt = require('jsonwebtoken')
const app = require('../src/app')


describe('Auth Endpoints', function() {
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

    describe(`POST /api/auth/`, () => {
        
        
        const requiredFields = ['user_name', 'password']

        requiredFields.forEach(field => {
            const loginAttemptBody = {
                user_name: testUser.user_name,
                password: testUser.password,
            }
            it(`responds with 400 required error when '${field}' is missing`, () => {
                delete loginAttemptBody[field]

                return supertest(app)
                    .post('/api/auth')
                    .send(loginAttemptBody)
                    .expect(400, {
                        error: `Missing '${field}' in request body`,
                    })
            })
        })
        
        it(`responds 400 'invalid user_name or password' when bad user_name`, () => {
            const userInvalidUser = { user_name: 'user-not', password: 'existy' }
            return supertest(app)
                .post('/api/auth')
                .send(userInvalidUser)
                .expect(400, { error: `Incorrect user_name or password` })
        })
        it(`responds 400 'invalid user_name or password' when bad password`, () => {
            const userInvalidPass = { user_name: testUser.user_name, password: 'incorrect' }
            return supertest(app)
                .post('/api/auth')
                .send(userInvalidPass)
                .expect(400, { error: `Incorrect user_name or password` })
        })

        it(`responds 200 and JWT auth token using secret when valid credentials`, () => {
            const userValidCreds = {
                user_name: testUser.user_name,
                password: testUser.password,
            }
            const expectedToken = jwt.sign(
                { user_id: testUser.id },
                process.env.JWT_SECRET,
                {
                    subject: testUser.user_name,
                    expiresIn: process.env.JWT_EXPIRY,
                    algorithm: 'HS256',
                }
            )
            return supertest(app)
                .post('/api/auth')
                .send(userValidCreds)
                .expect(200, {
                    authToken: expectedToken,
                })
        })

    })
})