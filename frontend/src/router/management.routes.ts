import {
  createElement,
  Suspense,
  type ComponentType,
  type LazyExoticComponent,
} from "react";
import { Navigate, type RouteObject } from "react-router-dom";
import Loader from "@/effects/Loader";
import { lazyWithReload } from "./lazyWithReload";

const ManagementHub = lazyWithReload(() => import("@/pages/Management"));
const ProcessAssistant = lazyWithReload(() => import("@/pages/Management/ProcessAssistant"));
const AnnouncementGenerator = lazyWithReload(() => import("@/pages/Management/AnnouncementGenerator"));
const MaterialsCenter = lazyWithReload(() => import("@/pages/Management/MaterialsCenter"));
const StudentQA = lazyWithReload(() => import("@/pages/Management/StudentQA"));
const Dashboard = lazyWithReload(() => import("@/pages/Management/Dashboard"));
const Timeline = lazyWithReload(() => import("@/pages/Management/Timeline"));

const lazyElement = (Component: LazyExoticComponent<ComponentType<any>>) =>
  createElement(
    Suspense,
    {
      fallback: createElement(
        "div",
        { className: "mt-12 flex justify-center" },
        createElement(Loader, { size: "lg", text: "加载中", subtext: "正在准备助管模块..." }),
      ),
    },
    createElement(Component),
  );

const managementRoutes: RouteObject[] = [
  { path: "management", element: lazyElement(ManagementHub) },
  { path: "management/process-assistant", element: lazyElement(ProcessAssistant) },
  { path: "management/process-assistant/cases/new", element: lazyElement(ProcessAssistant) },
  { path: "management/process-assistant/cases/:caseId", element: lazyElement(ProcessAssistant) },
  { path: "management/announcement-generator", element: lazyElement(AnnouncementGenerator) },
  { path: "management/announcement-generator/new", element: lazyElement(AnnouncementGenerator) },
  { path: "management/announcement-generator/:announcementId", element: lazyElement(AnnouncementGenerator) },
  {
    path: "management/announcement-generator/dialogue/:id",
    element: createElement(Navigate, { to: "/management/announcement-generator", replace: true }),
  },
  { path: "management/materials-center", element: lazyElement(MaterialsCenter) },
  { path: "management/materials-center/collections/new", element: lazyElement(MaterialsCenter) },
  { path: "management/materials-center/collections/:collectionId", element: lazyElement(MaterialsCenter) },
  { path: "management/student-qa", element: lazyElement(StudentQA) },
  { path: "management/student-qa/threads/new", element: lazyElement(StudentQA) },
  { path: "management/student-qa/threads/:threadId", element: lazyElement(StudentQA) },
  { path: "management/dashboard", element: lazyElement(Dashboard) },
  { path: "management/dashboard/insights/:sessionId", element: lazyElement(Dashboard) },
  { path: "management/timeline", element: lazyElement(Timeline) },
  { path: "management/timeline/:timelineId", element: lazyElement(Timeline) },
];

export default managementRoutes;
