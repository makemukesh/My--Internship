// Product data with images
const products = [
  {
    id: 1,
    name: "Blue Tigers Tote",
    price: "$45.00",
    image: "https://static.wixstatic.com/media/45d10e_35c84fb1d48540f1886b2ceb7a342c37~mv2_d_3500_1968_s_2.jpg/v1/fill/w_532,h_532,al_c,q_80,usm_0.66_1.00_0.01,enc_avif,quality_auto/45d10e_35c84fb1d48540f1886b2ceb7a342c37~mv2_d_3500_1968_s_2.jpg",
    badge: "Top Sellers"
  },
  {
    id: 2,
    name: "Swimmers Tote",
    price: "$52.00",
    image: "https://static.wixstatic.com/media/45d10e_20a938f8eca444a1ab34b1b2d361b71f~mv2_d_3500_1968_s_2.jpg/v1/fill/w_532,h_532,al_c,q_80,usm_0.66_1.00_0.01,enc_avif,quality_auto/45d10e_20a938f8eca444a1ab34b1b2d361b71f~mv2_d_3500_1968_s_2.jpg",
    badge: "Top Sellers"
  },
  {
    id: 3,
    name: "Orange Abstract Tote",
    price: "$48.00",
    image: "https://static.wixstatic.com/media/45d10e_7534171f1db24b66af322f721a90d7c7~mv2_d_3500_1968_s_2.jpg/v1/fill/w_532,h_532,al_c,q_80,usm_0.66_1.00_0.01,enc_avif,quality_auto/45d10e_7534171f1db24b66af322f721a90d7c7~mv2_d_3500_1968_s_2.jpg",
    badge: "Top Sellers"
  },
  {
    id: 4,
    name: "Swimmers Tote",
    price: "$48.00",
    image: "https://static.wixstatic.com/media/45d10e_b20e57309af44269b6655ce248bca487~mv2_d_3500_1968_s_2.jpg/v1/fill/w_532,h_532,al_c,q_80,usm_0.66_1.00_0.01,enc_avif,quality_auto/45d10e_b20e57309af44269b6655ce248bca487~mv2_d_3500_1968_s_2.jpg",
    badge: "Top Sellers"
  },
  {
    id: 5,
    name: "Orange Abstract Tote",
    price: "$48.00",
    image: "https://static.wixstatic.com/media/45d10e_85b84e09e8964627bcb095a52463344e~mv2_d_3500_1968_s_2.jpg/v1/fill/w_532,h_532,al_c,q_80,usm_0.66_1.00_0.01,enc_avif,quality_auto/45d10e_85b84e09e8964627bcb095a52463344e~mv2_d_3500_1968_s_2.jpg",
    badge: "Top Sellers"
  },
  {
    id: 6,
    name: "Blue Tigers Tote",
    price: "$48.00",
    image: "https://static.wixstatic.com/media/45d10e_bebe0265a9644b8697b873a11de242f6~mv2_d_3500_1968_s_2.jpg/v1/fill/w_532,h_532,al_c,q_80,usm_0.66_1.00_0.01,enc_avif,quality_auto/45d10e_bebe0265a9644b8697b873a11de242f6~mv2_d_3500_1968_s_2.jpg",
    badge: "Top Sellers"
  }
];

// Function to render products
function renderProducts() {
  const productContainer = document.querySelector('.products');
  
  // Clear existing content
  productContainer.innerHTML = '';
  
  // Create and append product cards
  products.forEach(product => {
    const productCard = document.createElement('article');
    productCard.className = 'product';
    
    productCard.innerHTML = `
      <span class="badge">${product.badge}</span>
      <div class="img-wrap">
        <img src="${product.image}" alt="${product.name}" />
      </div>
      <h3 class="title">${product.name}</h3>
      <p class="price">${product.price}</p>
    `;
    
    productContainer.appendChild(productCard);
  });
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', renderProducts);
