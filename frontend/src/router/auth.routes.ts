import { createElement } from "react";
import type { RouteObject } from "react-router-dom";
import AuthLayout from "@/pages/Auth";
import Login from "@/pages/Auth/Login";
import Resister from "@/pages/Auth/Resister";
import ForgetPassword from "@/pages/Auth/ForgetPassword";
import RouteErrorElement from "./RouteErrorElement";

const authRoutes: RouteObject[] = [
  {
    path: "/",
    element: createElement(AuthLayout),
    errorElement: createElement(RouteErrorElement),
    children: [
      { path: "login", element: createElement(Login) },
      { path: "register", element: createElement(Resister) },
      { path: "forget-password", element: createElement(ForgetPassword) },
    ],
  },
];

export default authRoutes;
