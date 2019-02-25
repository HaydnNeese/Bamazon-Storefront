DROP DATABASE IF EXISTS bamazon;

CREATE DATABASE bamazon;

USE bamazon;

CREATE TABLE products(
	id INT(11) NOT NULL AUTO_INCREMENT,
    product_name VARCHAR(50) NOT NULL,
    department_name VARCHAR(50) NOT NULL,
    price DECIMAL(6,2) NOT NULL,
    stock_quantity INT(11) NOT NULL,
    PRIMARY KEY(id)
);

INSERT INTO products
	(product_name, department_name, price, stock_quantity)
VALUES 
	('Bamazon Flame Stick', 'Electronics', 29.99, 50),
    ('Bamazon Nozy Speaker', 'Electronics', 49.99, 50),
    ('Bamazon I.C.U', 'Surveillance and Home Security', 24.99, 75),
    ('Bamazon The Board Game', 'Board Games', 34.99, 100),
    ('Bamazon Flame HD Tablet', 'Electronics', 99.99, 150),
    ('Bamboozle Vision VR Headset', 'Electronics', 449.99, 100),
    ('Bamazon Twitbit', 'Sports and Outdoors', 119.99, 100),
    ('Bamazon Pressure Cooker', 'Kitchen and Dining', 79.99, 100),
    ('Bamazon One Use Frisbee', 'Sports and Outdoors', 19.99, 50),
    ("Croc's: The Collector's Edition", 'Clothing', 2499.99, 10);
    
SELECT * FROM products;