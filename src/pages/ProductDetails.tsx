import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { generateClient } from "aws-amplify/data";
import { getUrl } from "aws-amplify/storage";
import type { Schema } from "../../amplify/data/resource";

const client = generateClient<Schema>();

export default function ProductDetailsPage() {
  const { id } = useParams();
  const [product, setProduct] = useState<Schema["Product"]["type"] | null>(null);
  const [imageUrl, setImageUrl] = useState<string | null>(null);

  // al inicio que busque el producto y sus propiedades
  useEffect(() => {
    const fetchProduct = async () => {
      if (!id) return;

      const { data } = await client.models.Product.get({ id });
      console.log(data)
      setProduct(data ?? null);

      if (data?.imageUrl) {
        try {
          // Obtener URL firmada temporal para mostrar imagen desde S3
          const result = await getUrl({ path: data.imageUrl });
          console.log(result)
          setImageUrl(result.url.toString());
          console.log(imageUrl)
        } catch (error) {
          console.error("Error obteniendo la URL de la imagen:", error);
        }
      }
    };

    fetchProduct();
  }, [id]);

  if (!product) return <p>Cargando...</p>;

  return (
    <div style={{ padding: "2rem" }}>
      <Link to="/">⬅ Volver</Link>
      <h1>{product.name}</h1>
      <p>{product.description}</p>
      <p>
        <strong>Precio:</strong> ${product.price}
      </p>

      {imageUrl ? (
        <img
          src={imageUrl}
          alt={product.name}
          style={{ maxWidth: "300px", borderRadius: "8px", marginTop: "1rem" }}
        />
      ) : (
        <p>Imagen no disponible</p>
      )}
    </div>
  );
}
