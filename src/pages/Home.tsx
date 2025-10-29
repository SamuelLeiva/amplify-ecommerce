"use client";

import { useState, useEffect } from "react";
import { list, getUrl } from "aws-amplify/storage";
import { useAuthenticator } from "@aws-amplify/ui-react";
import { Link } from "react-router-dom";

export default function HomePage() {
  const { user } = useAuthenticator((context) => [context.user]);
  const [images, setImages] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchImages = async () => {
      try {
        setLoading(true);

        // 🔹 Si el usuario está autenticado, usamos su carpeta personal
        const identityId = user.userId || "guest";
        const userPath = `products-images/${identityId}/`;

        console.log(userPath)

        // 🔹 Listamos los archivos en la carpeta
        const result = await list({
          path: userPath
        });

        console.log(result)

        // 🔹 Obtenemos las URLs públicas (temporales) de cada imagen
        const urls = await Promise.all(
          result.items.map(async (item) => {
            const { url } = await getUrl({ path: item.path });
            return url.toString();
          })
        );

        setImages(urls);
      } catch (error) {
        console.error("Error al listar imágenes:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchImages();
  }, [user]);

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">🖼️ Mis imágenes subidas</h1>
        <Link
          to="/add-product"
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
        >
          + Añadir producto
        </Link>
      </div>

      {loading ? (
        <p className="text-gray-500">Cargando imágenes...</p>
      ) : images.length === 0 ? (
        <p className="text-gray-500">
          Aún no has subido imágenes. ¡Empieza ahora!
        </p>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {images.map((url, index) => (
            <div
              key={index}
              className="border rounded-lg overflow-hidden shadow-sm hover:shadow-md transition"
            >
              <img
                src={url}
                alt={`imagen-${index}`}
                className="object-cover w-full h-40"
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
