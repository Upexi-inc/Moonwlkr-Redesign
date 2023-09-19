window.addEventListener('DOMContentLoaded', () => {
    //setTimeout to allow all elements to load that for some reason don't load with DOM
    setTimeout(() => {

        //declare add to cart button element
        const productAddToCartBtn = document.querySelector('.product-display .single_add_to_cart_button');

        //quantity input container
        const quantityInputContainer = document.querySelector('.woocommerce div.product form.cart div.quantity, .woocommerce-page div.product form.cart div.quantity');

        //quantity input element
        const quantityInput = document.querySelector('.et_pb_wc_add_to_cart_0_tb_body .quantity input.qty');

        //hold quantity input value in a variable 
        //at page load this number will be 1, but we'll update its value every time the user clicks + or - or writes a number on the input
        let inputQtyNumber = Number(quantityInput.value);

        //create + button
        const stepUpButton = document.createElement('button');
        const stepUpButtonIcon = document.createElement('i');

        stepUpButton.setAttribute('type', 'button');
        quantityInputContainer.appendChild(stepUpButton);
        stepUpButton.appendChild(stepUpButtonIcon);
        stepUpButtonIcon.classList.add('fa-solid', 'fa-plus', 'increment-button');

        //create - button
        const stepDownButton = document.createElement('button');

        const stepDownButtonIcon = document.createElement('i');

        stepDownButton.setAttribute('type', 'button');
        quantityInputContainer.prepend(stepDownButton);
        stepDownButton.appendChild(stepDownButtonIcon);
        stepDownButtonIcon.classList.add('fa-solid', 'fa-minus', 'increment-button');

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

        //grab all variation buttons under one variable
        //we'll use this to do a for each click event listener in order to change the price according to variation selected
        const variationButtons = document.querySelectorAll('.button-variable-item');

        //grab variation form that contains variation prices
        const variantionFormContainer = document.querySelector('form.variations_form');

        //grab product variations from the variation form json
        //this contains the display_price (price on sale) and display_regular_price (regular price) values required to calculate the price of the product
        const formVariationsJSON = JSON.parse(variantionFormContainer.dataset.product_variations);

        //variable to hold the clicked variation button index number
        //currently at 0 because that's the index of the default variation on page load
        let clickedBtnIdx = 0;

        //check if button contains the "unavailable product" class
        if (productAddToCartBtn.classList.contains('wc-variation-is-unavailable')) {
            //if true change the inner html
            productAddToCartBtn.innerHTML = 'out of stock';
        }

        //increase input number
        stepUpButton.addEventListener('click', () => {
            //increase quantity by 1
            quantityInput.stepUp();
            //update quantity number value
            inputQtyNumber = Number(quantityInput.value);
            //run the price function to get the new variation prices
            price();
            //run the updatePriceElements function to change price values on their respective html elements
            updatePriceElements();
        });

        //decrease input number
        stepDownButton.addEventListener('click', () => {
            //decrease quantity by 1
            quantityInput.stepDown();
            //update quantity number value
            inputQtyNumber = Number(quantityInput.value);
            //run the price function to get the new variation prices
            price();
            //run the updatePriceElements function to change price values on their respective html elements
            updatePriceElements();
        });

        //update price if customer types in number instead of using the + - buttons
        quantityInput.addEventListener('change', () => {
            //update input value
            inputQtyNumber = Number(quantityInput.value);
            //run the price function to get the new variation prices
            price();
            //run the updatePriceElements function to change price values on their respective html elements
            updatePriceElements();
        });

        //Go through each variation buttons
        variationButtons.forEach(button => {
            button.addEventListener('click', function () {
                //assign new clicked button index value 
                clickedBtnIdx = Array.from(variationButtons).indexOf(button);
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
    }, "500");
});