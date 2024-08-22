document.addEventListener('DOMContentLoaded', () => {
    const cartItemsContainer = document.getElementById('cart-items');
  
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
  
    if (cart.length === 0) {
      cartItemsContainer.innerHTML = '<tr><td colspan="6">Your cart is empty.</td></tr>';
    } else {
      renderCartItems();
    }
  
    function renderCartItems() {
      cartItemsContainer.innerHTML = ''; // Clear existing items
  
      cart.forEach(product => {
        const cartItem = document.createElement('tr');
  
        cartItem.innerHTML = `
          <td><img src="${product.image}" alt="${product.title}"></td>
          <td>${product.title}</td>
          <td>$${product.price.toFixed(2)}</td>
          <td>
            <button class="decrease-btn" data-id="${product.id}">-</button>
            <span class="quantity">${product.quantity}</span>
            <button class="increase-btn" data-id="${product.id}">+</button>
          </td>
          <td class="subtotal">$${(product.price * product.quantity).toFixed(2)}</td>
          <td><button class="remove-btn" data-id="${product.id}">Remove</button></td>
        `;
  
        cartItemsContainer.appendChild(cartItem);
      });
  
      // Add event listeners for the buttons
      document.querySelectorAll('.increase-btn').forEach(button => {
        button.addEventListener('click', increaseQuantity);
      });
  
      document.querySelectorAll('.decrease-btn').forEach(button => {
        button.addEventListener('click', decreaseQuantity);
      });
  
      document.querySelectorAll('.remove-btn').forEach(button => {
        button.addEventListener('click', removeFromCart);
      });
    }
  
    function increaseQuantity(event) {
      const productId = parseInt(event.target.getAttribute('data-id'));
      const product = cart.find(item => item.id === productId);
  
      if (product) {
        product.quantity += 1;
        updateCart();
      }
    }
  
    function decreaseQuantity(event) {
      const productId = parseInt(event.target.getAttribute('data-id'));
      const product = cart.find(item => item.id === productId);
  
      if (product && product.quantity > 1) {
        product.quantity -= 1;
        updateCart();
      }
    }
  
    function updateCart() {
      localStorage.setItem('cart', JSON.stringify(cart));
      renderCartItems();
    }
  
    function removeFromCart(event) {
      const productId = parseInt(event.target.getAttribute('data-id'));
      cart = cart.filter(product => product.id !== productId);
      updateCart();
    }
  });
  