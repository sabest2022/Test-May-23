var Products = {
    cartData: {},

    init() {
        Products.loadProducts();
        $('.minicart').click(function (e) {
            e.stopPropagation();
        });
    },

    loadProducts() {
        // 'http://makeup-api.herokuapp.com/api/v1/products.json?brand=maybelline'
        $.getJSON('data.json', function (products) {
            products.forEach(function (product) {
                const $product = $('.product-container.d-none').clone();
                $product.data('price', product.price);
                $product.data('id', product.id);
                $product.find('img').attr('src', product.image_link);
                $product.find('h6').html(product.name);
                $product.find('p').html('$ ' + product.price);
                $product.find('button').click(Products.addToCart);
                $product.toggleClass('d-none').appendTo('.products-container');
            });
        });
    },

    addToCart: function (event) {
        event.preventDefault();
        // get product information from the clicked element
        const $product = $(this).parents('.product-container');
        const productId = $product.data('id');
        const productImg = $product.find('img').attr('src');
        const productName = $product.find('h6').text();
        const productPrice = parseFloat($product.data('price'));
        let productQty = parseFloat($product.find('.qty-input').val());
        // check if quantity is valid, set default to 1 if invalid
        if (!productQty || productQty <= 0) {
            productQty = 1;
        }
        // check if product is already in the cart, add to quantity if it is
        if (Products.cartData.hasOwnProperty(productId)) {
            Products.cartData[productId]['qty'] += productQty;
        } else {
            // add new product to cartData object
            Products.cartData[productId] = {
                'name': productName,
                'price': productPrice,
                'qty': productQty,
                'img': productImg,
            };
        }
        // update the cart display
        Products.updateCart();
    },
    changeQuantity: function (productId, action) {
        // Check if the product exists in the cart
        if (Products.cartData.hasOwnProperty(productId)) {
            // Get the current quantity of the product
            const currentQty = Products.cartData[productId]['qty'];
            let newQty = 0;
            // Determine the new quantity based on the action
            if (action === 'add') {
                newQty = currentQty + 1;
            } else if (action === 'subtract') {
                newQty = currentQty - 1;
            }
            // Update the cart data with the new quantity
            Products.cartData[productId]['qty'] = newQty;
            // Update the cart on the page
            Products.updateCart();
        }
    },
    removeFromCart: function (productId) {
        // Remove the product from the cart data
        delete Products.cartData[productId];
        // If the cart is now empty, show the empty cart message
        if ($.isEmptyObject(Products.cartData)) {
            $('.minicart-empty').css('display', 'block');
        }
        // Update the cart on the page
        Products.updateCart();
    },

    updateCart: function (productId, newQty) {
        // Initialize variables
        let cartTotal = 0;
        let cartItems = '';
        // Loop through all products in cartData
        for (const productId in Products.cartData) {
            if (Products.cartData.hasOwnProperty(productId)) {
                // Get product information
                const productName = Products.cartData[productId]['name'];
                const productPrice = Products.cartData[productId]['price'];
                const productQty = Products.cartData[productId]['qty'];
                const productImage = Products.cartData[productId]['img'];
                const subtotal = productPrice * productQty;
                // Create buttons to change product quantity
                const minusButton = `<button class="change-quantity minus" data-id="${productId}">-</button>`;
                const plusButton = `<button class="change-quantity plus" data-id="${productId}">+</button>`;

                // If product quantity is 0, remove it from the cart
                if (productQty === 0) {
                    Products.removeFromCart(productId);
                } else {
                    // Create a new cart item and add it to the cart items list
                    cartItems += `<div class="cart-item">
                    <div class="cart-item-details">
                        <div class="cart-item-details-img">
                            <img class="cart-item-image" src="${productImage}" alt="Product Id:${productId}, ">
                        </div>
                        <div class="cart-item-details-rest">
                            <div class="cart-item-details-nameprice">
                                <span cla ss="cart-item-name"> $ ${productName.substring(0, 20) + '...'}</span></br>
                            </div>
                            <div class="cart-item-rest">
                                 <div class="cart-item-qty">
                                ${minusButton}
                                <span class="cart-item-qty-value" data-id="${productId}">${productQty}</span>
                                ${plusButton}
                                </div>
                                <div class="cart-item-subtotal">$${subtotal.toFixed(2)}</div>
                            </div>
                        </div>
                    </div>
                    </div>`;
                    // Update cart total and hide "empty cart" message if necessary
                    cartTotal += subtotal;
                    $('.minicart-empty').css('display', 'none');
                }
            }

            // Update the cart items and total on the page
            $('.cart-items').html(cartItems);
            $('.cart-total').html(`Total: $${cartTotal.toFixed(2)}`);

            // Add event listeners to plus and minus buttons
            $('.change-quantity.plus').off().on('click', function () {
                const productId = $(this).data('id');
                Products.changeQuantity(productId, 'add');
            });

            $('.change-quantity.minus').off().on('click', function () {
                const productId = $(this).data('id');
                Products.changeQuantity(productId, 'subtract');
            });
        }
    },

}

$(Products.init);
