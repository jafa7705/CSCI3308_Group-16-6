// ********************** Initialize server **********************************
const server = require('../src/index');
const db = require('../src/db'); // Adjust path if needed
const bcryptjs = require('bcryptjs'); // Also make sure this is required

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




// describe('Login Route Tests', () => {
//   const testUser = {
//     username: 'testuser',
//     password: 'password',
//   };


//   before(async () => {
//     // Clear users table and create test user
//     await db.query('TRUNCATE TABLE users CASCADE');
//     const hashedPassword = await bcryptjs.hash(testUser.password, 10);
//     await db.query('INSERT INTO users (username, password) VALUES ($1, $2)', [
//       testUser.username,
//       hashedPassword,
//     ]);
//   });
//   // Clean up database after tests
//   after(async () => { 
//     await db.query('TRUNCATE TABLE users CASCADE');
//   });

//   it('Positive: should redirect to /home when username and password are correct', done => {
//     chai
//       .request(server)
//       .post('/login')
//       .send({
//         username: testUser.username,
//         password: testUser.username,
//       })
//       .end((err,res) => {
//         expect(res).to.have.status(302);
//         expect(res).to.redirectTo('/home');
//         done();
//       });
//   });

//   it('Negative: should render the login page with an error message', done => {
//     chai
//       .request(server)
//       .post('/login')
//       .send({
//         username: testUser.username,
//         password: 'wrongpassword',
//       })
//       .end((err, res) => {
//         expect(res).to.have.status(400);
//         expect(res.body.message).to.equal('Wrong username or password');
//         done();
//       });
//   });
// });