document.addEventListener('DOMContentLoaded', () => {
  const productsContainer = document.getElementById('products-container');
  const apiUrl = 'https://json-server-zno3.onrender.com/products';

  // Fetch products from the API
  fetch(apiUrl)
    .then(response => response.json())
    .then(products => {
      products.forEach(product => {
        const productItem = document.createElement('div');
        productItem.classList.add('products__item');

        productItem.innerHTML = `
          <div class="product__banner">
            <a href="details.html?id=${product.id}" class="product__images">
              <img
                src="${product.image}"
                alt="${product.title}"
                class="product__img default"
              />
            </a>

            <div class="product__action">
              <a href="#" class="action__btn add-to-wishlist" aria-label="Add To Wishlist" data-id="${product.id}">
                <i class="fi fi-rs-heart"></i>
              </a>
            </div>
            ${product.offer ? `<div class="product__badge light-pink">${product.offer}</div>` : ''}
          </div>

          <div class="product__content">
            <span class="product__category">${product.brand}</span>
            <a href="details.html?id=${product.id}">
              <h3 class="product__title">${product.title}</h3>
            </a>
            <div class="product__rating">
              ${generateStars(product.rating)}
            </div>
            <div class="product__price flex">
              <span class="new__price">$${product.price.toFixed(2)}</span>
              ${product.oldPrice ? `<span class="old__price">$${product.oldPrice.toFixed(2)}</span>` : ''}
            </div>
            <a href="#" class="action__btn cart__btn" aria-label="Add To Cart" data-id="${product.id}">
              <i class="fi fi-rs-shopping-bag-add"></i> Add to cart
            </a>
          </div>
        `;

        productsContainer.appendChild(productItem);
      });

      // Add event listeners to the "Add to Wishlist" buttons
      document.querySelectorAll('.add-to-wishlist').forEach(button => {
        button.addEventListener('click', addToWishlist);
      });

      // Add event listeners to the "Add to Cart" buttons
      document.querySelectorAll('.cart__btn').forEach(button => {
        button.addEventListener('click', addToCart);
      });
    })
    .catch(error => console.error('Error fetching products:', error));

  function generateStars(rating) {
    const fullStar = '<i class="fi fi-rs-star"></i>';
    const emptyStar = '<i class="fi fi-rs-star-empty"></i>';
    return fullStar.repeat(Math.floor(rating)) + emptyStar.repeat(5 - Math.floor(rating));
  }

  function addToWishlist(event) {
    event.preventDefault(); // Prevent default link behavior
    const productId = event.target.closest('a').getAttribute('data-id');

    fetch(`${apiUrl}/${productId}`)
      .then(response => response.json())
      .then(product => {
        let wishlist = JSON.parse(localStorage.getItem('wishlist')) || [];
        let existingProduct = wishlist.find(item => item.id === product.id);

        if (!existingProduct) {
          wishlist.push(product);
          localStorage.setItem('wishlist', JSON.stringify(wishlist));
          alert('Product added to wishlist!');
        } else {
          alert('Product is already in the wishlist.');
        }
      })
      .catch(error => console.error('Error adding product to wishlist:', error));
  }

  function addToCart(event) {
    event.preventDefault(); // Prevent default link behavior
    const productId = event.target.closest('a').getAttribute('data-id');

    fetch(`${apiUrl}/${productId}`)
      .then(response => response.json())
      .then(product => {
        let cart = JSON.parse(localStorage.getItem('cart')) || [];
        let existingProduct = cart.find(item => item.id === product.id);

        if (existingProduct) {
          existingProduct.quantity += 1;
        } else {
          product.quantity = 1;
          cart.push(product);
        }

        localStorage.setItem('cart', JSON.stringify(cart));
        alert('Product added to cart!');
      })
      .catch(error => console.error('Error adding product to cart:', error));
  }
});
