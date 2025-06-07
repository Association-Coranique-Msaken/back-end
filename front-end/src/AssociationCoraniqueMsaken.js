import React from "react";
import Accueil from "./pages/Accueil.js";
import AuthEtudiant from "./pages/AuthEtudiant.js";
import AuthAdmin from "./pages/AuthAdmin.js";
import AuthParent from "./pages/AuthParent.js";
import AuthEnseignant from "./pages/AuthEnseignant.js";
import Dashboard from "./pages/Dashboard.js";
import AddMember from "./pages/AddMember.js";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import MemberList from "./pages/MemberList.js";

const router = createBrowserRouter([
    {
        path: "/",
        element: <Accueil />,
    },
    {
        path: "/AuthAdmin",
        element: <AuthAdmin />,
    },
    {
        path: "/AuthEtudiant",
        element: <AuthEtudiant />,
    },
    {
        path: "/AuthParent",
        element: <AuthParent />,
    },
    {
        path: "/AuthEnseignant",
        element: <AuthEnseignant />,
    },
    {
        path: "/Dashboard",
        element: <Dashboard />,
    },
    {
        path: "/AddMember",
        element: <AddMember />,
    },
    {
        path: "/MemberList",
        element: <MemberList />,
    },
]);
export default function AssociationCoraniqueMsaken() {
    return <RouterProvider router={router} />;
}
