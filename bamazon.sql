DROP DATABASE IF EXISTS bamazon;
CREATE database bamazon;

USE bamazon;

CREATE TABLE products (

item_id INT NOT NULL AUTO_INCREMENT,
product_name VARCHAR(45) NOT NULL,
department_name VARCHAR(45) NOT NULL,
price DECIMAL(10,2) NOT NULL,
stock_quantity INT (10) NOT NULL,
PRIMARY KEY (item_id)

);

SELECT * FROM products;

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ("Toothpaste", "Toiletries", 4.78, 38),
("Hairbrush", "Toiletries", 1.98, 19),
("Showercap", "Toiletries", 4.00, 25),
("Coffeemug", "Kitchen", 2.80, 70),
("Coffeepowder", "Kitchen", 7.60, 50),
("Sugar", "Kitchen", 1.50, 40),
("Milk", "Dairy", 10.78, 35),
("Yogurt", "Dairy", 5.50, 20),
("Leggings", "Clothes", 12.00, 40),
("Tops", "Clothes", 9.99, 50);