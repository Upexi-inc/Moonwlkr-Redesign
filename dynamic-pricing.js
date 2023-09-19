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


        //FUNCTIONS

        //calculate price functions
        //calculate sale price
        function calculateSalePrice() {
            //store calculation in variable - sale price x quantity
            let salePriceResult = inputQtyNumber * salePrice;
            //return calculation result to be used in other functions
            return salePriceResult;
        }

        //calculate regular price
        function calculateRegularPrice() {
            //store calculation in variable - sale price x quantity
            let regularPriceResult = inputQtyNumber * regularPrice;
            //return calculation result to be used in other functions
            return regularPriceResult;
        }

        //function to update price
        function updatePrice() {
            //store calculation results in respective price variables
            let regularPriceNumber = calculateRegularPrice();
            let salePriceNumber = calculateSalePrice();

            //update price value in corresponding html elements
            //grab regular price html element
            let regularPriceContainer = document.querySelector('.redesign-product-price del .woocommerce-Price-amount bdi');
            //change regular price inner html to reflect new price
            regularPriceContainer.innerHTML = `<span class="woocommerce-Price-currencySymbol">$</span>${regularPriceNumber}`;

            //grab sale price html element
            const salePriceContainer = document.querySelector('.redesign-product-price ins .woocommerce-Price-amount bdi');
            //change sale price inner html to reflect new price
            salePriceContainer.innerHTML = `<span class="woocommerce-Price-currencySymbol">$</span>${salePriceNumber}`;
        }


    }, "500");
})