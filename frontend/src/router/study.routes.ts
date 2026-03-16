import {
  createElement,
  lazy,
  Suspense,
  type ComponentType,
  type LazyExoticComponent,
} from "react";
import type { RouteObject } from "react-router-dom";
import Loader from "@/effects/Loader";

const StudyHub = lazy(() => import("@/pages/Study"));
const CodeTutor = lazy(() => import("@/pages/Study/CodeTutor"));
const CodeTutorListPage = lazy(() => import("@/pages/Study/CodeTutor/ListPage"));

const lazyElement = (Component: LazyExoticComponent<ComponentType<any>>) =>
  createElement(
    Suspense,
    {
      fallback: createElement(
        "div",
        { className: "mt-12 flex justify-center" },
        createElement(Loader, { size: "lg", text: "加载中", subtext: "正在准备学习模块..." }),
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