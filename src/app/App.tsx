// import { BrowserRouter, Route, Routes } from "react-router-dom";
// import DashboardLayout from "./DashboardLayout";
// import Dashboard from "../../pages/Dashboard";

// import Login from "../../pages/";

// export default function App() {
//   return (
//     <BrowserRouter>
//       <Routes>
//         <Route path="/login" element={<Login />} />
//         <Route element={<DashboardLayout />}>
//           <Route path="/" element={<Dashboard />} />
//           {/* <Route path="/projects" element={<Projects />} />
//           <Route path="/projects/:id" element={<ProjectDetail />} />
//           <Route path="/tasks" element={<Tasks />} />
//           <Route path="/shop" element={<Shop />} />
//           <Route path="/shop/products/:id" element={<ProductDetail />} />
//           <Route path="/shop/cart" element={<Cart />} />
//           <Route path="/profile" element={<Profile />} /> */}
//         </Route>
//       </Routes>
//     </BrowserRouter>
//   );
// }

import { RouterProvider } from "react-router-dom";
import { routes } from "./routes";

const App = () => {
  return <RouterProvider router={routes} />;
};

export default App;
