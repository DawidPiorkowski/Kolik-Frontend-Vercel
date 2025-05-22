// src/pages/ShoppingList.tsx
import { useEffect, useState } from 'react'
import { getShoppingList, removeFromShoppingList, clearShoppingList } from '../services/api'
import { Spinner } from '../components/Spinner'

interface ListItem {
  id: number
  product_name: string
  variant_name: string
  quantity: number
  price: number
}

export default function ShoppingList() {
  const [items, setItems] = useState<ListItem[] | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    getShoppingList()
      .then((data) => setItems(data.items || []))
      .catch((err) => setError(err.message))
  }, [])

  if (error) return <div className="p-4 text-red-600">Error: {error}</div>
  if (!items) return <Spinner />

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Your Shopping List</h1>
      {items.length === 0 ? (
        <p>Your list is empty.</p>
      ) : (
        <ul className="space-y-2">
          {items.map((it) => (
            <li
              key={it.id}
              className="flex justify-between items-center border p-2 rounded"
            >
              <div>
                <strong>{it.product_name}</strong> ({it.variant_name}) × {it.quantity}
              </div>
              <button
                className="text-red-500 hover:underline"
                onClick={() => {
                  removeFromShoppingList(it.id).then(() =>
                    setItems((prev) => prev?.filter((x) => x.id !== it.id) || [])
                  )
                }}
              >
                Remove
              </button>
            </li>
          ))}
        </ul>
      )}
      {items.length > 0 && (
        <button
          className="mt-4 px-4 py-2 bg-red-600 text-white rounded"
          onClick={() =>
            clearShoppingList().then(() => setItems([]))
          }
        >
          Clear List
        </button>
      )}
    </div>
  )
}
