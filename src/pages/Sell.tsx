import { useState } from "react";
import ImageUploader from "../components/ImageUploader";

export default function SellPage() {
  const [product, setProduct] = useState({
    name: "",
    price: "",
    imageUrl: "",
  });

  const handleImageUpload = (url: string) => {
    setProduct({ ...product, imageUrl: url });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Producto listo para guardar:", product);
    // En Fase 4 guardarás este objeto en DynamoDB (AppSync)
  };

  return (
    <div className="max-w-md mx-auto p-6">
      <h1 className="text-xl font-bold mb-4">Publicar producto</h1>
      <form onSubmit={handleSubmit} className="space-y-3">
        <input
          type="text"
          placeholder="Nombre del producto"
          value={product.name}
          onChange={(e) => setProduct({ ...product, name: e.target.value })}
          className="border p-2 w-full rounded-md"
        />
        <input
          type="number"
          placeholder="Precio"
          value={product.price}
          onChange={(e) => setProduct({ ...product, price: e.target.value })}
          className="border p-2 w-full rounded-md"
        />

        <ImageUploader onUpload={handleImageUpload} />

        {product.imageUrl && (
          <p className="text-sm text-gray-600 mt-2">
            Imagen cargada correctamente ✅
          </p>
        )}

        <button
          type="submit"
          className="bg-green-600 text-white w-full py-2 rounded-md mt-4"
        >
          Guardar producto
        </button>
      </form>
    </div>
  );
}
