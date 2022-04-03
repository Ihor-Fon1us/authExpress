const request = require('supertest');
const app = require('../app');
const UserService = require('../services/UserService');


let id;
let token;

describe('test the recipes API', () => {
    beforeAll( async (done) => {
            await UserService.removeAll();
            let user;
            user = await UserService.create({
                name: 'test',
                email: 'test@test.t',
                password: 'test'
            });
            done();
        });
    
    // test login
    describe('POST/login', () => {
        it ('authenticate user and sign him in', async () => {
            const user = {
                name: 'tetsuser',
                password: 'testuser'
            };
            const res = await request (app)
            .post('/login')
            .send(user);
            token = res.header.accessToken;
            expect(res.statusCode).toEqual(200);
            expect(res.body).toEqual({message: 'Auth successful', success: true});
        });
        it ('authenticate fail password', async () => {
            const user = {
                name: 'testuser'
            };
            const res = await request (app)
            .post('/login')
            .send(user);
            expect(res.statusCode).toEqual(401);
            expect(res.body).toEqual({ message: 'Auth failed. Wrong password', success: false });
        });
        it ('authenticate fail user', async () => {
            const user = {
                password: 'testuser'
            };
            const res = await request (app)
            .post('/login')
            .send(user);
            expect(res.statusCode).toEqual(401);
            expect(res.body).toEqual({ message: 'Auth failed. No user found', success: false });
        });
    });
    
});