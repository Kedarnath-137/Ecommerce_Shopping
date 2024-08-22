document.addEventListener('DOMContentLoaded', () => {
    const wishlistContainer = document.getElementById('wishlist-container');
    const apiUrl = 'https://json-server-zno3.onrender.com/products';
  
    // Load wishlist from localStorage
    const wishlist = JSON.parse(localStorage.getItem('wishlist')) || [];
  
    // Display wishlist items
    wishlist.forEach(product => {
      const wishlistItem = document.createElement('tr');
  
      wishlistItem.innerHTML = `
        <td>
          <img src="${product.image}" class="table__img" alt="${product.title}">
        </td>
        <td>
          <h3 class="table__title">${product.title}</h3>
          <p>${product.description}</p>
        </td>
        <td><span class="table__price">$${product.price.toFixed(2)}</span></td>
        <td><span class="table__stock">${product.stock > 0 ? 'In Stock' : 'Out of Stock'}</span></td>
        <td><a href="#" class="btn btn--sm add-to-cart" data-id="${product.id}">Add to Cart</a></td>
        <td><i class="fi fi-rs-trash table trash" data-id="${product.id}"></i></td>
      `;
  
      wishlistContainer.appendChild(wishlistItem);
    });
  
    // Add event listener to remove items from the wishlist
    document.querySelectorAll('.trash').forEach(button => {
      button.addEventListener('click', removeFromWishlist);
    });
  
    // Add event listener to add items from the wishlist to the cart
    document.querySelectorAll('.add-to-cart').forEach(button => {
      button.addEventListener('click', addToCartFromWishlist);
    });
  
    function removeFromWishlist(event) {
      const productId = event.target.getAttribute('data-id');
      const updatedWishlist = wishlist.filter(item => item.id !== productId);
  
      localStorage.setItem('wishlist', JSON.stringify(updatedWishlist));
      event.target.closest('tr').remove();
    }
  
    function addToCartFromWishlist(event) {
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
  });
  