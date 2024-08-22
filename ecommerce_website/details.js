document.addEventListener('DOMContentLoaded', () => {
    const apiUrl = 'https://json-server-zno3.onrender.com/products';
    const urlParams = new URLSearchParams(window.location.search);
    const productId = urlParams.get('id');
    
    if (productId) {
      fetch(`${apiUrl}/${productId}`)
        .then(response => response.json())
        .then(product => {
          const detailsContainer = document.querySelector('.details__container');
  
          if (product) {
            // Render product details
            detailsContainer.innerHTML = `
              <div class="details__group">
                <img src="${product.image}" alt="${product.title}" class="details__img" />
                <div class="details__small-images grid">
                  <img src="${product.image}" alt="${product.title}" class="details__small-img" />
                  <!-- Add more small images if available -->
                </div>
              </div>
  
              <div class="details__group">
                <h3 class="details__title">${product.title}</h3>
                <p class="details__brand">Brands: <span>${product.brand}</span></p>
  
                <div class="details__price flex">
                  <span class="new__price">$${product.price.toFixed(2)}</span>
                  ${product.oldPrice ? `<span class="old__price">$${product.oldPrice.toFixed(2)}</span>` : ''}
                  ${product.oldPrice ? `<span class="save__price">${Math.round((1 - product.price / product.oldPrice) * 100)}% off</span>` : ''}
                </div>
  
                <p class="short__description">${product.description}</p>
  
                <ul class="product__list">
                  <li class="list__item flex"><i class="fi-rs-crown"></i> 1 year warranty</li>
                  <li class="list__item flex"><i class="fi-rs-refresh"></i> 30 Day Return policy</li>
                  <li class="list__item flex"><i class="fi-rs-credit-card"></i> Cash on Delivery available</li>
                </ul>
  
                <div class="details__size flex">
                  <span class="details__color-title">Color</span>
                  <ul class="color__list">
                    <!-- Add color options if available -->
                  </ul>
                </div>
  
                <div class="details__color flex">
                  <span class="details__size-title">Size</span>
                  <ul class="size__list">
                    <!-- Add size options if available -->
                  </ul>
                </div>
  
                <div class="details__action">
                  <input type="number" class="quantity" value="1" min="1" />
                  <a href="#" class="btn btn--sm add-to-cart" data-id="${product.id}">Add to Cart</a>
                  <a href="#" class="details__action-btn add-to-wishlist" data-id="${product.id}">
                    <i class="fi fi-rs-heart"></i>
                  </a>
                </div>
  
                <ul class="details__meta">
                  <li class="meta__list flex"><span>SKU:</span>${product.sku || 'N/A'}</li>
                  <li class="meta__list flex"><span>Tags:</span>${product.tags || 'N/A'}</li>
                  <li class="meta__list flex"><span>Availability:</span>${product.stock > 0 ? `${product.stock} Items In Stock` : 'Out of Stock'}</li>
                </ul>
              </div>
            `;
  
            // Add event listeners for Add to Cart and Add to Wishlist buttons
            document.querySelector('.add-to-cart').addEventListener('click', addToCart);
            document.querySelector('.add-to-wishlist').addEventListener('click', addToWishlist);
          } else {
            detailsContainer.innerHTML = '<p>Product not found</p>';
          }
        })
        .catch(error => console.error('Error fetching product:', error));
    } else {
      document.querySelector('.details__container').innerHTML = '<p>No product ID found in URL</p>';
    }
  
    function addToCart(event) {
      event.preventDefault(); // Prevent default link behavior
      const productId = event.target.getAttribute('data-id');
  
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
  
    function addToWishlist(event) {
      event.preventDefault(); // Prevent default link behavior
      const productId = event.target.getAttribute('data-id');
  
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
  });
  