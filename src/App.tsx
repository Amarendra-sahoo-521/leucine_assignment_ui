import { lazy, Suspense } from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Layout from "./pages/layout";
const Audit = lazy(() => import("./pages/Audit"));
const Cleaning = lazy(() => import("./pages/Cleaning"));
const Equipment = lazy(() => import("./pages/Equipment"));

function App() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <RouterProvider
        router={createBrowserRouter([
          {
            path: "/",
            element: <Layout />,
            children: [
              {
                index: true,
                element: <Equipment />,
              },
              {
                path: "cleaning",
                element: <Cleaning />,
              },
              {
                path: "audit/*",
                element: <Audit />,
              },
            ],
          },
        ])}
      />
    </Suspense>
  );
}

export default App;
