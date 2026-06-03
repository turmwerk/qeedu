import { createElement } from "react";
import { Navigate, type RouteObject } from "react-router-dom";
import Account from "@/pages/Account";
import Overview from "@/pages/Account/Overview";
import Profile from "@/pages/Account/Profile";
import Preferences from "@/pages/Account/Preferences";
import Security from "@/pages/Account/Security";
import Identity from "@/pages/Account/Identity";
import SignIn from "@/pages/Account/SignIn";
import Sessions from "@/pages/Account/Sessions";
import Notifications from "@/pages/Account/Notifications";
import AIPreferences from "@/pages/Account/AIPreferences";
import ModelConfig from "@/pages/Account/ModelConfig";
import ContextPolicy from "@/pages/Account/ContextPolicy";
import Privacy from "@/pages/Account/Privacy";
import Billing from "@/pages/Account/Billing";
import DataExport from "@/pages/Account/DataExport";
import Activity from "@/pages/Account/Activity";
import Audit from "@/pages/Account/Audit";
import Settings from "@/pages/Account/Settings";
import Help from "@/pages/Account/Help";

const accountRoutes: RouteObject[] = [
  {
    path: "account",
    element: createElement(Account),
    children: [
      { index: true, element: createElement(Overview) },
      { path: "profile", element: createElement(Profile) },
      { path: "preferences", element: createElement(Preferences) },
      { path: "security", element: createElement(Security) },
      { path: "identity", element: createElement(Identity) },
      { path: "sign-in", element: createElement(SignIn) },
      { path: "sessions", element: createElement(Sessions) },
      { path: "oauth", element: createElement(Navigate, { to: "/account/sign-in", replace: true }) },
      { path: "notifications", element: createElement(Notifications) },
      { path: "ai-preferences", element: createElement(AIPreferences) },
      { path: "model-config", element: createElement(ModelConfig) },
      { path: "context-policy", element: createElement(ContextPolicy) },
      { path: "privacy", element: createElement(Privacy) },
      { path: "billing", element: createElement(Billing) },
      { path: "data", element: createElement(DataExport) },
      { path: "activity", element: createElement(Activity) },
      { path: "audit", element: createElement(Audit) },
      { path: "settings", element: createElement(Settings) },
      { path: "help", element: createElement(Help) },
      { path: "*", element: createElement(Navigate, { to: "/account", replace: true }) },
    ],
  },
];

export default accountRoutes;
