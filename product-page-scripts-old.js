//current code on prod PDP

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