import { BrowserRouter , Routes , Route } from "react-router-dom";
import Home from "./pages/Home";
import Model from "./pages/Model";
import Login from "./pages/Login";
import Singup from "./pages/Singup";
import Tutorial from "./pages/Tutorial";


function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />}/>
        <Route path="/model" element={<Model />}/>
        <Route path="/signup" element={<Login />}/>
        <Route path="/login" element={<Singup />}/>
        <Route path="/tutorial" element={<Tutorial />}/>
      </Routes>
    </BrowserRouter>
    
  );
}

export default App;