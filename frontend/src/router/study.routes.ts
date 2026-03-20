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
const ResourcePackHub = lazy(() => import("@/pages/Study/ResourcePack"));
const NJUSchoolsPage = lazy(() => import("@/pages/Study/ResourcePack/NJUSchoolsPage"));
const NJUSchoolDetailPage = lazy(() => import("@/pages/Study/ResourcePack/NJUSchoolDetailPage"));
const DisciplinesPage = lazy(() => import("@/pages/Study/ResourcePack/DisciplinesPage"));
const DisciplineDetailPage = lazy(() => import("@/pages/Study/ResourcePack/DisciplineDetailPage"));
const MajorDetailPage = lazy(() => import("@/pages/Study/ResourcePack/MajorDetailPage"));
const AdmissionsCategoriesPage = lazy(() => import("@/pages/Study/ResourcePack/AdmissionsCategoriesPage"));
const AdmissionsCategoryDetailPage = lazy(() => import("@/pages/Study/ResourcePack/AdmissionsCategoryDetailPage"));
const ProgressRadar = lazy(() => import("@/pages/Study/ProgressRadar"));
const CareerPlanner = lazy(() => import("@/pages/Study/CareerPlanner"));
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
  { path: "study/resource-pack", element: lazyElement(ResourcePackHub) },
  { path: "study/resource-pack/nju-schools", element: lazyElement(NJUSchoolsPage) },
  { path: "study/resource-pack/nju-schools/:schoolSlug", element: lazyElement(NJUSchoolDetailPage) },
  { path: "study/resource-pack/disciplines", element: lazyElement(DisciplinesPage) },
  { path: "study/resource-pack/disciplines/:disciplineSlug", element: lazyElement(DisciplineDetailPage) },
  { path: "study/resource-pack/disciplines/:disciplineSlug/:majorSlug", element: lazyElement(MajorDetailPage) },
  { path: "study/resource-pack/admissions-categories", element: lazyElement(AdmissionsCategoriesPage) },
  { path: "study/resource-pack/admissions-categories/:categorySlug", element: lazyElement(AdmissionsCategoryDetailPage) },
  { path: "study/progress-radar", element: lazyElement(ProgressRadar) },
  { path: "study/career-planner", element: lazyElement(CareerPlanner) },
  { path: "study/code-tutor", element: lazyElement(CodeTutor) },
  { path: "study/code-tutor/ListPage", element: lazyElement(CodeTutorListPage) },
];

export default studyRoutes;
