import React, { Suspense } from "react";
import { Navigate, createBrowserRouter } from "react-router-dom";
import { Spin } from "antd";
import MainLayout from "@/layouts/MainLayout";
import AuthLayout from "@/pages/Auth";
import Login from "@/pages/Auth/Login";
import Resister from "@/pages/Auth/Resister";
import ForgetPassword from "@/pages/Auth/ForgetPassword";

// Lazy Load
const CodeTutor = React.lazy(() => import("@/pages/Study/CodeTutor"));
const StudyHub = React.lazy(() => import("@/pages/Study"));
const TeachingHub = React.lazy(() => import("@/pages/Teaching"));
const ResearchHub = React.lazy(() => import("@/pages/Research"));
const ManagementHub = React.lazy(() => import("@/pages/Management"));
const SyllabusList = React.lazy(() =>
  import("@/pages/Teaching/Syllabus/router").then((m) => ({
    default: m.ListRoute,
  })),
);
const SyllabusDetail = React.lazy(() =>
  import("@/pages/Teaching/Syllabus/router").then((m) => ({
    default: m.DetailRoute,
  })),
);
const ExamDesignList = React.lazy(() =>
  import("@/pages/Teaching/ExamDesign/router").then((m) => ({
    default: m.ListRoute,
  })),
);
const ExamDesignDetail = React.lazy(() =>
  import("@/pages/Teaching/ExamDesign/router").then((m) => ({
    default: m.DetailRoute,
  })),
);
const MajorConstruct = React.lazy(
  () => import("@/pages/Management/MajorConstruct"),
);
const PolicyResponse = React.lazy(
  () => import("@/pages/Management/PolicyResponse"),
);
const Collaboration = React.lazy(
  () => import("@/pages/Research/Collaboration"),
);
const Home = React.lazy(() => import("@/pages/Home"));

const LazyLoad = (comp: React.ReactElement) => (
  <Suspense
    fallback={
      <div className="flex justify-center mt-12">
        <Spin size="large" />
      </div>
    }
  >
    {comp}
  </Suspense>
);

const router = createBrowserRouter([
  {
    path: "/",
    element: <MainLayout />,
    children: [
      { path: "/", element: LazyLoad(<Home />) },
      { path: "study", element: LazyLoad(<StudyHub />) },
      {
        path: "teaching",
        element: LazyLoad(<TeachingHub />),
      },
      {
        path: "research",
        element: LazyLoad(<ResearchHub />),
      },
      {
        path: "management",
        element: LazyLoad(<ManagementHub />),
      },
      {
        path: "study/code-tutor",
        element: LazyLoad(<CodeTutor />),
      },
      {
        path: "teaching/exam",
        element: <Navigate to="/teaching/exam/ListPage" replace />,
      },
      {
        path: "teaching/syllabus",
        element: <Navigate to="/teaching/syllabus/ListPage" replace />,
      },
      {
        path: "teaching/syllabus/ListPage",
        element: LazyLoad(<SyllabusList />),
      },
      {
        path: "teaching/syllabus/detail",
        element: LazyLoad(<SyllabusDetail />),
      },
      {
        path: "teaching/exam/ListPage",
        element: LazyLoad(<ExamDesignList />),
      },
      {
        path: "teaching/exam/detail",
        element: LazyLoad(<ExamDesignDetail />),
      },
      {
        path: "management/major",
        element: LazyLoad(<MajorConstruct />),
      },
      {
        path: "management/policy",
        element: LazyLoad(<PolicyResponse />),
      },
      {
        path: "research/collaboration",
        element: LazyLoad(<Collaboration />),
      },
    ],
  },
  {
    path: "/",
    element: <AuthLayout />,
    children: [
      { path: "login", element: <Login /> },
      { path: "register", element: <Resister /> },
      {
        path: "forget-password",
        element: <ForgetPassword />,
      },
    ],
  },
]);
export default router;
