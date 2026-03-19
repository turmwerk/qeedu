import {
  lazy,
  Suspense,
  type ComponentType,
  type LazyExoticComponent,
} from "react";
import { createElement } from "react";
import { Navigate, type RouteObject } from "react-router-dom";
import Loader from "@/effects/Loader";
import { researchWorkspaceModules } from "@/pages/workspaceRegistry";

const ResearchHub = lazy(() => import("@/pages/Research"));
const LiteratureSearch = lazy(() => import("@/pages/Research/LiteratureSearch"));
const LiteratureSearchListPage = lazy(() => import("@/pages/Research/LiteratureSearch/ListPage"));
const LiteratureSearchDetailPage = lazy(() => import("@/pages/Research/LiteratureSearch/DetailPage"));
const PaperReader = lazy(() => import("@/pages/Research/PaperReader"));
const PaperReaderListPage = lazy(() => import("@/pages/Research/PaperReader/ListPage"));
const PaperReaderDetailPage = lazy(() => import("@/pages/Research/PaperReader/DetailPage"));
const PaperWriting = lazy(() => import("@/pages/Research/PaperWriting"));
const PaperWritingListPage = lazy(() => import("@/pages/Research/PaperWriting/ListPage"));
const PaperWritingDetailPage = lazy(() => import("@/pages/Research/PaperWriting/DetailPage"));

const lazyElement = (Component: LazyExoticComponent<ComponentType<any>>) =>
  createElement(
    Suspense,
    {
      fallback: createElement(
        "div",
        { className: "mt-12 flex justify-center" },
        createElement(Loader, { size: "lg", text: "加载中", subtext: "正在准备科研模块..." }),
      ),
    },
    createElement(Component),
  );

const moduleEntryComponents: Record<string, LazyExoticComponent<ComponentType<any>>> = {
  "research-literature-search": LiteratureSearch,
  "research-paper-reader": PaperReader,
  "research-paper-writing": PaperWriting,
};

const moduleListPageComponents: Record<string, LazyExoticComponent<ComponentType<any>>> = {
  "research-literature-search": LiteratureSearchListPage,
  "research-paper-reader": PaperReaderListPage,
  "research-paper-writing": PaperWritingListPage,
};

const moduleDetailPageComponents: Record<string, LazyExoticComponent<ComponentType<any>>> = {
  "research-literature-search": LiteratureSearchDetailPage,
  "research-paper-reader": PaperReaderDetailPage,
  "research-paper-writing": PaperWritingDetailPage,
};

const researchRoutes: RouteObject[] = [
  { path: "research", element: lazyElement(ResearchHub) },
  {
    path: "research/collaboration",
    element: createElement(Navigate, { to: "/research/paper-writing/ListPage", replace: true }),
  },
  ...researchWorkspaceModules.flatMap((module) => {
    const basePath = module.routeBase.replace(/^\//, "");
    return [
      {
        path: basePath,
        element: lazyElement(moduleEntryComponents[module.key]),
      },
      {
        path: `${basePath}/ListPage`,
        element: lazyElement(moduleListPageComponents[module.key]),
      },
      {
        path: `${basePath}/detail`,
        element: lazyElement(moduleDetailPageComponents[module.key]),
      },
    ];
  }),
];

export default researchRoutes;
