import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Footer } from "@/layout/Footer";
import { Header } from "@/layout/Header";
import Home from "@/pages/Home";
import Register from "@/pages/Register";
import AdminResetPasswordPage from "@/pages/admin-reset-password";
import AdminDashboard from "@/pages/admin/Dashboard";
import AdminLogin from "@/pages/admin/Login";
import AdminManagement from "@/pages/admin/admin-management";
import NotificationManagement from "@/pages/admin/notification-management";
import NotFound from "@/pages/not-found";
import { QueryClientProvider } from "@tanstack/react-query";
import { Route, Switch } from "wouter";
import { queryClient } from "./lib/queryClient";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/register" component={Register} />
      <Route path="/admin/login" component={AdminLogin} />
      <Route path="/admin/reset-password" component={AdminResetPasswordPage} />
      <Route path="/admin/dashboard" component={AdminDashboard} />
      <Route path="/admin/management" component={AdminManagement} />
      <Route path="/admin/notifications" component={NotificationManagement} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <div className="flex flex-col min-h-screen">
          <Header />
          <main className="flex-1">
            <Router />
          </main>
          <Footer />
        </div>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
