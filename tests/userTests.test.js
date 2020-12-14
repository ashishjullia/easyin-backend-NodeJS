const supertest = require('supertest');
const server = require('../main');
const session = require('supertest-session');

var testSession = null;
 
beforeEach(function () {
  testSession = session(server);
});

// Sign up
let data = {
  "firstname": "user",
  "lastname": "test31",
  "email": "test31@example.com",
  "password": "password"
}

// Sign up
it('Signing up a user', function (done) {
    supertest(server)
        .post('/users/signup')
        .send(data)
        .set('Accept', 'application/json')
        .expect('Content-Type', /json/)
        .expect(201)
        .end((err) => {
            if (err) return done(err);
            done();
        });
});

var authenticatedSession;
// Sign in user
it('Signing in a user', function (done) {
  testSession.post('/users/login')
    .send({ email: 'test31@example.com', password: 'password' })
    .expect(201)
    // .end(done);
    .end(function (err) {
      if (err) return done(err);
      authenticatedSession = testSession;
      return done();
    });
});

// Access Dashboard
it('Accessing Dashboard', function (done) {
  authenticatedSession.post('/dashboard')
    .expect(201)
    .end(done);
});