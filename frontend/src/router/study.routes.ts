import {
  createElement,
  lazy,
  Suspense,
  type ComponentType,
  type LazyExoticComponent,
} from "react";
import { Spin } from "antd";
import type { RouteObject } from "react-router-dom";

const StudyHub = lazy(() => import("@/pages/Study"));
const CodeTutor = lazy(() => import("@/pages/Study/CodeTutor"));
const CodeTutorListPage = lazy(() => import("@/pages/Study/CodeTutor/ListPage"));

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

const studyRoutes: RouteObject[] = [
  { path: "study", element: lazyElement(StudyHub) },
  { path: "study/code-tutor", element: lazyElement(CodeTutor) },
  { path: "study/code-tutor/ListPage", element: lazyElement(CodeTutorListPage) },
];

export default studyRoutes;