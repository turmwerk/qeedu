import { createElement } from "react";
import type { RouteObject } from "react-router-dom";
import AuthLayout from "@/pages/Auth";
import Login from "@/pages/Auth/Login";
import Resister from "@/pages/Auth/Resister";
import ForgetPassword from "@/pages/Auth/ForgetPassword";

const authRoutes: RouteObject[] = [
  {
    path: "/",
    element: createElement(AuthLayout),
    children: [
      { path: "login", element: createElement(Login) },
      { path: "register", element: createElement(Resister) },
      { path: "forget-password", element: createElement(ForgetPassword) },
    ],
  },
];

export default authRoutes;