var mysql = require("mysql");
var inquirer = require("inquirer");

var connection = mysql.createConnection({
    host: "localhost",

    // Your port; if not 3306
    port: 3306,

    // Your username
    user: "root",

    // Your password
    password: "root",
    database: "bamazon"
});

connection.connect(function (err) {
    if (err) throw err;
    // run the start function after the connection is made to prompt the user************
    loadProducts();
});

function loadProducts() {

    connection.query("SELECT * FROM products", function (err, res) {
        for (var i = 0; i < res.length; i++) {
            console.log(
                "Id: " +
                res[i].item_id +
                " || Product:  " +
                res[i].product_name +
                " || Price:  " +
                res[i].price
            );
        }
        buyProduct();
      
    });
}

function buyProduct() {
    inquirer
    .prompt([
        {
            name: "id",
            type: "input",
            message: "What is the id of item you would like to buy?"
        },
        {
            name: "qty",
            type: "input",
            message: "How many?",
            validate: function (value) {
                if (isNaN(value) === false) {
                    return true;
                }
                return false;
            }
        },

    ])
    .then(function (answer) {
        console.log("Product is " + answer.id);
        console.log("Qty is " + answer.qty);
        stock = 0;
        var query = "SELECT * FROM PRODUCTS WHERE ?";
        connection.query(query, { ITEM_ID: answer.id }, function (err, res) {
            console.log("Stock in DB is " + res[0].stock_quantity);
            if (answer.qty > res[0].stock_quantity) {
                console.log("Not enough in stock");
                loadProducts();
            } else {
                connection.query(
                    "UPDATE products SET ? WHERE ?",
                    [
                        {
                            stock_quantity: res[0].stock_quantity - answer.qty
                        },
                        {
                            item_id: answer.id
                        }
                    ],
                    function (error) {
                        if (error) throw err;
                        console.log("Order placed successfully!");
                        console.log("Cost of the order is "+answer.qty*res[0].price);
                        loadProducts();
                    }
                );
            }
        });
       // loadProducts();
      
    });

}

// connection.query("SELECT * FROM products", function (err, res) {

//     if (err) throw err;
//     console.log("load table items");
//     placeOrderByID(res);






