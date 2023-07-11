import React from "react";
import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { NavBar } from "./components/NavBar/NavBar";
import Home from "./components/Home/Home";
import Profile from "./components/Profile/Profile";
import NetWorth from "./components/NetWorth/NetWorth";
import Balance from "./components/Balance/Balance";
import MonthlyExpenses from "./components/MonthyExpenses/MonthlyExpenses";

export default function App() {
  return (
    <BrowserRouter>
      <NavBar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="profile" element={<Profile />} />
        <Route path="networth" element={<NetWorth />} />
        <Route path="balance" element={<Balance />} />
        <Route path="monthlyexpenses" element={<MonthlyExpenses />} />
      </Routes>
    </BrowserRouter>
  );
}
