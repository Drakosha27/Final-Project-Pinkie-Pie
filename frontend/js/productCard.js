function createProductCard(product){
  const div = document.createElement("div");
  div.classList.add("product-card");
  div.innerHTML = `
    <h3>${product.name}</h3>
    <p>${product.description}</p>
    <p>Category: ${product.category || 'Dessert'}</p>
    <p>Price: ${product.price} KZT</p>
    <button onclick="orderProduct('${product._id}')">Order Now</button>
  `;
  return div;
}

async function loadProducts(){
  const res = await fetch("http://localhost:5000/api/products");
  const products = await res.json();
  const menuContainer = document.getElementById("menuContainer");
  menuContainer.innerHTML = "";
  products.forEach(p=>{
    menuContainer.appendChild(createProductCard(p));
  });
}
loadProducts();

async function orderProduct(productId){
  const token = localStorage.getItem("token");
  if(!token){ alert("Please login first!"); window.location.href="login.html"; return; }
  await fetch("http://localhost:5000/api/orders",{
    method:"POST",
    headers:{
      "Content-Type":"application/json",
      "Authorization": `Bearer ${token}`
    },
    body: JSON.stringify({products:[productId], totalPrice: 1000})
  });
  alert("Order placed successfully! 💗");
}


search.addEventListener('input', filterProducts);
price.addEventListener('input', filterProducts);

function filterProducts() {
  const name = search.value.toLowerCase();
  const maxPrice = price.value;

  document.querySelectorAll('.product-card').forEach(card => {
    const title = card.querySelector('h3').innerText.toLowerCase();
    const priceText = card.querySelector('.price').innerText.replace('$','');

    const match =
      title.includes(name) &&
      (!maxPrice || +priceText <= +maxPrice);

    card.style.display = match ? 'block' : 'none';
  });
}
