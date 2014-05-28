var should = require('should'),
    request = require('supertest'),
    app = require('../../../app'),
    models = require('../../../models'),
    sequelize = models.sequelize,
    User = models.User;

describe('`/api/users`', function() {
  before(function(done) {
    sequelize
      .sync({ force: true })
      .complete(done);
  });

  describe('`GET`', function() {
    describe('with no users', function() {
      it('should return 200 status', function(done) {
        request(app)
          .get('/api/users')
          .set('Authorization', 'please')
          .expect(200)
          .end(done);
      });

      it('should have `Content-Type: application/json`', function(done) {
        request(app)
          .get('/api/users')
          .set('Authorization', 'please')
          .expect('Content-Type', /json/)
          .end(done);
      });

      it('should return empty array', function(done) {
        request(app)
          .get('/api/users')
          .set('Authorization', 'please')
          .end(function(err, res) {
            res.body.should.eql([]);
            return done(err);
          });
      });
    });

    describe('with users', function() {
      before(function(done) {
        User.create({
          name: 'Qui-Gon Jinn',
          username: 'quigon'
        }).complete(function() {
          User.create({
            name: 'General Grievous',
            username: 'grievous'
          }).complete(done);
        });
      });

      it('should return 200 status', function(done) {
        request(app)
          .get('/api/users')
          .set('Authorization', 'please')
          .expect(200)
          .end(done);
      });

      it('should have `Content-Type: application/json`', function(done) {
        request(app)
          .get('/api/users')
          .set('Authorization', 'please')
          .expect('Content-Type', /json/)
          .end(done);
      });

      it('should return 2 users', function(done) {
        request(app)
          .get('/api/users')
          .set('Authorization', 'please')
          .end(function(err, res) {
            res.body.should.have.length(2);
            return done(err);
          });
      });

      it('should be queryable', function(done) {
        request(app)
          .get('/api/users')
          .query({ username: 'quigon' })
          .set('Authorization', 'please')
          .end(function(err, res) {
            res.body.should.have.length(1);
            res.body[0].should.have.property('username', 'quigon');
            return done(err);
          });
      });
    });
  });

  describe('`/:user_id`', function() {
    describe('`GET`', function() {
      describe('with no user', function() {
        it('should return 404 status', function(done) {
          request(app)
            .get('/api/users/404')
            .set('Authorization', 'please')
            .expect(404)
            .end(done);
        });

        it('should have `Content-Type: application/json`', function(done) {
          request(app)
            .get('/api/users/404')
            .set('Authorization', 'please')
            .expect('Content-Type', /json/)
            .end(done);
        });

        it('should return error message', function(done) {
          request(app)
            .get('/api/users/404')
            .set('Authorization', 'please')
            .end(function(err, res) {
              res.body.should.eql({ error: 'not found' });
              return done(err);
            });
        });
      });

      describe('with user', function() {
        var user;

        before(function(done) {
          User.create({
            name: 'Count Dooku',
            username: 'taranis',
            division_id: null
          }).complete(function(err, u) {
            user = u;
            return done(err);
          });
        });

        it('should return 200 status', function(done) {
          request(app)
            .get('/api/users/' + user.id)
            .set('Authorization', 'please')
            .expect(200)
            .end(done);
        });

        it('should have `Content-Type: application/json`', function(done) {
          request(app)
            .get('/api/users/' + user.id)
            .set('Authorization', 'please')
            .expect('Content-Type', /json/)
            .end(done);
        });

        it('should return proper user', function(done) {
          request(app)
            .get('/api/users/' + user.id)
            .set('Authorization', 'please')
            .end(function(err, res) {
              var attrs = user.toJSON();

              attrs.created_at = attrs.created_at.toJSON();
              attrs.updated_at = attrs.updated_at.toJSON();

              res.body.should.eql(attrs);
              return done(err);
            });
        });
      });
    });

    describe('`PUT`', function() {
      var user;

      before(function(done) {
        User.create({
          name: 'Admiral Akbar',
          username: 'ackbar'
        }).complete(function(err, u) {
          user = u;
          return done(err);
        });
      });

      it('should return 200 status', function(done) {
        request(app)
          .put('/api/users/' + user.id)
          .set('Content-Type', 'application/json')
          .set('Authorization', 'please')
          .send({ name: 'Admiral Ackbar' })
          .expect(200)
          .end(done);
      });

      it('should properly update attributes', function(done) {
        request(app)
          .put('/api/users/' + user.id)
          .set('Content-Type', 'application/json')
          .set('Authorization', 'please')
          .send({ name: 'Admiral Ackbar' })
          .end(function(err, res) {
            res.body.should.have.property('name', 'Admiral Ackbar');
            return done(err);
          });
      });
    });

    describe('`DELETE`', function() {
      var user;

      before(function(done) {
        User.create({
          name: 'Savage Opress',
          username: 'savage'
        }).complete(function(err, u) {
          user = u;
          return done(err);
        });
      });

      it('should return 204 status', function(done) {
        request(app)
          .delete('/api/users/' + user.id)
          .set('Authorization', 'please')
          .expect(204)
          .end(done);
      });

      it('should properly delete user', function(done) {
        request(app)
          .get('/api/users/' + user.id)
          .set('Content-Type', 'application/json')
          .set('Authorization', 'please')
          .expect(404)
          .end(done);
      });
    });
  });
});
