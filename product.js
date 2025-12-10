// Product data with images
const products = [
  {
    id: 1,
    name: "Blue Tigers Tote",
    price: "$45.00",
    image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRBUMHcMoZTQdJTMFsx3Eot-n2QUuTSHnwrhQ&s",
    badge: "Top Sellers"
  },
  {
    id: 2,
    name: "Swimmers Tote",
    price: "$52.00",
    image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTGvELMo_EJNk17XYVBvQcJNVzsOXRohaJa7w&s",
    badge: "Top Sellers"
  },
  {
    id: 3,
    name: "Orange Abstract Tote",
    price: "$48.00",
    image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcREIImfNxiT0I215nC_AOc3nN5TBl1PZE1MNw&s",
    badge: "Top Sellers"
  },
  {
    id: 4,
    name: "Swimmers Tote",
    price: "$48.00",
    image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR5KrfGIFQuRERcdEtvkCt7Qzl8Bq2UXPVZag&s",
    badge: "Top Sellers"
  },
  {
    id: 5,
    name: "Orange Abstract Tote",
    price: "$48.00",
    image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSKYr5sRu18WmwoNYa2DPrGuggrbp1N7iX9MQ&s",
    badge: "Top Sellers"
  },
  {
    id: 6,
    name: "Blue Tigers Tote",
    price: "$48.00",
    image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQxfXBNR7jrPf_EhPRfbFHwwpcjOnDi2Sw32g&s",
    badge: "Top Sellers"
  },
  {
    id: 7,
    name: "",
    price: "$67.00",
    image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS7pSa3KZRwVaRX-7fmSr8oeudjarsJN3km8w&s",
    badge: "Top Sellers"
  },
  {
    id: 8,
    name: "",
    price: "$15.00",
    image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRjo02ccTEDScHFsiEC3uMrRB8WC_Mj6fPe4w&s",
    badge: "Top Sellers",
  },
  {
    id: 9,
    name: "",
    price: "$48.00",
    image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRIQKR7AebnYXbBI7qHT3RF_KHNONdae52A9g&s",
     badge: "Top Sellers",
  },
  {
    id: 10,
    name: "Orange Abstract Tote",
    price: "$15.00",
    image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRi7MKwxVLNfMjyb-BNmkYjaKlkD7gUxZogDA&s",
    badge: "Top Sellers"
  },
   {
    id: 11,
    name: "Orange Abstract Tote",
    price: "$15.00",
    image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRF8S0KlKdzd_tVy9bcY_bGUD4vvLbQ1Ls3Iw&s",
    badge: "Top Sellers"
  },
  {
    id: 12,
    name: "Orange Abstract Tote",
    price: "$15.00",
    image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSzqsfMY4hMGDuymbOKx3CYjnODagQ9qClhRg&s",
    badge: "Top Sellers"
  },
];

// Function to render products
function renderProducts() {
  const productContainer = document.querySelector('.products');
  
  // Clear existing content
  productContainer.innerHTML = '';
  
  // Create and append product cards
  products.forEach((product, idx) => {
    const productCard = document.createElement('article');
    productCard.className = 'product';
    
    productCard.innerHTML = `
      <span class="badge">${product.badge}</span>
      <div class="img-wrap">
        <img src="${product.image}" alt="${product.name}" class="product-image" data-id="${product.id}" data-index="${idx}" />
      </div>
      <h3 class="title">${product.name}</h3>
      <p class="price">${product.price}</p>
    `;
    
    productContainer.appendChild(productCard);
  });

  // Add click handlers to product images
  document.querySelectorAll('.product-image').forEach(img => {
    img.addEventListener('click', (e) => {
      const productId = img.dataset.id;
      const product = products.find(p => p.id == productId);
      if (product) {
        openProductModal(product);
      }
    });
    img.style.cursor = 'pointer';
  });
}

function openProductModal(product) {
  const modal = document.getElementById('productModal');
  document.getElementById('modalImage').src = product.image;
  document.getElementById('modalImage').alt = product.name;
  document.getElementById('modalProductName').textContent = product.name || 'Premium Tote Bag';
  document.getElementById('modalProductBadge').textContent = product.badge;
  document.getElementById('modalProductPrice').textContent = product.price;
  modal.style.display = 'flex';
  document.body.style.overflow = 'hidden';
}

function closeProductModal() {
  const modal = document.getElementById('productModal');
  modal.style.display = 'none';
  document.body.style.overflow = 'auto';
}

document.addEventListener('DOMContentLoaded', () => {
  renderProducts();
  
  const closeBtn = document.getElementById('modalClose');
  const closeBtn2 = document.getElementById('modalClose2');
  const addCartBtn = document.getElementById('modalAddCart');
  const modal = document.getElementById('productModal');
  
  closeBtn.addEventListener('click', closeProductModal);
  closeBtn2.addEventListener('click', closeProductModal);
  addCartBtn.addEventListener('click', () => {
    alert('Product added to cart!');
    closeProductModal();
  });
  
  modal.addEventListener('click', (e) => {
    if (e.target === modal) closeProductModal();
  });
  
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeProductModal();
  });
});