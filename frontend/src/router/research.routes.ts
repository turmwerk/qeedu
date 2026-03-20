import { createElement, type ComponentType } from "react";
import { Navigate, type RouteObject } from "react-router-dom";
import ResearchHub from "@/pages/Research";
import ConferenceList from "@/pages/Research/ConferenceList";
import LiteratureSearch from "@/pages/Research/LiteratureSearch";
import LiteratureSearchListPage from "@/pages/Research/LiteratureSearch/ListPage";
import LiteratureSearchDetailPage from "@/pages/Research/LiteratureSearch/DetailPage";
import PaperReader from "@/pages/Research/PaperReader";
import PaperReaderListPage from "@/pages/Research/PaperReader/ListPage";
import PaperReaderDetailPage from "@/pages/Research/PaperReader/DetailPage";
import PaperWriting from "@/pages/Research/PaperWriting";
import PaperWritingListPage from "@/pages/Research/PaperWriting/ListPage";
import PaperWritingDetailPage from "@/pages/Research/PaperWriting/DetailPage";
import { researchWorkspaceModules } from "@/pages/workspaceRegistry";

const moduleLandingComponents: Record<string, ComponentType> = {
  "research-literature-search": LiteratureSearch,
  "research-paper-reader": PaperReader,
  "research-paper-writing": PaperWriting,
};

const moduleListPageComponents: Record<string, ComponentType> = {
  "research-literature-search": LiteratureSearchListPage,
  "research-paper-reader": PaperReaderListPage,
  "research-paper-writing": PaperWritingListPage,
};

const moduleDetailPageComponents: Record<string, ComponentType> = {
  "research-literature-search": LiteratureSearchDetailPage,
  "research-paper-reader": PaperReaderDetailPage,
  "research-paper-writing": PaperWritingDetailPage,
};

const researchRoutes: RouteObject[] = [
  { path: "research", element: createElement(ResearchHub) },
  { path: "research/conference-list", element: createElement(ConferenceList) },
  {
    path: "research/collaboration",
    element: createElement(Navigate, { to: "/research/paper-writing", replace: true }),
  },
  ...researchWorkspaceModules.flatMap((module) => {
    const basePath = module.routeBase.replace(/^\//, "");
    return [
      {
        path: basePath,
        element: createElement(moduleLandingComponents[module.key]),
      },
      {
        path: `${basePath}/ListPage`,
        element: createElement(moduleListPageComponents[module.key]),
      },
      {
        path: `${basePath}/detail`,
        element: createElement(moduleDetailPageComponents[module.key]),
      },
    ];
  }),
];

export default researchRoutes;
