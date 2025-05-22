// src/pages/ProductDetail.tsx 
// Yet to be completed
import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { getProductDetail, addToShoppingList } from '../services/api';
import { Spinner } from '../components/Spinner';

interface Variant {
  id: number;
  name: string;
  price: number;
}

interface Product {
  id: number;
  name: string;
  description: string;
  image_url: string;
  variants: Variant[];
}

export default function ProductDetail() {
  const { id } = useParams<{ id: string }>();
  const [product, setProduct] = useState<Product | null>(null);
  const [selectedVariant, setSelectedVariant] = useState<Variant | null>(null);
  const [adding, setAdding] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;
    getProductDetail(Number(id))
      .then((data) => {
        setProduct(data);
        if (data.variants.length) {
          setSelectedVariant(data.variants[0]);
        }
      })
      .catch((err) => setError(err.message));
  }, [id]);

  const handleAdd = async () => {
    if (!selectedVariant) return;
    setAdding(true);
    try {
      await addToShoppingList({
        product_variant_id: selectedVariant.id,
        quantity: 1,
      });
      // TODO: show a success toast/snackbar
    } catch (err: any) {
      setError(err.message);
    } finally {
      setAdding(false);
    }
  };

  if (error) return <div className="p-4 text-red-600">Error: {error}</div>;
  if (!product) return <Spinner />;

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="flex flex-col md:flex-row gap-6">
        <img
          src={product.image_url}
          alt={product.name}
          className="w-full md:w-1/3 rounded-lg shadow"
        />
        <div className="flex-1">
          <h1 className="text-2xl font-bold mb-2">{product.name}</h1>
          <p className="mb-4 text-gray-700">{product.description}</p>

          {product.variants.length > 0 && (
            <div className="mb-4">
              <label className="block mb-1 font-medium">Choose variant:</label>
              <select
                className="border rounded p-2 w-full"
                value={selectedVariant?.id}
                onChange={(e) => {
                  const vid = Number(e.target.value);
                  const v = product.variants.find((v) => v.id === vid) || null;
                  setSelectedVariant(v);
                }}
              >
                {product.variants.map((v) => (
                  <option key={v.id} value={v.id}>
                    {v.name} — {v.price.toFixed(2)} €
                  </option>
                ))}
              </select>
            </div>
          )}

          <button
            onClick={handleAdd}
            disabled={adding}
            className="px-6 py-2 rounded-xl shadow hover:shadow-md transition disabled:opacity-50 bg-blue-600 text-white"
          >
            {adding ? 'Adding…' : 'Add to Shopping List'}
          </button>
        </div>
      </div>
    </div>
  );
}
