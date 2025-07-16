import React from "react";
import ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import "./index.css";

// Импортируем Layout и страницы
import MainLayout from "./components/layout/Layout.tsx";
import Dashboard from "./pages/Dashboard.tsx";
import Orders from "./pages/Orders.tsx";
import Settings from "./pages/Settings.tsx";
import TenderPage from "./pages/TenderListPage.tsx";
import TenderTypeListPage from "./pages/tender-types/TenderTypeListPage.tsx";
import { TenderDetailPage } from "./pages/TenderDetailPage.tsx";
import DemoPage from "./components/tenderslist/page.tsx";
import { TenderChaptersPage } from "./pages/tender-types/TenderChaptersPage.tsx";
import { TenderCategoriesPage } from "./pages/tender-types/TenderCategoriesPage.tsx";
import UploadTenderPage from "./pages/UploadTenderPage.tsx";

// Создаем роутер
const router = createBrowserRouter([
  {
    // Главный маршрут использует MainLayout как обертку
    element: <MainLayout />,
    children: [
      {
        path: "/",
        element: <Dashboard />,
      },
      {
        path: "orders",
        element: <Orders />,
      },
      {
        path: "settings",
        element: <Settings />,
      },
      {
        path: "test",
        element: <DemoPage />,
      },
      {
        path: "tenders",
        element: <TenderPage />,
      },
      {
        path: "tender-upload",
        element: <UploadTenderPage />,
      },
      {
        path: "tenders/:id",
        element: <TenderDetailPage />,
      },
      {
        path: "directories/tender-types",
        element: <TenderTypeListPage />,
      },
      {
        path: "directories/tender-chapters",
        element: <TenderChaptersPage />,
      },
      {
        path: "directories/tender-categories",
        element: <TenderCategoriesPage />,
      },
    ],
  },
]);

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
