import {
  lazy,
  Suspense,
  type ComponentType,
  type LazyExoticComponent,
} from "react";
import { createElement } from "react";
import type { RouteObject } from "react-router-dom";
import Loader from "@/effects/Loader";
import { internationalWorkspaceModules } from "@/pages/workspaceRegistry";

const InternationalHub = lazy(() => import("@/pages/International"));
const WelcomePortal = lazy(() => import("@/pages/International/WelcomePortal"));
const WelcomePortalListPage = lazy(() => import("@/pages/International/WelcomePortal/ListPage"));
const WelcomePortalDetailPage = lazy(() => import("@/pages/International/WelcomePortal/DetailPage"));
const ExchangeHub = lazy(() => import("@/pages/International/ExchangeHub"));
const ExchangeHubListPage = lazy(() => import("@/pages/International/ExchangeHub/ListPage"));
const ExchangeHubDetailPage = lazy(() => import("@/pages/International/ExchangeHub/DetailPage"));
const ProcessFlow = lazy(() => import("@/pages/International/ProcessFlow"));
const ProcessFlowListPage = lazy(() => import("@/pages/International/ProcessFlow/ListPage"));
const ProcessFlowDetailPage = lazy(() => import("@/pages/International/ProcessFlow/DetailPage"));
const PreDeparture = lazy(() => import("@/pages/International/PreDeparture"));
const PreDepartureListPage = lazy(() => import("@/pages/International/PreDeparture/ListPage"));
const PreDepartureDetailPage = lazy(() => import("@/pages/International/PreDeparture/DetailPage"));
const MatchingLab = lazy(() => import("@/pages/International/MatchingLab"));
const MatchingLabListPage = lazy(() => import("@/pages/International/MatchingLab/ListPage"));
const MatchingLabDetailPage = lazy(() => import("@/pages/International/MatchingLab/DetailPage"));
const AbroadLife = lazy(() => import("@/pages/International/AbroadLife"));
const AbroadLifeListPage = lazy(() => import("@/pages/International/AbroadLife/ListPage"));
const AbroadLifeDetailPage = lazy(() => import("@/pages/International/AbroadLife/DetailPage"));
const CulturalTraining = lazy(() => import("@/pages/International/CulturalTraining"));
const CulturalTrainingListPage = lazy(() => import("@/pages/International/CulturalTraining/ListPage"));
const CulturalTrainingDetailPage = lazy(() => import("@/pages/International/CulturalTraining/DetailPage"));
const ReturnService = lazy(() => import("@/pages/International/ReturnService"));
const ReturnServiceListPage = lazy(() => import("@/pages/International/ReturnService/ListPage"));
const ReturnServiceDetailPage = lazy(() => import("@/pages/International/ReturnService/DetailPage"));
const WritingDesk = lazy(() => import("@/pages/International/WritingDesk"));
const WritingDeskListPage = lazy(() => import("@/pages/International/WritingDesk/ListPage"));
const WritingDeskDetailPage = lazy(() => import("@/pages/International/WritingDesk/DetailPage"));

const lazyElement = (Component: LazyExoticComponent<ComponentType<any>>) =>
  createElement(
    Suspense,
    {
      fallback: createElement(
        "div",
        { className: "mt-12 flex justify-center" },
        createElement(Loader, { size: "lg", text: "加载中", subtext: "正在准备国际交流模块..." }),
      ),
    },
    createElement(Component),
  );

const moduleEntryComponents: Record<string, LazyExoticComponent<ComponentType<any>>> = {
  "international-welcome-portal": WelcomePortal,
  "international-exchange-hub": ExchangeHub,
  "international-process-flow": ProcessFlow,
  "international-pre-departure": PreDeparture,
  "international-matching-lab": MatchingLab,
  "international-abroad-life": AbroadLife,
  "international-cultural-training": CulturalTraining,
  "international-return-service": ReturnService,
  "international-writing-desk": WritingDesk,
};

const moduleListPageComponents: Record<string, LazyExoticComponent<ComponentType<any>>> = {
  "international-welcome-portal": WelcomePortalListPage,
  "international-exchange-hub": ExchangeHubListPage,
  "international-process-flow": ProcessFlowListPage,
  "international-pre-departure": PreDepartureListPage,
  "international-matching-lab": MatchingLabListPage,
  "international-abroad-life": AbroadLifeListPage,
  "international-cultural-training": CulturalTrainingListPage,
  "international-return-service": ReturnServiceListPage,
  "international-writing-desk": WritingDeskListPage,
};

const moduleDetailPageComponents: Record<string, LazyExoticComponent<ComponentType<any>>> = {
  "international-welcome-portal": WelcomePortalDetailPage,
  "international-exchange-hub": ExchangeHubDetailPage,
  "international-process-flow": ProcessFlowDetailPage,
  "international-pre-departure": PreDepartureDetailPage,
  "international-matching-lab": MatchingLabDetailPage,
  "international-abroad-life": AbroadLifeDetailPage,
  "international-cultural-training": CulturalTrainingDetailPage,
  "international-return-service": ReturnServiceDetailPage,
  "international-writing-desk": WritingDeskDetailPage,
};

const internationalRoutes: RouteObject[] = [
  { path: "international", element: lazyElement(InternationalHub) },
  ...internationalWorkspaceModules.flatMap((module) => {
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

export default internationalRoutes;
