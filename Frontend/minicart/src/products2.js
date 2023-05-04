

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


  addToCart: function (productId) {
    if (Products.cartData.hasOwnProperty(productId)) {
      Products.cartData[productId]['qty']++;
    } else {
      const product = Products.getProductById(productId);
      Products.cartData[productId] = {
        name: product.name,
        price: product.price,
        qty: 1
      };
    }

    Products.saveCart();
    Products.updateCart();
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
  }
  ,

  updateCart: function () {
    let cartTotal = 0;
    let cartItems = '';

    for (const productId in Products.cartData) {
      if (Products.cartData.hasOwnProperty(productId)) {
        const productName = Products.cartData[productId]['name'];
        const productPrice = Products.cartData[productId]['price'];
        const productQty = Products.cartData[productId]['qty'];
        const productImage = Products.getProductImage(productId);
        const subtotal = productPrice * productQty;

        // Add event listener to input field
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
              <span class="cart-item-qty-value" data-id="${productId}">${productQty}</span>
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

    // Add event listeners to the buttons
    $('.cart-items').on('click', '.change-quantity', function () {
      const productId = $(this).data('id');
      const currentQty = Products.cartData[productId]['qty'];
      const productPrice = Products.cartData[productId]['price'];
      let newProductQty;

      if ($(this).hasClass('plus')) {
        newProductQty = currentQty + 1;
      } else {
        newProductQty = currentQty - 1;
      }

      if (newProductQty < 1) {
        Products.removeFromCart(productId);
      } else {
        Products.updateCart(productId, newProductQty);
        $('.cart-item-qty-value[data-id=' + productId + ']').html(newProductQty);

        const newSubtotal = productPrice * newProductQty;
        $('.cart-item-subtotal[data-id=' + productId + ']').html('$' + newSubtotal.toFixed(2));

        let cartTotal = 0;
        for (const productId in Products.cartData) {
          if (Products.cartData.hasOwnProperty(productId)) {
            const productPrice = Products.cartData[productId]['price'];
            const productQty = Products.cartData[productId]['qty'];
            const subtotal = productPrice * productQty;
            cartTotal += subtotal;
          }
        }
        $('.cart-total').html(`$${cartTotal.toFixed(2)}`);
      }
      Products.updateCartIcon();
    });
  },

  removeFromCart: function (productId) {
    delete Products.cartData[productId];
    Products.saveCart();
    Products.updateCart();
  }
  ,

  updateCartQty: function (event) {
    event.preventDefault();
    const productId = $(this).data('id');
    const productQty = parseFloat($(this).val());
    Products.cartData[productId]['qty'] = productQty;
    Products.saveCart();
    Products.updateCart();
  },

  saveCart: function () {
    localStorage.setItem('cartData', JSON.stringify(Products.cartData));
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