const chaiHttp = require('chai-http');
const chai = require('chai');
const assert = chai.assert;
const server = require('../server');

chai.use(chaiHttp);

suite('Functional Tests', function() {
  
  test('Viewing one stock: GET request to /api/stock-prices/', function (done) {
    chai
      .request(server)
      .get('/api/stock-prices')
      .query({stock: 'GOOG'})
      .end(function(err, res) {
        assert.property(res.body.stockData, 'stock', 'stockData should have a stock property');
        assert.property(res.body.stockData, 'price', 'stockData should have a price property');
        done();
      })
  });

  test('Viewing one stock and liking it: GET request to /api/stock-prices/', function (done) {
    chai
      .request(server)
      .get('/api/stock-prices')
      .query({stock: 'GOOG', like: true})
      .end(function(err, res) {
        assert.property(res.body.stockData, 'stock', 'stockData should have a stock property');
        assert.property(res.body.stockData, 'price', 'stockData should have a price property');
        assert.property(res.body.stockData, 'likes', 'stockData should have a likes property');
        assert.equal(res.body.stockData.likes, 1)
        done();
      });  
  });

  test('Viewing the same stock and liking it again: GET request to /api/stock-prices/', function (done) {
    chai
      .request(server)
      .get('/api/stock-prices')
      .query({stock: 'GOOG', like: true})
      .end(function(err, res) {
        assert.property(res.body.stockData, 'stock', 'stockData should have a stock property');
        assert.property(res.body.stockData, 'price', 'stockData should have a price property');
        assert.property(res.body.stockData, 'likes', 'stockData should have a likes property');
        assert.equal(res.body.stockData.likes, 1)
        done();
      });  
  });

  test('Viewing two stocks: GET request to /api/stock-prices/', function (done) {
    chai
      .request(server)
      .get('/api/stock-prices')
      .query({stock: ['GOOG', 'MSFT']})
      .end(function(err, res) {
        assert.isArray(res.body.stockData, 'stock', 'stockData should be an array');
        done();
      });  
  });

  test('Viewing two stocks and liking them: GET request to /api/stock-prices/', function (done) {
    chai
      .request(server)
      .get('/api/stock-prices')
      .query({stock: ['GOOG', 'MSFT'], like: true})
      .end(function(err, res) {
        assert.isArray(res.body.stockData, 'stock', 'stockData should be an array');
        assert.equal(res.body.stockData[0].rel_likes, 0)
        assert.equal(res.body.stockData[1].rel_likes, 0)
        done();
      });  
  });
  
});
