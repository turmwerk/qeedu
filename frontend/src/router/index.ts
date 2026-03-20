import { createElement } from "react";
import { createBrowserRouter, type RouteObject } from "react-router-dom";
import MainLayout from "@/layouts/MainLayout";
import Home from "@/pages/Home";
import authRoutes from "./auth.routes";
import studyRoutes from "./study.routes";
import teachingRoutes from "./teaching.routes";
import internationalRoutes from "./international.routes";
import researchRoutes from "./research.routes";
import managementRoutes from "./management.routes";
import projectRoutes from "./project.routes";

const mainRoutes: RouteObject[] = [
  {
    path: "/",
    element: createElement(MainLayout),
    children: [
      {
        path: "/",
        element: createElement(
          "div",
          null,
          createElement(Home),
        ),
      },
      ...studyRoutes,
      ...teachingRoutes,
      ...internationalRoutes,
      ...researchRoutes,
      ...managementRoutes,
    ],
  },
];

const router = createBrowserRouter([...mainRoutes, ...authRoutes, ...projectRoutes]);

export default router;
