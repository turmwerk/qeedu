import {
  createElement,
  lazy,
  Suspense,
  type ComponentType,
  type LazyExoticComponent,
} from "react";
import { Navigate, type RouteObject } from "react-router-dom";
import Loader from "@/effects/Loader";

const Account = lazy(() => import("@/pages/Account"));
const Overview = lazy(() => import("@/pages/Account/Overview"));
const Profile = lazy(() => import("@/pages/Account/Profile"));
const Preferences = lazy(() => import("@/pages/Account/Preferences"));
const Security = lazy(() => import("@/pages/Account/Security"));
const Identity = lazy(() => import("@/pages/Account/Identity"));
const SignIn = lazy(() => import("@/pages/Account/SignIn"));
const Sessions = lazy(() => import("@/pages/Account/Sessions"));
const OAuth = lazy(() => import("@/pages/Account/OAuth"));
const Notifications = lazy(() => import("@/pages/Account/Notifications"));
const AIPreferences = lazy(() => import("@/pages/Account/AIPreferences"));
const ModelConfig = lazy(() => import("@/pages/Account/ModelConfig"));
const ContextPolicy = lazy(() => import("@/pages/Account/ContextPolicy"));
const Privacy = lazy(() => import("@/pages/Account/Privacy"));
const Billing = lazy(() => import("@/pages/Account/Billing"));
const DataExport = lazy(() => import("@/pages/Account/DataExport"));
const Activity = lazy(() => import("@/pages/Account/Activity"));
const Audit = lazy(() => import("@/pages/Account/Audit"));
const Settings = lazy(() => import("@/pages/Account/Settings"));
const Help = lazy(() => import("@/pages/Account/Help"));

const lazyElement = (Component: LazyExoticComponent<ComponentType<any>>) =>
  createElement(
    Suspense,
    {
      fallback: createElement(
        "div",
        { className: "mt-12 flex justify-center" },
        createElement(Loader, { size: "lg", text: "加载中", subtext: "正在准备个人中心..." }),
      ),
    },
    createElement(Component),
  );

const accountRoutes: RouteObject[] = [
  {
    path: "account",
    element: lazyElement(Account),
    children: [
      { index: true, element: lazyElement(Overview) },
      { path: "profile", element: lazyElement(Profile) },
      { path: "preferences", element: lazyElement(Preferences) },
      { path: "security", element: lazyElement(Security) },
      { path: "identity", element: lazyElement(Identity) },
      { path: "sign-in", element: lazyElement(SignIn) },
      { path: "sessions", element: lazyElement(Sessions) },
      { path: "oauth", element: lazyElement(OAuth) },
      { path: "notifications", element: lazyElement(Notifications) },
      { path: "ai-preferences", element: lazyElement(AIPreferences) },
      { path: "model-config", element: lazyElement(ModelConfig) },
      { path: "context-policy", element: lazyElement(ContextPolicy) },
      { path: "privacy", element: lazyElement(Privacy) },
      { path: "billing", element: lazyElement(Billing) },
      { path: "data", element: lazyElement(DataExport) },
      { path: "activity", element: lazyElement(Activity) },
      { path: "audit", element: lazyElement(Audit) },
      { path: "settings", element: lazyElement(Settings) },
      { path: "help", element: lazyElement(Help) },
      { path: "*", element: createElement(Navigate, { to: "/account", replace: true }) },
    ],
  },
];

export default accountRoutes;
