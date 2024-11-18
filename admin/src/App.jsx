import { Route, Routes } from "react-router-dom";
import React from "react";
import { publicRoutes ,privateRoutes} from "./routes/allRoutes";
function App() {
  
  return (
    <React.Fragment>
      <Routes>
        {!localStorage.getItem('token') && publicRoutes.map((route, idx) => (
          <Route path={route.path} key={idx} element={<route.component />} />
        ))}
        {localStorage.getItem('token') && privateRoutes.map((route, idx) => (
        
          <Route path={route.path} key={idx} element={<route.component />} />
       
        ))}
      </Routes>
    </React.Fragment>
  );
}

export default App;
