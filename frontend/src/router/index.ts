import {
  createElement,
  lazy,
  Suspense,
  type ComponentType,
  type LazyExoticComponent,
} from "react";
import { Spin } from "antd";
import { createBrowserRouter, type RouteObject } from "react-router-dom";
import MainLayout from "@/layouts/MainLayout";
import authRoutes from "./auth.routes";
import studyRoutes from "./study.routes";
import teachingRoutes from "./teaching.routes";
import projectRoutes from "./project.routes";

const Home = lazy(() => import("@/pages/Home"));
const ResearchHub = lazy(() => import("@/pages/Research"));
const ManagementHub = lazy(() => import("@/pages/Management"));
const MajorConstruct = lazy(() => import("@/pages/Management/MajorConstruct"));
const PolicyResponse = lazy(() => import("@/pages/Management/PolicyResponse"));
const Collaboration = lazy(() => import("@/pages/Research/Collaboration"));

const lazyElement = (Component: LazyExoticComponent<ComponentType<any>>) =>
  createElement(
    Suspense,
    {
      fallback: createElement(
        "div",
        { className: "flex justify-center mt-12" },
        createElement(Spin, { size: "large" }),
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
      { path: "research", element: lazyElement(ResearchHub) },
      { path: "management", element: lazyElement(ManagementHub) },
      { path: "management/major", element: lazyElement(MajorConstruct) },
      { path: "management/policy", element: lazyElement(PolicyResponse) },
      { path: "research/collaboration", element: lazyElement(Collaboration) },
    ],
  },
];

const router = createBrowserRouter([...mainRoutes, ...authRoutes, ...projectRoutes]);

export default router;