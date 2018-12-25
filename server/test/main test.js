const supertest = require('supertest');
const { expect } = require('chai');
const AUTH_URL = 'http://127.0.0.1:8081/api';
const URL = 'http://127.0.0.1:8085/api'

describe('CREATE, GET, PATCH, DELETE birth type dictionary', () => {
    let token;

    it('Authorize user', async () => {
        let { body } = await supertest(AUTH_URL)
            .post(`/tokens`)
            .set('Authorization', 'Basic cWE6MQ==')
            .expect(200);
        expect(body).to.be.an('object').and.not.empty;
        expect(body.token).to.be.a('string');
        token = body.token;
    });
    it('GET birth types', async () => {
        let { body } = await supertest(URL)
            .get(`/dictionaries/birth-types`)
            .set('Authorization', token)
            .expect(200);
        expect(body).to.be.an('object');
        expect(body.count).to.be.a('number');
    });
});
