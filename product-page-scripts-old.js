//update product price when variant is selected
window.addEventListener('DOMContentLoaded', () => {

    //declare add to cart variable
    const productAddToCartBtn = document.querySelector('.product-display .single_add_to_cart_button');

    //quantity buttons
    const quantityInputContainer = document.querySelector('.woocommerce div.product form.cart div.quantity, .woocommerce-page div.product form.cart div.quantity');

    const quantityInput = document.querySelector('.et_pb_wc_add_to_cart_0_tb_body .quantity input.qty');

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

    //increase input number
    stepUpButton.addEventListener('click', () => {
        quantityInput.stepUp();
    });

    //decrease input number

    stepDownButton.addEventListener('click', () => {
        quantityInput.stepDown();
    });
    //setTimeout to allow all elements to load that for some reason don't load with DOM
    setTimeout(() => {

        //check if button contains the "unavailable product" class
        if (productAddToCartBtn.classList.contains('wc-variation-is-unavailable')) {
            productAddToCartBtn.innerHTML = 'out of stock';
        }

        //declare sale price of current variant
        const salePrice = document.querySelector('.et_pb_wc_price del span.woocommerce-Price-amount.amount bdi');

        //declare regular price of current variant
        const regularPrice = document.querySelector('.et_pb_wc_price ins span.woocommerce-Price-amount.amount bdi');

        //update regular price and sale price after clicking on a variant
        const variantButtons = document.querySelectorAll('.button-variable-item');

        variantButtons.forEach(button => {
            button.addEventListener('click', function () {
                //setTimeout to allow the variation prices to change
                setTimeout(() => {
                    salePrice.innerHTML = document.querySelector('.woocommerce-variation.single_variation del span.woocommerce-Price-amount.amount bdi').innerHTML;

                    regularPrice.innerHTML = document.querySelector('.woocommerce-variation.single_variation ins span.woocommerce-Price-amount.amount bdi').innerHTML;
                }, "20");
            })
        })
    }, "500");
})

