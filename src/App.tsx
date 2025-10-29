import { useAuthenticator } from "@aws-amplify/ui-react";
import SellPage from "./pages/Sell";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import HomePage from "./pages/Home";

function App() {
  const { signOut } = useAuthenticator();

  return (
    <main>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/add-product" element={<SellPage />} />
        </Routes>
      </BrowserRouter>
      <button onClick={signOut}>Sign out</button>
    </main>
  );
}

export default App;
