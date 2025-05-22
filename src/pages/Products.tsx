import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  getCategories,
  listAllProducts,
  searchProducts,
} from '../services/api';

interface Category {
  id: number;
  name: string;
}

interface Product {
  id: number;
  name: string;
  description?: string;
  image_url?: string;
}

const ProductsPage: React.FC = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchCategories();
    fetchProducts();
  }, []);

  const fetchCategories = async () => {
    try {
      const data = await getCategories();
      setCategories(data);
    } catch (err: any) {
      setError(err.message || 'Failed to load categories');
    }
  };

  const fetchProducts = async (query = '', categoryId: number | null = null) => {
    setLoading(true);
    setError(null);
    try {
      let data;
      if (query) {
        data = await searchProducts(query);
      } else if (categoryId) {
        // TODO: implement endpoint for /products/categories/:id/
        data = await listAllProducts();
      } else {
        data = await listAllProducts();
      }
      setProducts(data);
    } catch (err: any) {
      setError(err.message || 'Failed to load products');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchProducts(searchTerm, selectedCategory);
  };

  const handleCategorySelect = (id: number) => {
    setSelectedCategory(id === selectedCategory ? null : id);
    fetchProducts('', id === selectedCategory ? null : id);
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-semibold mb-4">Products</h1>

      {/* Search */}
      <form onSubmit={handleSearch} className="mb-4">
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search products..."
          className="border rounded px-2 py-1 w-64"
        />
        <button type="submit" className="ml-2 px-3 py-1 border rounded hover:bg-gray-100">
          Search
        </button>
      </form>

      {/* Categories */}
      <div className="flex gap-2 overflow-x-auto mb-4">
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => handleCategorySelect(cat.id)}
            className={`px-3 py-1 rounded-full border 
              ${selectedCategory === cat.id ? 'bg-blue-500 text-white' : 'bg-white'}`}
          >
            {cat.name}
          </button>
        ))}
      </div>

      {/* Products Grid */}
      {loading ? (
        <p>Loading products...</p>
      ) : error ? (
        <p className="text-red-500">{error}</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {products.map((prod) => (
            <div key={prod.id} className="border p-4 rounded shadow-sm flex flex-col">
              {prod.image_url && (
                <img src={prod.image_url} alt={prod.name} className="h-32 object-cover mb-2 rounded" />
              )}
              <h2 className="font-medium text-lg mb-1">{prod.name}</h2>
              {prod.description && <p className="text-sm text-gray-600 mb-2">{prod.description}</p>}
              <div className="mt-auto">
                <Link
                  to={`/products/${prod.id}`}
                  className="text-blue-600 hover:underline"
                >
                  View Details
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ProductsPage;
