import { createElement } from "react";
import type { ComponentType } from "react";
import type { RouteObject } from "react-router-dom";
import {
  WorkspaceDetailRoute,
  WorkspaceListRoute,
} from "@/feature/RecordWorkspace";
import InternationalHub from "@/pages/International";
import AbroadLife from "@/pages/International/AbroadLife";
import CulturalTraining from "@/pages/International/CulturalTraining";
import CulturalTrainingDetailPage from "@/pages/International/CulturalTraining/DetailPage";
import CulturalTrainingListPage from "@/pages/International/CulturalTraining/ListPage";
import ExchangeHub from "@/pages/International/ExchangeHub";
import MatchingLab from "@/pages/International/MatchingLab";
import PreDeparture from "@/pages/International/PreDeparture";
import ProcessFlow from "@/pages/International/ProcessFlow";
import ReturnService from "@/pages/International/ReturnService";
import WelcomePortal from "@/pages/International/WelcomePortal";
import WritingDesk from "@/pages/International/WritingDesk";
import { internationalWorkspaceModules } from "@/pages/workspaceRegistry";

const moduleLandingComponents: Record<string, ComponentType> = {
  "international-exchange-hub": ExchangeHub,
  "international-matching-lab": MatchingLab,
  "international-process-flow": ProcessFlow,
  "international-writing-desk": WritingDesk,
  "international-pre-departure": PreDeparture,
  "international-welcome-portal": WelcomePortal,
  "international-abroad-life": AbroadLife,
  "international-return-service": ReturnService,
};

const internationalRoutes: RouteObject[] = [
  { path: "international", element: createElement(InternationalHub) },
  { path: "international/cultural-training", element: createElement(CulturalTraining) },
  { path: "international/cultural-training/ListPage", element: createElement(CulturalTrainingListPage) },
  { path: "international/cultural-training/detail", element: createElement(CulturalTrainingDetailPage) },
  { path: "international/cultural-training/detail/:id", element: createElement(CulturalTrainingDetailPage) },
  ...internationalWorkspaceModules.flatMap((module) => {
    const basePath = module.routeBase.replace(/^\//, "");
    return [
      {
        path: basePath,
        element: createElement(moduleLandingComponents[module.key]),
      },
      {
        path: `${basePath}/ListPage`,
        element: createElement(WorkspaceListRoute, { config: module }),
      },
      {
        path: `${basePath}/detail`,
        element: createElement(WorkspaceDetailRoute, { config: module }),
      },
      {
        path: `${basePath}/detail/:id`,
        element: createElement(WorkspaceDetailRoute, { config: module }),
      },
    ];
  }),
];

export default internationalRoutes;
