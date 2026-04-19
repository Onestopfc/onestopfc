import { Switch, Route, Router } from "wouter";
import { useHashLocation } from "wouter/use-hash-location";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./lib/queryClient";
import { Toaster } from "@/components/ui/toaster";
import { useEffect } from "react";

import Landing from "./pages/Landing";
import Register from "./pages/Register";
import Login from "./pages/Login";
import CustomerDashboard from "./pages/CustomerDashboard";
import LoanRequest from "./pages/LoanRequest";
import LoanHistory from "./pages/LoanHistory";
import StaffLogin from "./pages/StaffLogin";
import StaffDashboard from "./pages/StaffDashboard";
import StaffCustomers from "./pages/StaffCustomers";
import StaffAssess from "./pages/StaffAssess";
import Profile from "./pages/Profile";
import NotFound from "./pages/not-found";

function App() {
  useEffect(() => { document.documentElement.classList.add("dark"); }, []);
  return (
    <QueryClientProvider client={queryClient}>
      <Router hook={useHashLocation}>
        <Switch>
          <Route path="/" component={Landing} />
          <Route path="/register" component={Register} />
          <Route path="/login" component={Login} />
          <Route path="/dashboard" component={CustomerDashboard} />
          <Route path="/loan/new" component={LoanRequest} />
          <Route path="/loans" component={LoanHistory} />
          <Route path="/profile" component={Profile} />
          <Route path="/staff" component={StaffLogin} />
          <Route path="/staff/dashboard" component={StaffDashboard} />
          <Route path="/staff/customers" component={StaffCustomers} />
          <Route path="/staff/assess/:id" component={StaffAssess} />
          <Route component={NotFound} />
        </Switch>
      </Router>
      <Toaster />
    </QueryClientProvider>
  );
}

export default App;
