import {
  createElement,
  lazy,
  Suspense,
  type ComponentType,
  type LazyExoticComponent,
} from "react";
import type { RouteObject } from "react-router-dom";
import Loader from "@/effects/Loader";

const ManagementHub = lazy(() => import("@/pages/Management"));
const ProcessAssistant = lazy(() => import("@/pages/Management/ProcessAssistant"));
const AnnouncementGenerator = lazy(() => import("@/pages/Management/AnnouncementGenerator"));
const AnnouncementDialoguePage = lazy(() => import("@/pages/Management/AnnouncementGenerator/DialoguePage"));
const MaterialsCenter = lazy(() => import("@/pages/Management/MaterialsCenter"));
const StudentQA = lazy(() => import("@/pages/Management/StudentQA"));
const Dashboard = lazy(() => import("@/pages/Management/Dashboard"));
const Timeline = lazy(() => import("@/pages/Management/Timeline"));

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
  { path: "management/announcement-generator", element: lazyElement(AnnouncementGenerator) },
  { path: "management/announcement-generator/dialogue/:id", element: lazyElement(AnnouncementDialoguePage) },
  { path: "management/materials-center", element: lazyElement(MaterialsCenter) },
  { path: "management/student-qa", element: lazyElement(StudentQA) },
  { path: "management/dashboard", element: lazyElement(Dashboard) },
  { path: "management/timeline", element: lazyElement(Timeline) },
];

export default managementRoutes;
