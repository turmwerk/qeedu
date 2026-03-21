import { createElement } from "react";
import { Navigate, type RouteObject } from "react-router-dom";
import LegacyParamRedirect from "@/router/LegacyParamRedirect";
import InternationalHub from "@/pages/International";
import AbroadLife from "@/pages/International/AbroadLife";
import CulturalTraining from "@/pages/International/CulturalTraining";
import CulturalTrainingResourceSection from "@/pages/International/CulturalTraining/ResourceSection";
import ExchangeHub from "@/pages/International/ExchangeHub";
import MatchingLab from "@/pages/International/MatchingLab";
import PreDeparture from "@/pages/International/PreDeparture";
import ProcessFlow from "@/pages/International/ProcessFlow";
import ReturnService from "@/pages/International/ReturnService";
import WelcomePortal from "@/pages/International/WelcomePortal";
import WritingDesk from "@/pages/International/WritingDesk";

const internationalRoutes: RouteObject[] = [
  { path: "international", element: createElement(InternationalHub) },
  { path: "international/exchange-hub", element: createElement(ExchangeHub) },
  { path: "international/exchange-hub/programs/:programId", element: createElement(ExchangeHub) },
  { path: "international/matching-lab", element: createElement(MatchingLab) },
  { path: "international/matching-lab/analyses/new", element: createElement(MatchingLab) },
  { path: "international/matching-lab/analyses/:analysisId", element: createElement(MatchingLab) },
  { path: "international/process-flow", element: createElement(ProcessFlow) },
  { path: "international/process-flow/plans/:planId", element: createElement(ProcessFlow) },
  { path: "international/writing-desk", element: createElement(WritingDesk) },
  { path: "international/writing-desk/drafts/new", element: createElement(WritingDesk) },
  { path: "international/writing-desk/drafts/:draftId", element: createElement(WritingDesk) },
  { path: "international/pre-departure", element: createElement(PreDeparture) },
  { path: "international/pre-departure/cases/:caseId", element: createElement(PreDeparture) },
  { path: "international/welcome-portal", element: createElement(WelcomePortal) },
  { path: "international/welcome-portal/cases/:caseId", element: createElement(WelcomePortal) },
  { path: "international/cultural-training", element: createElement(CulturalTraining) },
  { path: "international/cultural-training/profiles/:profileId", element: createElement(CulturalTraining) },
  { path: "international/cultural-training/resources", element: createElement(CulturalTrainingResourceSection) },
  { path: "international/abroad-life", element: createElement(AbroadLife) },
  { path: "international/abroad-life/tickets/:ticketId", element: createElement(AbroadLife) },
  { path: "international/return-service", element: createElement(ReturnService) },
  { path: "international/return-service/cases/:caseId", element: createElement(ReturnService) },
  {
    path: "international/exchange-hub/ListPage",
    element: createElement(Navigate, { to: "/international/exchange-hub", replace: true }),
  },
  {
    path: "international/exchange-hub/detail/:id",
    element: createElement(LegacyParamRedirect, {
      to: (params) => `/international/exchange-hub/programs/${params.id ?? ""}`,
    }),
  },
  {
    path: "international/exchange-hub/detail",
    element: createElement(Navigate, { to: "/international/exchange-hub", replace: true }),
  },
  {
    path: "international/matching-lab/ListPage",
    element: createElement(Navigate, { to: "/international/matching-lab", replace: true }),
  },
  {
    path: "international/matching-lab/detail/:id",
    element: createElement(LegacyParamRedirect, {
      to: (params) => `/international/matching-lab/analyses/${params.id ?? ""}`,
    }),
  },
  {
    path: "international/matching-lab/detail",
    element: createElement(Navigate, { to: "/international/matching-lab", replace: true }),
  },
  {
    path: "international/process-flow/ListPage",
    element: createElement(Navigate, { to: "/international/process-flow", replace: true }),
  },
  {
    path: "international/process-flow/detail/:id",
    element: createElement(LegacyParamRedirect, {
      to: (params) => `/international/process-flow/plans/${params.id ?? ""}`,
    }),
  },
  {
    path: "international/process-flow/detail",
    element: createElement(Navigate, { to: "/international/process-flow", replace: true }),
  },
  {
    path: "international/writing-desk/ListPage",
    element: createElement(Navigate, { to: "/international/writing-desk", replace: true }),
  },
  {
    path: "international/writing-desk/detail/:id",
    element: createElement(LegacyParamRedirect, {
      to: (params) => `/international/writing-desk/drafts/${params.id ?? ""}`,
    }),
  },
  {
    path: "international/writing-desk/detail",
    element: createElement(Navigate, { to: "/international/writing-desk", replace: true }),
  },
  {
    path: "international/pre-departure/ListPage",
    element: createElement(Navigate, { to: "/international/pre-departure", replace: true }),
  },
  {
    path: "international/pre-departure/detail/:id",
    element: createElement(LegacyParamRedirect, {
      to: (params) => `/international/pre-departure/cases/${params.id ?? ""}`,
    }),
  },
  {
    path: "international/pre-departure/detail",
    element: createElement(Navigate, { to: "/international/pre-departure", replace: true }),
  },
  {
    path: "international/welcome-portal/ListPage",
    element: createElement(Navigate, { to: "/international/welcome-portal", replace: true }),
  },
  {
    path: "international/welcome-portal/detail/:id",
    element: createElement(LegacyParamRedirect, {
      to: (params) => `/international/welcome-portal/cases/${params.id ?? ""}`,
    }),
  },
  {
    path: "international/welcome-portal/detail",
    element: createElement(Navigate, { to: "/international/welcome-portal", replace: true }),
  },
  {
    path: "international/cultural-training/ListPage",
    element: createElement(Navigate, { to: "/international/cultural-training", replace: true }),
  },
  {
    path: "international/cultural-training/detail/:id",
    element: createElement(LegacyParamRedirect, {
      to: (params) => `/international/cultural-training/profiles/${params.id ?? ""}`,
    }),
  },
  {
    path: "international/cultural-training/detail",
    element: createElement(Navigate, { to: "/international/cultural-training", replace: true }),
  },
  {
    path: "international/abroad-life/ListPage",
    element: createElement(Navigate, { to: "/international/abroad-life", replace: true }),
  },
  {
    path: "international/abroad-life/detail/:id",
    element: createElement(LegacyParamRedirect, {
      to: (params) => `/international/abroad-life/tickets/${params.id ?? ""}`,
    }),
  },
  {
    path: "international/abroad-life/detail",
    element: createElement(Navigate, { to: "/international/abroad-life", replace: true }),
  },
  {
    path: "international/return-service/ListPage",
    element: createElement(Navigate, { to: "/international/return-service", replace: true }),
  },
  {
    path: "international/return-service/detail/:id",
    element: createElement(LegacyParamRedirect, {
      to: (params) => `/international/return-service/cases/${params.id ?? ""}`,
    }),
  },
  {
    path: "international/return-service/detail",
    element: createElement(Navigate, { to: "/international/return-service", replace: true }),
  },
];

export default internationalRoutes;
