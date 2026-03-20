import { createElement } from "react";
import { Navigate, type RouteObject } from "react-router-dom";
import LegacyParamRedirect from "@/router/LegacyParamRedirect";
import ResearchHub from "@/pages/Research";
import ConferenceList from "@/pages/Research/ConferenceList";
import LiteratureSearch from "@/pages/Research/LiteratureSearch";
import PaperReader from "@/pages/Research/PaperReader";
import PaperWriting from "@/pages/Research/PaperWriting";

const researchRoutes: RouteObject[] = [
  { path: "research", element: createElement(ResearchHub) },
  { path: "research/conference-list", element: createElement(ConferenceList) },
  {
    path: "research/collaboration",
    element: createElement(Navigate, { to: "/research/paper-writing", replace: true }),
  },
  { path: "research/literature-search", element: createElement(LiteratureSearch) },
  { path: "research/literature-search/queries/new", element: createElement(LiteratureSearch) },
  { path: "research/literature-search/queries/:queryId", element: createElement(LiteratureSearch) },
  {
    path: "research/literature-search/ListPage",
    element: createElement(Navigate, { to: "/research/literature-search", replace: true }),
  },
  {
    path: "research/literature-search/detail",
    element: createElement(Navigate, { to: "/research/literature-search", replace: true }),
  },
  {
    path: "research/literature-search/detail/:id",
    element: createElement(LegacyParamRedirect, {
      to: (params) => `/research/literature-search/queries/${params.id ?? ""}`,
    }),
  },
  { path: "research/paper-reader", element: createElement(PaperReader) },
  { path: "research/paper-reader/papers/:paperId", element: createElement(PaperReader) },
  {
    path: "research/paper-reader/ListPage",
    element: createElement(Navigate, { to: "/research/paper-reader", replace: true }),
  },
  {
    path: "research/paper-reader/detail",
    element: createElement(Navigate, { to: "/research/paper-reader", replace: true }),
  },
  {
    path: "research/paper-reader/detail/:id",
    element: createElement(LegacyParamRedirect, {
      to: (params) => `/research/paper-reader/papers/${params.id ?? ""}`,
    }),
  },
  { path: "research/paper-writing", element: createElement(PaperWriting) },
  { path: "research/paper-writing/drafts/new", element: createElement(PaperWriting) },
  { path: "research/paper-writing/drafts/:draftId", element: createElement(PaperWriting) },
  {
    path: "research/paper-writing/ListPage",
    element: createElement(Navigate, { to: "/research/paper-writing", replace: true }),
  },
  {
    path: "research/paper-writing/detail",
    element: createElement(Navigate, { to: "/research/paper-writing", replace: true }),
  },
  {
    path: "research/paper-writing/detail/:id",
    element: createElement(LegacyParamRedirect, {
      to: (params) => `/research/paper-writing/drafts/${params.id ?? ""}`,
    }),
  },
];

export default researchRoutes;
