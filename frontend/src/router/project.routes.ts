import {
  createElement,
  lazy,
  Suspense,
  type ComponentType,
  type LazyExoticComponent,
} from "react";
import { Spin } from "antd";
import type { RouteObject } from "react-router-dom";

const ProjectPage = lazy(() => import("@/pages/Project"));

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

const projectRoutes: RouteObject[] = [
  {
    path: "study/code-tutor/ProjectPage",
    element: lazyElement(ProjectPage),
  },
];

export default projectRoutes;