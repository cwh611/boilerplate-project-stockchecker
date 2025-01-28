'use strict';

const { Client } = require('pg');
const postgres_db = new Client({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false, // Required for secure Heroku connection
  },
});
postgres_db.connect()
  .then(() => console.log('Connected to PostgreSQL'))
  .catch((err) => console.error('PostgreSQL connection error', err.stack));

module.exports = function (app) {
  
  app.route('/api/stock-prices')
    
    .get(async (req, res) => {
      
      let { stock, like } = req.query;
      if (!Array.isArray(stock)) stock = [stock]; // Ensure it's an array
  
      if (like) {
        for (let i = 0; i < stock.length; i++) {
          try {
            let alreadyLiked = await postgres_db.query(
              "SELECT * FROM likes WHERE ip_address = $1 AND stock_symbol = $2",
              [req.ip, stock[i]]
            );
  
            if (alreadyLiked.rows.length === 0) {
              // Add like only if it doesn't already exist
              await postgres_db.query(
                "INSERT INTO likes (ip_address, stock_symbol) VALUES ($1, $2)",
                [req.ip, stock[i]]
              );
            }
          } catch (err) {
            console.log("Server error (database)", err);
          }
        }
      }
  
      // Get like counts
      let likeCounts = [];
      for (let i = 0; i < stock.length; i++) {
        try {
          let likeCount = await postgres_db.query(
            "SELECT COUNT(*) FROM likes WHERE stock_symbol = $1",
            [stock[i]]
          );
          likeCounts.push(parseInt(likeCount.rows[0].count, 10)); // Extract the count
        } catch (err) {
          console.log("Server error (database):", err);
        }
      }
  
      // Fetch stock data
      let requests = stock.map((symbol) =>
        fetch(`https://stock-price-checker-proxy.freecodecamp.rocks/v1/stock/${symbol}/quote`)
          .then((response) => response.json())
      );
      
      try {
        let responses = await Promise.all(requests);
        console.log("RESPONSES:", responses);
        let results = {};
        if (responses.length === 2) {
          results.stockData = [{
            stock: responses[0].symbol,
            price: responses[0].latestPrice,
            rel_likes: likeCounts[0] - likeCounts[1]
          },
         {
           stock: responses[1].symbol,
           price: responses[1].latestPrice,
           rel_likes: likeCounts[1] - likeCounts[0]
         }                   
          ]
        } else {
          results.stockData = {
            stock: responses[0].symbol,
            price: responses[0].latestPrice,
            likes: likeCounts[0]
          }
        }
        res.json(results);
        console.log("RESULTS:", results)
      } catch (err) {
        console.log("Server error:", err);
        res.status(500).send("Server error");
      }
  });
};
