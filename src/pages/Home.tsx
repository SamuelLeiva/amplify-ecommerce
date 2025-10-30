"use client";

import { useState, useEffect } from "react";
import { getUrl } from "aws-amplify/storage";
// import { useAuthenticator } from "@aws-amplify/ui-react";
import { Link } from "react-router-dom";
import { Schema } from "../../amplify/data/resource";
import { generateClient } from "aws-amplify/api";

const client = generateClient<Schema>();

export default function HomePage() {
  // const { user } = useAuthenticator((context) => [context.user]);
  // const [images, setImages] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [products, setProducts] = useState<
    (Schema["Product"]["type"] & { imageUrlSigned?: string })[]
  >([]);

  useEffect(() => {
    const fecthProducts = async () => {
      try {
        setLoading(true);
        const { data } = await client.models.Product.list();

        // ✅ Obtenemos URLs firmadas solo si existe imageUrl
        const productsWithUrls = await Promise.all(
          data.map(async (product) => {
            if (product.imageUrl) {
              try {
                const { url } = await getUrl({ path: product.imageUrl });
                return { ...product, imageUrlSigned: url.toString() };
              } catch (err) {
                console.error(`Error al obtener URL de ${product.name}:`, err);
                return { ...product, imageUrlSigned: "" };
              }
            }
            return { ...product, imageUrlSigned: "" };
          })
        );

        setProducts(productsWithUrls);
      } catch (error) {
        console.error("Error al listar productos:", error);
      } finally {
        setLoading(false);
      }
    };
    fecthProducts();
    console.log(products);
  }, []);

  // useEffect(() => {
  //   const fetchImages = async () => {
  //     try {
  //       setLoading(true);

  //       // 🔹 Si el usuario está autenticado, usamos su carpeta personal
  //       const identityId = user.userId || "guest";
  //       const userPath = `products-images/${identityId}/`;

  //       console.log(userPath)

  //       // 🔹 Listamos los archivos en la carpeta
  //       const result = await list({
  //         path: userPath
  //       });

  //       console.log(result)

  //       // 🔹 Obtenemos las URLs públicas (temporales) de cada imagen
  //       const urls = await Promise.all(
  //         result.items.map(async (item) => {
  //           const { url } = await getUrl({ path: item.path });
  //           return url.toString();
  //         })
  //       );

  //       setImages(urls);
  //     } catch (error) {
  //       console.error("Error al listar imágenes:", error);
  //     } finally {
  //       setLoading(false);
  //     }
  //   };

  //   fetchImages();
  // }, [user]);

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">🛍️ Lista de productos</h1>
        <Link
          to="/products/add-product"
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
        >
          + Añadir producto
        </Link>
      </div>

      {loading ? (
        <p className="text-gray-500">Cargando productos...</p>
      ) : products.length === 0 ? (
        <p className="text-gray-500">No hay productos todavía.</p>
      ) : (
        <ul className="space-y-4">
          {products.map((p) => (
            <li
              key={p.id}
              className="flex items-center gap-4 border rounded-lg p-3 shadow-sm hover:shadow-md transition"
            >
              {/* ✅ Miniatura directamente con img */}
              <div className="!w-[100px] !h-[100px] flex-shrink-0 bg-gray-100 rounded overflow-hidden flex items-center justify-center">
                {p.imageUrlSigned ? (
                  <img
                    src={p.imageUrlSigned}
                    alt={p.name}
                    className="object-cover w-full h-full"
                  />
                ) : (
                  <span className="text-gray-400 text-sm">Sin imagen</span>
                )}
              </div>

              {/* ✅ Info del producto */}
              <div className="flex-1">
                <Link
                  to={`/products/${p.id}`}
                  className="text-lg font-semibold text-blue-600 hover:underline"
                >
                  {p.name}
                </Link>
                <p className="text-gray-700 mt-1">${p.price}</p>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
