"use client";

import { useAuthenticator } from "@aws-amplify/ui-react";
import { FileUploader } from "@aws-amplify/ui-react-storage";
import "@aws-amplify/ui-react/styles.css";
import { getUrl } from "aws-amplify/storage";
import { useState } from "react";

export default function ImageUploader({
  onUpload,
}: {
  onUpload: (url: string) => void;
}) {
  const { user } = useAuthenticator();

  //States
  const [uploading, setUploading] = useState(false);
  const [uploadedUrl, setUploadedUrl] = useState<string | null>(null);

  return (
    <div className="p-4 border rounded-lg shadow-md max-w-sm">
      <h2 className="text-lg font-semibold mb-2">
        Sube una imagen de producto
      </h2>

      <FileUploader
        path={
          user.userId
            ? `products-images/${user.userId}/`
            : "products-images/guest/"
        }
        acceptedFileTypes={["image/*"]}
        maxFileCount={1}
        onUploadStart={() => setUploading(true)}
        onUploadSuccess={async ({ key }) => {
          setUploading(false);
          // Obtener la URL del archivo subido
          const { url } = await getUrl({ path: key as string });
          setUploadedUrl(url.toString());
          onUpload(url.toString());
        }}
        onUploadError={(error) => {
          console.error("Error al subir el archivo:", error);
          setUploading(false);
        }}
        isResumable
      />

      {uploading && <p className="text-blue-600 mt-2">Subiendo imagen...</p>}
      {uploadedUrl && (
        <img
          src={uploadedUrl}
          alt="uploaded"
          className="w-32 mt-3 rounded-md border"
        />
      )}
    </div>
  );
}
