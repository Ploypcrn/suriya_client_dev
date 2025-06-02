import './App.css'
import "./CustomAnt.css";
import { RouterProvider, useNavigate, useLocation } from "react-router-dom";
import { routes } from "./routes";
import { history } from './helpers';

function InnerComponent() {
  history.navigate = useNavigate();
  history.location = useLocation();
  return null;
}

function App() {
  return (
    <RouterProvider router={routes} >
      <InnerComponent />
    </RouterProvider>
  );
}

export default App