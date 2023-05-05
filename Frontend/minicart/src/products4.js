

function getProductById(id) {
    let product = null;
    $.ajax({
        'async': false,
        'global': false,
        'url': 'data.json',
        'dataType': 'json',
        'success': function (data) {
            $.each(data, function (key, row) {
                if (row.id == id) {
                    product = row;
                }
            });
        }
    });
    return product;
}
var Products = {
    cartData: {},


    init: function () {
        Products.loadProducts();
        Products.loadCart();
        $('.minicart').click(function (e) {
            e.stopPropagation();
        });
        $(document).on('click', '.remove-item', Products.removeFromCart);
        $(document).on('change', '.cart-item-qty-input', Products.updateCartQty);
    },

    loadProducts: function () {
        let product;

        $.get('data.json', function (data) {
            $.each(data, function (key, row) {
                product = $('.product-container.d-none').clone();
                product.data('price', row.price);
                product.data('id', row.id);
                product.find('img').attr('src', row.image_link);
                product.find('h6').html(row.name);
                product.find('p').html('$ ' + row.price);
                product.find('button').click(Products.addToCart);
                product.toggleClass('d-none').appendTo('.products-container');
            });
        });
    },

    addToCart: function (event) {
        event.preventDefault();
        const product = $(this).parents('.product-container');
        const productId = product.data('id');
        const productName = product.find('h6').text();
        const productPrice = parseFloat(product.data('price'));
        let productQty = parseFloat(product.find('.qty-input').val());

        if (!productQty || productQty <= 0) {
            productQty = 1;
        }

        if (Products.cartData.hasOwnProperty(productId)) {
            Products.cartData[productId]['qty'] += productQty;
        } else {
            Products.cartData[productId] = {
                'name': productName,
                'price': productPrice,
                'qty': productQty
            };
        }
        console.log(Products.cartData)

        Products.saveCart();
        Products.updateCart();
    },
    saveCart: function () {
        localStorage.setItem('cartData', JSON.stringify(Products.cartData));
        console.log(JSON.stringify(this.cartData));
    },

    getProductById: function (id) {
        let product = null;
        $.ajax({
            'async': false,
            'global': false,
            'url': 'data.json',
            'dataType': 'json',
            'success': function (data) {
                $.each(data, function (key, row) {
                    if (row.id == id) {
                        product = row;
                    }
                });
            }
        });
        return product;
    },

    getProductImage: function (productId) {
        const product = Products.getProductById(productId);
        return product ? product.image_link : '';
    },
    updateCartIcon: function () {
        let totalItems = 0;
        for (const productId in Products.cartData) {
            if (Products.cartData.hasOwnProperty(productId)) {
                totalItems += Products.cartData[productId].qty;
            }
        }
        $('.cart-icon .item-count').text(totalItems);
    },

    updateCart: function () {
        let cartTotal = 0;
        let cartItems = '';

        for (const productId in Products.cartData) {
            if (Products.cartData.hasOwnProperty(productId)) {
                const productName = Products.cartData[productId]['name'];
                const productPrice = Products.cartData[productId]['price'];
                const productQty = Products.cartData[productId]['qty'];
                const productImage = Products.getProductImage(productId);
                // const productThumbnail = Products.getProductThumbnail(productId);
                const subtotal = productPrice * productQty;

                // Create the +/- buttons
                const minusButton = `<button class="change-quantity minus" data-id="${productId}">-</button>`;
                const plusButton = `<button class="change-quantity plus" data-id="${productId}">+</button>`;

                // If the quantity is 0, remove the item
                if (productQty === 0) {
                    Products.removeFromCart(productId);
                } else {
                    cartItems += `<div class="cart-item">
                          <div class="cart-item-details">
                            <img class="cart-item-image" src="${productImage}" alt="${productName}">
                            <span class="cart-item-name">${productName}</span>
                            <span class="cart-item-price">$${productPrice.toFixed(2)}</span>
                          </div>
                          <div class="cart-item-qty">
                            ${minusButton}
                            <input type="number" class="cart-item-qty-input" value="${productQty}" data-id="${productId}" />
                            ${plusButton}
                          </div>
                          <div class="cart-item-subtotal">$${subtotal.toFixed(2)}</div>
                        </div>`;
                    cartTotal += subtotal;
                }
            }
        }

        // Update the HTML content of the cart
        $('.cart-items').html(cartItems);
        $('.cart-total').html(`$${cartTotal.toFixed(2)}`);
        // Add event listener to +/- buttons
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
    },

    // updateCart: function () {
    //   let cartTotal = 0;
    //   let cartItems = '';

    //   for (const productId in Products.cartData) {
    //     if (Products.cartData.hasOwnProperty(productId)) {
    //       const productName = Products.cartData[productId]['name'];
    //       const productPrice = Products.cartData[productId]['price'];
    //       const productQty = Products.cartData[productId]['qty'];
    //       const productImage = Products.getProductImage(productId);
    //       // const productThumbnail = Products.getProductThumbnail(productId);
    //       const subtotal = productPrice * productQty;

    //       cartItems += `<div class="cart-item">
    //                       <div class="cart-item-details">
    //                         <img class="cart-item-image" src="${productImage}" alt="${productName}">
    //                         <span class="cart-item-name">${productName}</span>
    //                         <span class="cart-item-price">$${productPrice.toFixed(2)}</span>
    //                       </div>
    //                       <div class="cart-item-qty">
    //                         <input type="number" class="cart-item-qty-input" value="${productQty}" data-id="${productId}" />
    //                       </div>
    //                       <div class="cart-item-subtotal">$${subtotal.toFixed(2)}</div>
    //                       <div class="cart-item-remove"><button class="remove-item" data-id="${productId}">Remove</button></div>
    //                     </div>`;
    //       cartTotal += subtotal;
    //     }
    //   }

    //   cartItems += `<div class="cart-summary">
    //                   <div class="cart-summary-total">
    //                     <span>Total:</span>
    //                     <span class="cart-total">$${cartTotal.toFixed(2)}</span>
    //                   </div>
    //                   <div class="cart-summary-checkout">
    //                     <button class="btn btn-primary btn-block">Checkout</button>
    //                   </div>
    //                 </div>`;
    //   $('.cart-items').html(cartItems);

    //   $('.cart-total').html('$' + cartTotal.toFixed(2));
    //   $('.cart-items').on('click', '.remove-item', Products.removeFromCart);
    // },

    removeFromCart: function (productId) {
        delete Products.cartData[productId];
        Products.saveCart();
        Products.updateCart();
    }
    ,
    // removeFromCart: function (event) {

    //   const productId = $(this).data('id');
    //   delete Products.cartData[productId];
    //   Products.saveCart();
    //   Products.updateCart();
    // },

    updateCartQty: function (event) {
        event.preventDefault();
        const productId = $(this).data('id');
        const productQty = parseFloat($(this).val());
        Products.cartData[productId]['qty'] = productQty;
        Products.saveCart();
        Products.updateCart();
    },



    loadCart: function () {
        const cartData = localStorage.getItem('cartData');
        if (cartData) {
            Products.cartData = JSON.parse(cartData);
            Products.updateCart();
        }
    }

}

$(Products.init);