var inquirer = require('inquirer');
var mysql = require('mysql');

var connection = mysql.createConnection({
  host: "localhost",

  // Your port
  port: 3306,

  // Your username
  user: "root",

  // Your password
  password: "Wbears!6",
  database: "bamazon"
});


connection.connect((err) => {
  if (err) throw err;
  console.log(`Connected as id: ${connection.threadId}`);
  //ask if user wants to make a purchase from the top 10 best sellers
  purchaseConfirmation();
});


//ask user if they would like to purchase an item from the website to begin the purchase sequence
purchaseConfirmation = () => {
  inquirer
    .prompt({
      name: "confirmation",
      type: "confirm",
      message: "\n\nWelcome to Bamazon\n" +
        "Would you like to choose an item from our top 10 best sellers?",
      default: true
    })
    .then(answer => {
      if (answer.confirmation === true) {
        readInventory();
      } else {
        console.log("Sorry to hear that, come back anytime.");
        return;
      };
    });
};

readInventory = () => {
  //define the section of the table
  var query = "SELECT id, product_name, department_name, price FROM products";
  connection.query(query, (err, res) => {
    if (err) throw err;
    console.log("\n-----------------------------------------------------------------\n" +
      "Here are our top 10 best sellers at Bamazon.\n" +
      "\n");
    for (i = 0; i < res.length; i++) {
      console.log(
        `ID: ${res[i].id}
        ---------------------------
        Product: ${res[i].product_name}
        Department: ${res[i].department_name}
        Price: $${res[i].price}
        ---------------------------
        `
      );
    };
    return userPurchase();
  });
};
var itemToPurchase;
var itemPrice;
var inStock;
var newQ;
var totalPrice;
var newTotalPrice = 0;

//write function to handle the users purchase
userPurchase = () => {
  //ask customer which item they want to purchase by specifying the ID number
  inquirer
    .prompt({
      name: "id",
      type: "list",
      message: "Choose the ID number of the item you would like to purchase.",
      choices: ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10"]
    })
    .then(answer => {
      //connect using this query to identify which item the user chose
      connection.query("SELECT id, product_name, department_name, price, stock_quantity FROM products", (err, res) => {
        for (i = 0; i < res.length; i++) {
          //comparing answer to the id number from the bamazon database
          if (answer.id == res[i].id) {

            //set the specific item chosen to a variable
            itemToPurchase = res[i].product_name;
            // set the quantity available of the chosen item to a variable
            inStock = res[i].stock_quantity;
            //set the price of the chosen item to a variable
            itemPrice = res[i].price;
            console.log(`\nGood decision, the ${itemToPurchase} is one of our best items\n`);
          } else { };
        };
        inquirer
          .prompt({
            name: "amount",
            type: "input",
            message: `How many of the ${itemToPurchase} would you like to buy at the cost of ${itemPrice}?`
          })
          .then(answer => {
            //check if the quantity of items requested is less than or equal to the quantity of items in stock
            if (answer.amount <= inStock) {
              //subtract total quantity from requested purchase's quantity
              newQ = inStock - answer.amount;
              totalPrice = itemPrice * answer.amount;
              integerTotalPrice = parseFloat(totalPrice);
              formattedTotalPrice = Number(integerTotalPrice).toFixed(2);
              newTotalPrice += totalPrice;
              integerNewTotalPrice = parseFloat(newTotalPrice);
              formattedNewTotalPrice = Number(integerNewTotalPrice).toFixed(2)
              //if true then update the products table with the new quantity for that item
              connection.query("UPDATE products SET ? WHERE ?",
                [
                  {
                    stock_quantity: newQ
                  },
                  {
                    product_name: itemToPurchase
                  }
                ],
                function (err, res) {
                  //show updated quantity in stock
                  console.log(`Thank you for your purchase of ${answer.amount} ${itemToPurchase}s. 
                      Your total on this transaction: ${totalPrice}
                      Your grand total today: ${newTotalPrice}

                      There are ${newQ} of the ${itemToPurchase}s now in stock.`);

                  inquirer
                    .prompt({
                      type: 'confirm',
                      name: 'new',
                      message: 'Would you like to make another purchase?',
                      default: true
                    })
                    .then(answer => {
                      if (answer.new === true) {
                        readInventory();
                      } else {
                        console.log("Sorry to hear that, come back anytime.")
                      };
                    });
                });
            } else {
              console.log(`\nSo sorry, there are ${inStock} of the ${itemToPurchase}s in stock right now and you ordered ${answer.amount}. 
      You can either change to a new item, adjust the requested amount, or come back again later.\n`);
              inquirer
                .prompt({
                  type: 'confirm',
                  name: 'new',
                  message: '\nWould you like to try another purchase?',
                  default: true
                })
                .then(answer => {
                  if (answer.new === true) {
                    readInventory();
                  } else {
                    console.log("\nSorry to hear that, come back anytime.");
                    return;
                  };
                });
            };
          });
      });
    });
};

