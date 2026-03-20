import {
  createElement,
  lazy,
  Suspense,
  type ComponentType,
  type LazyExoticComponent,
} from "react";
import { Navigate, type RouteObject } from "react-router-dom";
import Loader from "@/effects/Loader";

const TeachingHub = lazy(() => import("@/pages/Teaching"));
const AssignmentReview = lazy(() => import("@/pages/Teaching/AssignmentReview"));
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
        { className: "mt-12 flex justify-center" },
        createElement(Loader, { size: "lg", text: "加载中", subtext: "正在准备教学模块..." }),
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
  { path: "teaching/assignment-review", element: lazyElement(AssignmentReview) },
  { path: "teaching/assignment-review/tasks", element: lazyElement(AssignmentReview) },
  { path: "teaching/assignment-review/tasks/new", element: lazyElement(AssignmentReview) },
  { path: "teaching/assignment-review/tasks/:assignmentId", element: lazyElement(AssignmentReview) },
  {
    path: "teaching/assignment-review/tasks/:assignmentId/submissions/:submissionId",
    element: lazyElement(AssignmentReview),
  },
  {
    path: "teaching/assignment-review/ListPage",
    element: createElement(Navigate, { to: "/teaching/assignment-review/tasks", replace: true }),
  },
  {
    path: "teaching/assignment-review/detail",
    element: createElement(Navigate, { to: "/teaching/assignment-review/tasks", replace: true }),
  },
  { path: "teaching/syllabus/ListPage", element: lazyElement(SyllabusList) },
  { path: "teaching/syllabus/detail", element: lazyElement(SyllabusDetail) },
  { path: "teaching/exam/ListPage", element: lazyElement(ExamDesignList) },
  { path: "teaching/exam/detail", element: lazyElement(ExamDesignDetail) },
];

export default teachingRoutes;
