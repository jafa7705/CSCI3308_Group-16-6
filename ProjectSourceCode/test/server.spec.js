// ********************** Initialize server **********************************
const server = require('../src/index');

// ********************** Import Libraries ***********************************
const chai = require('chai');
const chaiHttp = require('chai-http');
chai.should();
chai.use(chaiHttp);
const { expect } = chai;

// ********************** TESTING /register API ******************************

describe('Register API Tests', () => {
  
  //  Positive test case: valid input
  it('Positive: Should register user successfully with valid input', done => {
    chai
      .request(server)
      .post('/register')
      .send({
        username: 'testuser1',
        password: 'securepass',
        confirmPassword: 'securepass',
      })
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body.message).to.equal('Registration successful');
        done();
      });
  });

  //  Negative test case: passwords do not match
  it('Negative: Should fail registration if passwords do not match', done => {
    chai
      .request(server)
      .post('/register')
      .send({
        username: 'testuser2',
        password: 'pass123',
        confirmPassword: 'wrongpass',
      })
      .end((err, res) => {
        expect(res).to.have.status(400);
        expect(res.body.message).to.equal('Passwords do not match');
        done();
      });
  });
});
