import {
  createElement,
  lazy,
  Suspense,
  type ComponentType,
  type LazyExoticComponent,
} from "react";
import { Spin } from "antd";
import { Navigate, type RouteObject } from "react-router-dom";

const TeachingHub = lazy(() => import("@/pages/Teaching"));
const SyllabusList = lazy(() =>
  import("@/pages/Teaching/Syllabus/router").then((module) => ({
    default: module.ListRoute,
  })),
);
const SyllabusDetail = lazy(() =>
  import("@/pages/Teaching/Syllabus/router").then((module) => ({
    default: module.DetailRoute,
  })),
);
const ExamDesignList = lazy(() =>
  import("@/pages/Teaching/ExamDesign/router").then((module) => ({
    default: module.ListRoute,
  })),
);
const ExamDesignDetail = lazy(() =>
  import("@/pages/Teaching/ExamDesign/router").then((module) => ({
    default: module.DetailRoute,
  })),
);

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

const teachingRoutes: RouteObject[] = [
  { path: "teaching", element: lazyElement(TeachingHub) },
  {
    path: "teaching/exam",
    element: createElement(Navigate, { to: "/teaching/exam/ListPage", replace: true }),
  },
  {
    path: "teaching/syllabus",
    element: createElement(Navigate, { to: "/teaching/syllabus/ListPage", replace: true }),
  },
  { path: "teaching/syllabus/ListPage", element: lazyElement(SyllabusList) },
  { path: "teaching/syllabus/detail", element: lazyElement(SyllabusDetail) },
  { path: "teaching/exam/ListPage", element: lazyElement(ExamDesignList) },
  { path: "teaching/exam/detail", element: lazyElement(ExamDesignDetail) },
];

export default teachingRoutes;