/*window.addEventListener('DOMContentLoaded', () => {
    //setTimeout to allow all elements to load that for some reason don't load with DOM
    setTimeout(() => {
        //quantity input type number
        const quantityInput = document.querySelector('.quantity input.qty');

        //declare quantity input container
        const quantityInputContainer = document.querySelector('.woocommerce div.product form.cart div.quantity');

        //create quantity select buttons
        const stepUpButton = createStepUpBtn();
        const stepDownButton = createStepDownBtn();

        //hold quantity input value in variable 
        //this will be important later
        let inputQtyNumber = Number(quantityInput.value);

        //dynamically disable add to cart button when product is unavailable
        //declare add to cart button
        const productAddToCartBtn = document.querySelector('.product-display .single_add_to_cart_button');
        //check if button contains the "unavailable product" class
        if (productAddToCartBtn.classList.contains('wc-variation-is-unavailable')) {
            productAddToCartBtn.innerHTML = 'out of stock';
        }

        //add discount tooltip to products containing bottle qty variants
        //declare variant buttons
        const variantButtons = document.querySelectorAll('.button-variable-item');

        //create discount variant tooltips - excluding on Amanita and/or Merch products
        if (!item.categories.includes('Amanita Muscaria Gummies') && !item.categories.includes('Merchandise')) {
            if (document.querySelector('form.cart').classList.contains('variations_form')) {
                createDiscount10Tooltip();
            }
            if (variantButtons.length > 2) {
                createDiscount15Tooltip();
            }
        }
      
      //declare sale price container
        const salePrice = document.querySelector('.et_pb_wc_price ins span.woocommerce-Price-amount.amount bdi');

        //variable to store sale price innerText array - on this array we'll find the price and isolate it for the price calculation - it's empty because its value will change depending on what function is running
        if(document.querySelector('.product-display span.onsale') !== null) {
          let variantSalePriceArray = salePrice.innerText.split('$');
        }

        //declare sale price container 
        const regularPrice = document.querySelector('.et_pb_wc_price del span.woocommerce-Price-amount.amount bdi');

        //declare regular price innerText array - on this array we'll find the price and isolate it for the price calculation - it's empty because its value will change depending on what function is running
        let variantRegularPriceArray = regularPrice.innerText.split('$');
      	
        //increase input number, update input value variable and update price according to qty
        stepUpButton.addEventListener('click', () => {
            quantityInput.stepUp();
            //update variable with quantity ammount number - this will be important later
            inputQtyNumber = Number(quantityInput.value);
            updatePrice();
        });

        //decrease input number, update input value variable and update price according to qty
        stepDownButton.addEventListener('click', () => {
            quantityInput.stepDown();
            //update variable with quantity ammount number - this will be important later
            inputQtyNumber = Number(quantityInput.value);
            updatePrice();
        });

        //calculate price of item according to variant and quantity
        variantButtons.forEach(button => {
            button.addEventListener('click', function () {
                //small set timeout to wait for the variant price to change in its hidden container
                setTimeout(() => {
                    updatePrice();
                }, "20");
            })
        });

        //update price if customer types in number instead of using the + - buttons
        quantityInput.addEventListener('change', () => {
            //update input value
            inputQtyNumber = Number(quantityInput.value);
            updatePrice();
        });

        //---------FUNCTIONS-----------

        //functions to create + and - buttons on qty select
        //create + button
        function createStepUpBtn() {
            //create button element
            const stepUpButton = document.createElement('button');
            //create icon element inside button
            const stepUpButtonIcon = document.createElement('i');

            //append button to quantity container
            quantityInputContainer.appendChild(stepUpButton);
            //append icon to button
            stepUpButton.appendChild(stepUpButtonIcon);
            //set button type attribute
            stepUpButton.setAttribute('type', 'button');
            //add font awesome classes to icon
            stepUpButtonIcon.classList.add('fa-solid', 'fa-plus', 'increment-button');

            return stepUpButton;
        }

        //create - button
        function createStepDownBtn() {
            //create button element
            const stepDownButton = document.createElement('button');

            //create icon element inside button
            const stepDownButtonIcon = document.createElement('i');

            //append button to quantity container
            stepDownButton.setAttribute('type', 'button');
            //append icon to button
            quantityInputContainer.prepend(stepDownButton);
            //set button type attribute
            stepDownButton.appendChild(stepDownButtonIcon);
            //add font awesome classes to icon
            stepDownButtonIcon.classList.add('fa-solid', 'fa-minus', 'increment-button');

            return stepDownButton;
        }

        //function to create 10% discount tooltip
        function createDiscount10Tooltip() {
            //pick second variant button
            const variantDiscount10Button = variantButtons[1];
            //create span that will wrap the tooltip
            const variantDiscount10 = document.createElement('span');
            //append this span to the button
            variantDiscount10Button.appendChild(variantDiscount10);
            //add inner text with the discount text
            variantDiscount10.innerText = "save 10%";
            //add class to style the tooltip
            variantDiscount10.classList.add('variation-discount-tooltip');
        }

        //function to create 15% discount tooltip
        function createDiscount15Tooltip() {
            //pick second variant button
            const variantDiscount15Button = variantButtons[2];
            //create span that will wrap the tooltip
            const variantDiscount15 = document.createElement('span');
            //append this span to the button
            variantDiscount15Button.appendChild(variantDiscount15);
            //add inner text with the discount text
            variantDiscount15.innerText = "save 15%";
            //add class to style the tooltip
            variantDiscount15.classList.add('variation-discount-tooltip');
        }

        //function to calculate regular price according to quantity selected
        function calculateRegularPrice() {
            //check if product contains variants
            //if true, split the variation price container's inner text - this element is hidden on the product page
            if (document.querySelector('form.cart').classList.contains('variations_form')) {
              if(document.querySelector('.product-display span.onsale') !== null) {
                variantRegularPriceArray = document.querySelector('.woocommerce-variation-price span.price del span.woocommerce-Price-amount.amount bdi').innerText.split('$');
              } else {
                variantRegularPriceArray = document.querySelector('.woocommerce-variation-price span.price span.woocommerce-Price-amount.amount bdi').innerText.split('$');
              }
            }

            //declare regular price value string to turn into number in update price functions
            const regularPriceValue = variantRegularPriceArray[1];

            //multiply quantity value by regular price and store it in variable
            let regularPriceResult = inputQtyNumber === 1 ? parseFloat(regularPriceValue) : (parseFloat(regularPriceValue) * inputQtyNumber).toFixed(2);
          
                console.log(regularPriceResult);

            return regularPriceResult;
        }

        //function to calculate sale price according to quantity selected 
        function calculateSalePrice() {
            //check if product is on sale
            if (document.querySelector('.product-display span.onsale') !== null) {
                //check if product has variants
                if (document.querySelector('form.cart').classList.contains('variations_form')) {
                    //define the variant price array
                    variantSalePriceArray = document.querySelector('.woocommerce-variation-price span.price ins span.woocommerce-Price-amount.amount bdi').innerText.split('$');
                }

                //declare sale price value string to turn into number in update price functions
                const salePriceValue = variantSalePriceArray[1];

                //multiply quantity value by regular price and store it in variable
                let salePriceResult = inputQtyNumber === 1 ? parseFloat(salePriceValue) : (parseFloat(salePriceValue) * inputQtyNumber).toFixed(2);

                console.log(salePriceResult);
                return salePriceResult;
            }
        }

        function updatePrice() {
                //grab return value from calculateRegularPrice function
            let regularPriceNumber = calculateRegularPrice();
                    	
                if (document.querySelector('form.cart').classList.contains('variations_form')) {
              if (document.querySelector('.product-display span.onsale') !== null) {
              regularPrice.innerHTML = `<span class="woocommerce-Price-currencySymbol">$</span>${regularPriceNumber}`;
                } else {
              document.querySelector('.woocommerce-variation-price span.price span.woocommerce-Price-amount.amount bdi').innerHTML = `<span class="woocommerce-Price-currencySymbol">$</span>${regularPriceNumber}`;
                } 
            } else {
                document.querySelector('.et_pb_wc_price span.woocommerce-Price-amount.amount bdi').innerHTML = `<span class="woocommerce-Price-currencySymbol">$</span>${regularPriceNumber}`;
              }
          
                //grab return value from calculateSalePrice function and update sale price innerHTML only when the product is on sale
                if (document.querySelector('.product-display span.onsale') !== null) {
                let salePriceNumber = calculateSalePrice();
                //update sale price innerHTML
                salePrice.innerHTML = `<span class="woocommerce-Price-currencySymbol">$</span>${salePriceNumber}`;
                }
        }
    }, "500");
})*/
