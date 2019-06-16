import Loading from "./pages/Loading";
import Login from "./pages/Login";
import Main from "./pages/Main";

export default [
  {
    path: "/",
    component: Loading
  },
  {
    path: "/login",
    component: Login
  },
  {
    path: "/main",
    component: Main
  }
];
