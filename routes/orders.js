var express = require('express');
var router = express.Router();
var mysql = require('mysql');

var connection = mysql.createConnection({
  host     : 'zulily.cljboxgxti7z.us-east-2.rds.amazonaws.com',
  user     : 'root',
  password : '',
  database : 'zulily'
});

// Start the connection
connection.connect();

/* Top K most sold items between start and end dates */
router.post('/orders/topselling', function(req, res, next) {
  
  // Get all the values from the body
  var value=JSON.parse(JSON.stringify(req.body));
  var k = value["k"];
  var startdate = value["startdate"];
  var enddate = value["enddate"];

  // Create query
  var query_to_be_performed = "SELECT product, SUM(quantity) AS TotalSold FROM zulily.orders WHERE created_at BETWEEN \'" + startdate + "\' AND \'" + enddate + "\' GROUP BY product ORDER BY TotalSold DESC LIMIT " + k;
  var resultJSON;
  
  //Perform the Query
  connection.query(query_to_be_performed, function (error, results, fields) {
	if (error) throw error;
	// Store the result into JSON
	resultJSON = JSON.stringify(results);
	//Respond with the JSON	
	res.send(resultJSON);
    });  
});

/* Insert into Database */
router.post('/orders/insert', function(req, res, next) {
  
  // Get all the values from the body
  var value=JSON.parse(JSON.stringify(req.body));
  var order_id = value["order_id"];
  var product = value["product"];
  var quantity = value["quantity"];
  var created_at = value["created_at"];
  var updated_at = value["updated_at"];

  // Create query
  var query_to_be_performed = "INSERT INTO zulily.orders (order_id,product,quantity,created_at,updated_at) VALUES (\"" + order_id + "\",\"" + product + "\"," + quantity + ",\"" + created_at + "\",\"" + updated_at + "\")";
  var query_to_be_returned = "SELECT * FROM zulily.orders WHERE order_id=\"" + order_id + "\"";
  var resultJSON;

  connection.query( query_to_be_performed, ( err, rows ) => {
    connection.query( query_to_be_returned, ( err, rows2 ) => {
      if (err) throw err;
	  // Store the result into JSON
	  resultJSON = JSON.stringify(rows2);
	  //Respond with the JSON	
	  res.send(resultJSON);
    })
  });
});

module.exports = router;
