import React from "react";
import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { NavBar } from "./components/NavBar/NavBar";
import NetWorth from "./components/NetWorth/NetWorth";
import Balance from "./components/Balance/Balance";
import MonthlyExpenses from "./components/MonthyExpenses/MonthlyExpenses";
import Profile from "./components/Profile/Profile";

export default function App() {
  return (
    <BrowserRouter>
      <NavBar />
      <Routes>
        <Route path="/" element={<div>Home</div>} />
        <Route path="profile" element={<Profile />} />
        <Route path="networth" element={<NetWorth />} />
        <Route path="balance" element={<Balance />} />
        <Route path="monthlyexpenses" element={<MonthlyExpenses />} />
      </Routes>
    </BrowserRouter>
  );
}
