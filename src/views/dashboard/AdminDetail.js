import React, { useState, useEffect } from 'react';

const ProductDetails = () => {
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        // Fetch data for a single product (e.g., product with ID 1)
        const response = await fetch('https://dummyjson.com/products/1');
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setProduct(data); // Store the entire product object in state

      } catch (error) {
        setError(error);
        console.error('Error fetching product data:', error);
        // You might want to set a more user-friendly error message here
      } finally {
        setLoading(false);
      }
    };

    fetchProduct(); // Call the async function
  }, []); // Empty dependency array

  if (loading) {
    return <div>Loading product details...</div>;
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  // Render product details only if product data is available
  return (
    <div>
      <h2>Product Details:</h2>
      {product ? (
        <>
          <p><strong>Title:</strong> {product.title}</p>
          <p><strong>Price:</strong> ${product.price.toFixed(2)}</p>
        </>
      ) : (
        <p>Product data not available.</p>
      )}
    </div>
  );
};

export default ProductDetails;
