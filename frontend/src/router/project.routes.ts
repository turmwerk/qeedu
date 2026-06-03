import {
  createElement,
  Suspense,
  type ComponentType,
  type LazyExoticComponent,
} from "react";
import type { RouteObject } from "react-router-dom";
import Loader from "@/effects/Loader";
import { lazyWithReload } from "./lazyWithReload";
import RouteErrorElement from "./RouteErrorElement";

const ProjectPage = lazyWithReload(() => import("@/pages/Project"));

const lazyElement = (Component: LazyExoticComponent<ComponentType<any>>) =>
  createElement(
    Suspense,
    {
      fallback: createElement(
        "div",
        { className: "mt-12 flex justify-center" },
        createElement(Loader, { size: "lg", text: "加载中", subtext: "正在打开编程环境..." }),
      ),
    },
    createElement(Component),
  );

const projectRoutes: RouteObject[] = [
  {
    path: "study/code-tutor/ProjectPage",
    element: lazyElement(ProjectPage),
    errorElement: createElement(RouteErrorElement),
  },
];

export default projectRoutes;
