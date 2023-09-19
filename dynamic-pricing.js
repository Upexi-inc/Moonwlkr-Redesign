window.addEventListener('DOMContentLoaded', () => {
    //setTimeout to allow all elements to load that for some reason don't load with DOM
    setTimeout(() => {
        //declaring variables to contain sale and regular price values
        //sale and regular prices for the most common scenario (products are almost always on sale)
        //grabbing sale price from the item global variable and transforming it into a number
        let salePrice = Number(item.price);

        //the item global variable only contains its current price which in the most common scenario is the sale price
        //to get the regular price, i'll have to grab it from the HTML price element, which will return a string
        //to get the value in a number, I have to split the string in two to grab the number after the dollar sign
        //by using split() i'll get an array, where the number will be index 1
        //all this is wrapped in Number() to get a number
        let regularPrice = Number(document.querySelector('.redesign-product-price del .woocommerce-Price-amount bdi').innerText.split('$')[1]);

        //quantity input type number from where we'll get the input value
        const quantityInput = document.querySelector('.quantity input.qty');

        //hold quantity input value in a variable 
        //at page load this number will be 1, but we'll update its value every time the user clicks + or - or writes a number on the input
        let inputQtyNumber = Number(quantityInput.value);

        //declare variant buttons to use them later to listen to a click event - each variant has different price values and we have to take that into account
        const variantButtons = document.querySelectorAll('.button-variable-item');

        //grab variation form that contains important info in its json
        const variantionFormContainer = document.querySelector('form.variations_form');

        //grab product variations from the variation form json
        //this contains the display_price (price on sale) and display_regular_price (regular price) values required to calculate the price of the product
        const formVariationsJSON = JSON.parse(variantionFormContainer.dataset.product_variations);

        let clickedBtnIdx = 0;

        //update price when variant is clicked
        variantButtons.forEach(button => {
            button.addEventListener('click', function () {
                //assign new clicked button index value 
                clickedBtnIdx = Array.from(variantButtons).indexOf(button);
                //run the price function to get the new variant prices
                price();
                //run the updatePriceElements function to change price values on their respective html elements
                updatePriceElements();
            });
        });

        //FUNCTIONS

        //calculate price function
        function calculatePrice(priceValue) {
            //multiply quantity value by price value
            return (inputQtyNumber * priceValue).toFixed(2);
        }

        //function to calculate prices based on different scenarios
        function price() {
            let regularPriceValue;
            let salePriceValue;

            if (document.querySelector('.product-display span.onsale') !== null) {
                //scenario 1: if the product is on sale pass regular and sale price parameters onto the calculatePrice function
                regularPriceValue = calculatePrice(regularPrice);
                salePriceValue = calculatePrice(salePrice);

                if (document.querySelector('form.cart').classList.contains('variations_form')) {
                    //scenario 2: if the product is both on sale and has variants, pass the clicked variant prices as parameters onto the calculatePrice function
                    regularPriceValue = calculatePrice(Number(formVariationsJSON[clickedBtnIdx].display_regular_price));
                    salePriceValue = calculatePrice(Number(formVariationsJSON[clickedBtnIdx].display_price));
                }
            } else {
                //scenario 3: product is not on sale and does not have variants
                regularPriceValue = calculatePrice(item.price);
            }

            //return the two prices values as an array to be used in the updatePriceElements function
            return [regularPriceValue, salePriceValue];
        }

        function updatePriceElements() {
            //grab prices array from the price function
            let prices = price();

            //declare regular price container as an empty variable as the container is different depending on the scenario
            let regularPriceContainer;

            //grab regular price from the prices array
            let regularPriceNumber = prices[0];

            //if item is on sale
            if (document.querySelector('.product-display span.onsale') !== null) {
                //declare the sale price HTML element
                let salePriceContainer = document.querySelector('.redesign-product-price ins .woocommerce-Price-amount bdi');

                //assign sale price from the prices array to a variable 
                let salePriceNumber = prices[1];

                //change sale price inner html to include the calculated sale price
                salePriceContainer.innerHTML = `<span class="woocommerce-Price-currencySymbol">$</span>${salePriceNumber}`;

                //assign new element to regularPriceContainer
                regularPriceContainer = document.querySelector('.redesign-product-price del .woocommerce-Price-amount bdi');

                //change regular price inner html to include the calculated regular price
                regularPriceContainer.innerHTML = `<span class="woocommerce-Price-currencySymbol">$</span>${regularPriceNumber}`;

            } else {

                //if product is not on sale
                //assign regular price container element 
                regularPriceContainer = document.querySelector('.redesign-product-price .woocommerce-Price-amount bdi');

                //change regular price inner html to include the calculated regular price
                regularPriceContainer.innerHTML = `<span class="woocommerce-Price-currencySymbol">$</span>${regularPriceNumber}`;
            }
        }

        /*
        //calculate regular price
        function calculateRegularPrice(priceValue) {
            //declare variable to hold the result of this calculation
            let regularPriceResult = (inputQtyNumber * priceValue).toFixed(2);

            //check to see if item is on sale - this is important as it will determine where we'll get the regular price value
            if (document.querySelector('.product-display span.onsale') !== null) {
                //store calculation in variable - sale price x quantity
                //if it's on sale, it will grab the already declared regularPrice variable value
                if (document.querySelector('form.cart').classList.contains('variations_form')) {
                    regularPrice = Number(formVariationsJSON[clickedBtnIdx].display_regular_price);
                }
                regularPriceResult = inputQtyNumber * regularPrice;
            } else {
                //if it's not on sale, the price value is grabbed from the item global variable
                regularPrice = Number(item.price);
                //store calculation in variable - sale price x quantity
                regularPriceResult = inputQtyNumber * regularPrice;
            }

            //return calculation result to be used in other functions
            return regularPriceResult;
        }

        //calculate sale price
        function calculateSalePrice(param) {
            //store calculation in variable - sale price x quantity
            let salePriceResult = inputQtyNumber * param;
            //return calculation result to be used in other functions
            return salePriceResult;
        }

        //function to update price
        function updatePrice() {
            //declare regularPriceContainer with no value as of yet. this is because if the product is not on sale, there will be no distinction between regular and sale prices HTML elements - so no <del> or <ins> elements
            let regularPriceContainer;

            let regularPriceNumber = calculateRegularPrice(item.price);

            //check to see if item is on sale - this means that the price HTML elements will be different <del> and <ins>
            if (document.querySelector('.product-display span.onsale') !== null) {
                regularPriceNumber = calculateRegularPrice(regularPrice);

                //we only need to calculate the sale price inside this condition, otherwise it will throw an error in products that are not on sale
                let salePriceNumber;

                if (document.querySelector('form.cart').classList.contains('variations_form')) {
                    regularPriceNumber = calculateRegularPrice(Number(formVariationsJSON[clickedBtnIdx].display_regular_price));

                    salePriceNumber = calculateSalePrice(Number(formVariationsJSON[clickedBtnIdx].display_price));
                } else {
                    salePriceNumber = calculateSalePrice(salePrice);
                }

                //grab sale price html element
                const salePriceContainer = document.querySelector('.redesign-product-price ins .woocommerce-Price-amount bdi');
                //change sale price inner html to reflect new price
                salePriceContainer.innerHTML = `<span class="woocommerce-Price-currencySymbol">$</span>${salePriceNumber}`;

                //grab regular price html element
                regularPriceContainer = document.querySelector('.redesign-product-price .woocommerce-Price-amount bdi');
                //change regular price inner html to reflect new price
                regularPriceContainer.innerHTML = `<span class="woocommerce-Price-currencySymbol">$</span>${regularPriceNumber}`;
            } else {
                //update price value in corresponding html elements
                //grab regular price html element
                regularPriceContainer = document.querySelector('.redesign-product-price .woocommerce-Price-amount bdi');
                //change regular price inner html to reflect new price
                regularPriceContainer.innerHTML = `<span class="woocommerce-Price-currencySymbol">$</span>${regularPriceNumber}`;
            }
        }*/
    }, "500");
})