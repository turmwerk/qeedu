import {
  createElement,
  lazy,
  Suspense,
  type ComponentType,
  type LazyExoticComponent,
} from "react";
import { createBrowserRouter, type RouteObject } from "react-router-dom";
import Loader from "@/effects/Loader";
import MainLayout from "@/layouts/MainLayout";
import authRoutes from "./auth.routes";
import studyRoutes from "./study.routes";
import teachingRoutes from "./teaching.routes";
import internationalRoutes from "./international.routes";
import researchRoutes from "./research.routes";
import managementRoutes from "./management.routes";
import projectRoutes from "./project.routes";

const Home = lazy(() => import("@/pages/Home"));

const lazyElement = (Component: LazyExoticComponent<ComponentType<any>>) =>
  createElement(
    Suspense,
    {
      fallback: createElement(
        "div",
        { className: "mt-12 flex justify-center" },
        createElement(Loader, { size: "lg", text: "加载中", subtext: "正在准备页面资源..." }),
      ),
    },
    createElement(Component),
  );

const mainRoutes: RouteObject[] = [
  {
    path: "/",
    element: createElement(MainLayout),
    children: [
      { path: "/", element: lazyElement(Home) },
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
