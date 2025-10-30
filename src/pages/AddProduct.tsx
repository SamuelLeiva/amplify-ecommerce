"use client";
import { useState } from "react";
import { generateClient } from "aws-amplify/api";
import type { Schema } from "../../amplify/data/resource";
import ImageUploader from "../components/ImageUploader";

const client = generateClient<Schema>();

export default function AddProductPage() {
  const [form, setForm] = useState({
    name: "",
    description: "",
    price: "",
    imageUrl: "",
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      await client.models.Product.create({
        name: form.name,
        description: form.description,
        price: parseFloat(form.price),
        imageUrl: form.imageUrl,
      });
      setSuccess(true);
      setForm({ name: "", description: "", price: "", imageUrl: "" });
    } catch (err) {
      console.error("Error creando producto:", err);
      setError("Hubo un error al guardar el producto.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-lg mx-auto mt-10 p-6 border rounded-lg shadow-md">
      <h1 className="text-2xl font-bold mb-4">Agregar producto</h1>

      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          name="name"
          placeholder="Nombre del producto"
          value={form.name}
          onChange={handleChange}
          className="w-full border p-2 rounded"
          required
        />

        <textarea
          name="description"
          placeholder="Descripción"
          value={form.description}
          onChange={handleChange}
          className="w-full border p-2 rounded"
        />

        <input
          name="price"
          placeholder="Precio"
          type="number"
          value={form.price}
          onChange={handleChange}
          className="w-full border p-2 rounded"
          required
        />

        <ImageUploader onUpload={(url) => setForm((f) => ({ ...f, imageUrl: url }))} />

        <button
          type="submit"
          disabled={loading}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          {loading ? "Guardando..." : "Agregar producto"}
        </button>

        {success && <p className="text-green-600 mt-2">✅ Producto agregado con éxito</p>}
        {error && <p className="text-red-600 mt-2">{error}</p>}
      </form>
    </div>
  );
}
