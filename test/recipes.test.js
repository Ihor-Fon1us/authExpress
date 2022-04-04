const request = require('supertest');
const app = require('../app');
const UserService = require('../services/UserService');
const mongose = require('mongoose');
const UserModel = require('../models/mongoose/userModel');
const bcrypt = require('bcrypt');


let id;
let token;

describe('test the recipes API', () => {
    beforeAll( async () => {
        
        const url = `mongodb://127.0.0.1:27017/recipe_app_test1`;
        const connection = await mongose.connect(url , {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        }).then(() => {
            console.log('Connected to mongodb');
        }).catch((err) => {
            console.log('Error connecting to mongodb: ' + err);
        });   
        
        const user = {
            name: 'testuser',
            email: 'test@test.t',
            password: 'testuser'    
            
        }
        const newUser = new UserModel(user);
        newUser.hashPassword = bcrypt.hashSync(user.password, 12);
        newUser.save().then(console.log('user created'));
    });
    
    afterAll( async () => {
        await UserService.removeAll();
        mongose.connection.close();
    })
    //test register 

    describe('POST/register', () => {
        it ('register user', async () => {
            const user = {
                name: 'admin',
                email: 'ad@ad.com',
                password: 'admin'

            };
            const res = await request (app)
            .post('/register')
            .send(user);
            expect(res.statusCode).toEqual(200);
            expect(res.body).toEqual({success: true });
        });
    });

    // test login
    describe('POST/login', () => {
        it ('login admin', async () => {
            const user = {
                name: 'admin',
                password: 'admin'
            };
            const res = await request (app)
            .post('/login')
            .send(user);
            token = res.header['set-cookie'][0].split(';')[0].split('=')[1];
            expect(res.statusCode).toEqual(302);
            
        });
        it ('authenticate user and sign him in', async () => {
            const user = {
                name: 'testuser',
                password: 'testuser'
            };
            const res = await request (app)
            .post('/login')
            .send(user);
            expect(res.statusCode).toEqual(302);
        });
        it ('authenticate missing password', async () => {
            const user = {
                name: 'testuser'
            };
            const res = await request (app)
            .post('/login')
            .send(user);
            expect(res.statusCode).toEqual(401);
            expect(res.body).toEqual({ message: 'enter name and password', success: false });
        });
        it ('authenticate missing user', async () => {
            const user = {
                password: 'testuser'
            };
            const res = await request (app)
            .post('/login')
            .send(user);
            expect(res.statusCode).toEqual(401);
            expect(res.body).toEqual({ message: 'enter name and password', success: false });
        });
        it ('authenticate wrong password', async () => {
            const user = {
                name: 'testuser',
                password: 'wrongpassword'
            };
            const res = await request (app)
            .post('/login')
            .send(user);
            expect(res.statusCode).toEqual(401);
            expect(res.body).toEqual({ message: 'Auth failed. Wrong password', success: false });
        });
        it ('authenticate wrong user', async () => {
            const user = {
                name: 'wronguser',
                password: 'testuser'
            };
            const res = await request (app)
            .post('/login')
            .send(user);
            expect(res.statusCode).toEqual(401);
            expect(res.body).toEqual({ message: 'Auth failed. No user found', success: false });
        });
    });

    describe('availability index', () => {
        it ('check availability', async () => {
            const res = await request (app)
            .get('/');
            expect(res.statusCode).toEqual(302);
        });
    });

    describe('availability admin panel', () => {
        it ('check availability correct user', async () => {
            const res = await request (app)
            .get('/admin')
            .set('cookie', [`accessToken=${token}`]);
            expect(res.statusCode).toEqual(200);
        });
        it ('check availability wrong user', async () => {
            const wrongtoken = 'wrongtoken' + token;
            const res = await request (app)
            .get('/admin')
            .set('cookie', [`accessToken=${wrongtoken}`]);
            expect(res.statusCode).toEqual(302);
        });
    });
});