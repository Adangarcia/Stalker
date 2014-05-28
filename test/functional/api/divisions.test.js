var should = require('should'),
    request = require('supertest'),
    app = require('../../../app'),
    models = require('../../../models'),
    sequelize = models.sequelize,
    Division = models.Division;

describe('`/api/divisions`', function() {
  before(function(done) {
    sequelize
      .sync({ force: true })
      .complete(done);
  });

  describe('`GET`', function() {
    describe('with no divisions', function() {
      it('should return 200 status', function(done) {
        request(app)
          .get('/api/divisions')
          .set('Authorization', 'please')
          .expect(200)
          .end(done);
      });

      it('should have `Content-Type: application/json`', function(done) {
        request(app)
          .get('/api/divisions')
          .set('Authorization', 'please')
          .expect('Content-Type', /json/)
          .end(done);
      });

      it('should return empty array', function(done) {
        request(app)
          .get('/api/divisions')
          .set('Authorization', 'please')
          .end(function(err, res) {
            res.body.should.eql([]);
            return done(err);
          });
      });
    });

    describe('with divisions', function() {
      before(function(done) {
        Division.create({
          name: 'Jedi Knights'
        }).complete(function() {
          Division.create({
            name: 'Sith Lords'
          }).complete(done);
        });
      });

      it('should return 200 status', function(done) {
        request(app)
          .get('/api/divisions')
          .set('Authorization', 'please')
          .expect(200)
          .end(done);
      });

      it('should have `Content-Type: application/json`', function(done) {
        request(app)
          .get('/api/divisions')
          .set('Authorization', 'please')
          .expect('Content-Type', /json/)
          .end(done);
      });

      it('should return 2 divisions', function(done) {
        request(app)
          .get('/api/divisions')
          .set('Authorization', 'please')
          .end(function(err, res) {
            res.body.should.have.length(2);
            return done(err);
          });
      });

      it('should be queryable', function(done) {
        request(app)
          .get('/api/divisions')
          .query({ name: 'Sith Lords' })
          .set('Authorization', 'please')
          .end(function(err, res) {
            res.body.should.have.length(1);
            res.body[0].should.have.property('name', 'Sith Lords');
            return done(err);
          });
      });
    });
  });

  describe('`/:division_id`', function() {
    describe('`GET`', function() {
      describe('with no division', function() {
        it('should return 404 status', function(done) {
          request(app)
            .get('/api/divisions/404')
            .set('Authorization', 'please')
            .expect(404)
            .end(done);
        });

        it('should have `Content-Type: application/json`', function(done) {
          request(app)
            .get('/api/divisions/404')
            .set('Authorization', 'please')
            .expect('Content-Type', /json/)
            .end(done);
        });

        it('should return error message', function(done) {
          request(app)
            .get('/api/divisions/404')
            .set('Authorization', 'please')
            .end(function(err, res) {
              res.body.should.eql({ error: 'not found' });
              return done(err);
            });
        });
      });

      describe('with division', function() {
        var division;

        before(function(done) {
          Division.create({
            name: 'Galactic Republic'
          }).complete(function(err, d) {
            division = d;
            return done(err);
          });
        });

        it('should return 200 status', function(done) {
          request(app)
            .get('/api/divisions/' + division.id)
            .set('Authorization', 'please')
            .expect(200)
            .end(done);
        });

        it('should have `Content-Type: application/json`', function(done) {
          request(app)
            .get('/api/divisions/' + division.id)
            .set('Authorization', 'please')
            .expect('Content-Type', /json/)
            .end(done);
        });

        it('should return proper division', function(done) {
          request(app)
            .get('/api/divisions/' + division.id)
            .set('Authorization', 'please')
            .end(function(err, res) {
              var attrs = division.toJSON();

              attrs.created_at = attrs.created_at.toJSON();
              attrs.updated_at = attrs.updated_at.toJSON();

              res.body.should.eql(attrs);
              return done(err);
            });
        });
      });
    });

    describe('`PUT`', function() {
      var division;

      before(function(done) {
        Division.create({
          name: 'Galactic Empire'
        }).complete(function(err, d) {
          division = d;
          return done(err);
        });
      });

      it('should return 200 status', function(done) {
        request(app)
          .put('/api/divisions/' + division.id)
          .set('Content-Type', 'application/json')
          .set('Authorization', 'please')
          .send({ name: 'Admiral Ackbar' })
          .expect(200)
          .end(done);
      });

      it('should properly update attributes', function(done) {
        request(app)
          .put('/api/divisions/' + division.id)
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
      var division;

      before(function(done) {
        Division.create({
          name: 'Jedi Outcasts',
        }).complete(function(err, d) {
          division = d;
          return done(err);
        });
      });

      it('should return 204 status', function(done) {
        request(app)
          .delete('/api/divisions/' + division.id)
          .set('Authorization', 'please')
          .expect(204)
          .end(done);
      });

      it('should properly delete division', function(done) {
        request(app)
          .get('/api/divisions/' + division.id)
          .set('Content-Type', 'application/json')
          .set('Authorization', 'please')
          .expect(404)
          .end(done);
      });
    });
  });
});
