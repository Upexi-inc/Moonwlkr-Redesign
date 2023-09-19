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

        variantButtons.forEach(button => {
            button.addEventListener('click', function () {
                let clickedBtnIdx = Array.from(variantButtons).indexOf(button);

                const variantionFormContainer = document.querySelector('form.variations_form');

                const formVariationsJSON = JSON.parse(variantionFormContainer.dataset.product_variations);

                regularPrice = Number(formVariationsJSON[clickedBtnIdx].display_regular_price);

                salePrice = Number(formVariationsJSON[clickedBtnIdx].display_price);

                let variantRegularPrice = regularPrice * inputQtyNumber;
                let variantSalePrice = salePrice * inputQtyNumber;

                document.querySelector('.redesign-product-price del .woocommerce-Price-amount bdi').innerHTML = `<span class="woocommerce-Price-currencySymbol">$</span>${variantRegularPrice}`

                document.querySelector('.redesign-product-price ins .woocommerce-Price-amount bdi').innerHTML = `<span class="woocommerce-Price-currencySymbol">$</span>${variantSalePrice}`
            });
        });

        //FUNCTIONS

        //calculate price functions
        //calculate regular price
        function calculateRegularPrice() {
            //declare variable to hold the result of this calculation
            let regularPriceResult;

            //check to see if item is on sale - this is important as it will determine where we'll get the regular price value
            if (document.querySelector('.product-display span.onsale') !== null) {
                //store calculation in variable - sale price x quantity
                //if it's on sale, it will grab the already declared regularPrice variable value
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
        function calculateSalePrice() {
            //store calculation in variable - sale price x quantity
            let salePriceResult = inputQtyNumber * salePrice;
            //return calculation result to be used in other functions
            return salePriceResult;
        }

        //function to update price
        function updatePrice() {
            //declare regularPriceContainer with no value as of yet. this is because if the product is not on sale, there will be no distinction between regular and sale prices HTML elements - so no <del> or <ins> elements
            let regularPriceContainer;

            //update regular price first as product may not be on sale
            let regularPriceNumber = calculateRegularPrice();

            //check to see if item is on sale - this means that the price HTML elements will be different <del> and <ins>
            if (document.querySelector('.product-display span.onsale') !== null) {
                //we only need to calculate the sale price inside this condition, otherwise it will throw an error in products that are not on sale
                let salePriceNumber = calculateSalePrice();

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
        }


    }, "500");
})