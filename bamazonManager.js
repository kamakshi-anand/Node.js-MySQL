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
    start();
    //    loadProducts();
});

function start() {
    inquirer
        .prompt({
            name: "action",
            type: "list",
            message: "What would you like to do?",
            choices: [
                "View Products for Sale",
                "View Low Inventory",
                "Add to Inventory",
                "Add New Product"
            ]
        })
        .then(function (answer) {
            switch (answer.action) {
                case "View Products for Sale":
                    viewProducts(true);
                    console.log("in 1");
                    break;

                case "View Low Inventory":
                    viewLowInventory();
                    console.log("in 2");
                    break;

                case "Add to Inventory":
                    viewProducts(false);
                    //    console.log("in 3");
                    break;

                case "Add New Product":
                    addProduct();
                    //   console.log("in 4");
                    break;
            }
        });
}

function viewProducts(flag) {
    connection.query("SELECT * FROM products", function (err, res) {
        for (var i = 0; i < res.length; i++) {
            console.log(
                "Id: " +
                res[i].item_id +
                " || Product:  " +
                res[i].product_name +
                " || Price:  " +
                res[i].price +
                " || Qty:  " +
                res[i].stock_quantity
            );
        }
        //  buyProduct();
        if (flag) {
            start();
        } else {
            updateInventory();
        }
    });
}

function viewLowInventory() {
    connection.query("SELECT * FROM products where stock_quantity < 5 ", function (err, res) {
        for (var i = 0; i < res.length; i++) {
            console.log(
                "Id: " +
                res[i].item_id +
                " || Product:  " +
                res[i].product_name +
                " || Price:  " +
                res[i].price +
                " || Qty:  " +
                res[i].stock_quantity
            );
        }
        //  buyProduct();
        start();
    });
}
function updateInventory() {
    //  viewProducts(false);

    inquirer
        .prompt([
            {
                name: "id",
                type: "input",
                message: "Please enter the id of the product you want to update the inventory for"
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
            var qty = parseInt(answer.qty);
            var query = "SELECT * FROM PRODUCTS WHERE ?";
            connection.query(query, { ITEM_ID: answer.id }, function (err, res) {
                //  console.log("Stock in DB is " + res[0].stock_quantity);  
                connection.query(
                    "UPDATE products SET ? WHERE ?",
                    [
                        {
                            stock_quantity: res[0].stock_quantity + qty
                        },
                        {
                            item_id: answer.id
                        }
                    ],
                    function (error) {
                        if (error) throw err;
                        console.log("Inventory updated successfully!");
                        // console.log("Cost of the order is " + answer.qty * res[0].price);
                        start();
                    }
                );
            });



        });
}

function addProduct() {
    inquirer
        .prompt([
            {
                name: "name",
                type: "input",
                message: "Please enter name of the product"
            },
            {
                name: "qty",
                type: "input",
                message: "Please enter the quantity",
                validate: function (value) {
                    if (isNaN(value) === false) {
                        return true;
                    }
                    return false;
                }
            },
            {
                name: "depName",
                type: "input",
                message: "Please enter name of the department"
            },
            {
                name: "price",
                type: "input",
                message: "Please enter Price",
                validate: function (value) {
                    if (isNaN(value) === false) {
                        return true;
                    }
                    return false;
                }
            },

        ])
        .then(function (answer) {
            console.log("Name is " + answer.name);
            console.log("Qty is " + answer.qty);
            console.log("Dep is " + answer.depName);
            console.log("Price is " + answer.price);
            var query = connection.query(
                "INSERT INTO products SET ?",
                {
                    product_name: answer.name,
                    stock_quantity: answer.qty,
                    department_name: answer.depName,
                    price: answer.price
                },
                function (err, res) {
                    console.log(res.affectedRows + " product inserted!\n");
                    // Call updateProduct AFTER the INSERT completes
                    start();
                }
            );
            // var qty = parseInt(answer.qty);
            // var query = "SELECT * FROM PRODUCTS WHERE ?";
            // connection.query(query, { ITEM_ID: answer.id }, function (err, res) {
            //     //  console.log("Stock in DB is " + res[0].stock_quantity);  
            //     connection.query(
            //         "UPDATE products SET ? WHERE ?",
            //         [
            //             {
            //                 stock_quantity: res[0].stock_quantity + qty
            //             },
            //             {
            //                 item_id: answer.id
            //             }
            //         ],
            //         function (error) {
            //             if (error) throw err;
            //             console.log("Inventory updated successfully!");
            //             // console.log("Cost of the order is " + answer.qty * res[0].price);
            //             start();
            //         }
            //     );
            // });



        });

}





