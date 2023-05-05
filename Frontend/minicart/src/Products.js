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
        const $product = $(this).parents('.product-container');
        const productId = $product.data('id');
        const productImg = $product.find('img').attr('src');
        const productName = $product.find('h6').text();
        const productPrice = parseFloat($product.data('price'));
        let productQty = parseFloat($product.find('.qty-input').val());

        if (!productQty || productQty <= 0) {
            productQty = 1;
        }

        if (Products.cartData.hasOwnProperty(productId)) {
            Products.cartData[productId]['qty'] += productQty;
        } else {
            Products.cartData[productId] = {
                'name': productName,
                'price': productPrice,
                'qty': productQty,
                'img': productImg
            };
        }

        Products.updateCart();
    },

    updateCart: function (productId, newQty) {
        let cartTotal = 0;
        let cartItems = '';

        for (const productId in Products.cartData) {
            if (Products.cartData.hasOwnProperty(productId)) {
                const productName = Products.cartData[productId]['name'];
                const productPrice = Products.cartData[productId]['price'];
                const productQty = Products.cartData[productId]['qty'];
                console.log(Products.cartData[productId]);
                const productImage = Products.cartData[productId]['img'];
                const subtotal = productPrice * productQty;
                const minusButton = `<button class="change-quantity minus" data-id="${productId}">-</button>`;
                const plusButton = `<button class="change-quantity plus" data-id="${productId}">+</button>`;

                if (productQty === 0) {
                    Products.removeFromCart(productId);
                } else {
                    // creating-adding a cart-item and updating the cart-items
                    cartItems += `<div class="cart-item">
                    <div class="cart-item-details">
                        <div class="cart-item-details-img">
                            <img class="cart-item-image" src="${productImage}" alt="Product Id:${productId}, ">
                        </div>
                        <div class="cart-item-details-rest">
                            <div class="cart-item-details-nameprice">
                                <span class="cart-item-name">${productName.substring(0, 20) + '...'}</span></br>
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
                    cartTotal += subtotal;
                    $('.minicart-empty').css('display', 'none');
                }
            }
        }
        // Update the cart items and total on the page
        $('.cart-items').html(cartItems);
        $('.cart-total').html(`Total: $${cartTotal.toFixed(2)}`);

    },

    // Add event listeners for the plus and minus buttons
    $('.cart-items').on('click', '.change-quantity', function () {
        const productId = $(this).data('id');
        const currentQty = Products.cartData[productId]['qty'];
        let newQty;

        if ($(this).hasClass('plus')) {
            newQty = currentQty + 1;
        } else {
            newQty = currentQty - 1;
        }

        Products.updateCart(productId, newQty);
    });
};

$(Products.init); 