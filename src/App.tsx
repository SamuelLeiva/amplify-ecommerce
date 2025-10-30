import { useAuthenticator } from "@aws-amplify/ui-react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import HomePage from "./pages/Home";
import AddProductPage from "./pages/AddProduct";
import ProductDetailsPage from "./pages/ProductDetails";

function App() {
  const { signOut } = useAuthenticator();

  return (
    <main>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/products/add-product" element={<AddProductPage />} />
           <Route path="/products/:id" element={<ProductDetailsPage />} />
        </Routes>
      </BrowserRouter>
      <button onClick={signOut}>Sign out</button>
    </main>
  );
}

export default App;
