const express = require('express')
const UsersService = require('./users-service')

const usersRouter = express.Router()
const jsonBodyParser = express.json()

usersRouter
    .post('/', jsonBodyParser, (req, res, next) => {
        const {user_name, full_name, password} = req.body
        for (const field of ['full_name', 'user_name', 'password'])
        if (!req.body[field])
        return res.status(400).json({
            error: `Missing '${field}' in request body`
        })
        const passwordError = UsersService.validatePassword(password)
        
        if(passwordError)
            return res.status(400).json({ error: passwordError })
        
        UsersService.hasUserWithUserName(
            req.app.get('db'),
            user_name
        )
            .then(hasUserWithUserName => {
                if(hasUserWithUserName)
                return res.status(400).json({ error: `Username already taken` })
            
                return UsersService.hashPassword(password)
                    .then(hashedPassword => {
                        const newUser = {
                            user_name,
                            password: hashedPassword,
                            full_name,

                        }

                        return UsersService.insertUser(
                            req.app.get('db'),
                            newUser
                        )
                        .then(user => {
                            res
                                .status(201)
                                .location(`api/users/${user.id}`)
                                .json(UsersService.serializeUser(user))
                        })
                    })
            })
            .catch(next)
    })

module.exports = usersRouter