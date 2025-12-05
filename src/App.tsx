import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { LanguageProvider } from "@/contexts/LanguageContext";
import { AnalyticsProvider } from "@/contexts/AnalyticsContext";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import { ScrollToTop } from "@/components/ScrollToTop";
import { AuthenticatedAIAssistant } from "@/components/AuthenticatedAIAssistant";
import { InstallPWA } from "@/components/InstallPWA";
import { CookieConsent } from "@/components/CookieConsent";
import { AppLayout } from "@/components/layouts/AppLayout";
import Index from "./pages/Index";
import Auth from "./pages/Auth";
import AuthCallback from "./pages/AuthCallback";
import UpdatePassword from "./pages/UpdatePassword";
import DeleteAccount from "./pages/DeleteAccount";
import Dashboard from "./pages/Dashboard";
import Lists from "./pages/Lists";
import Groups from "./pages/Groups";
import Events from "./pages/Events";
import Assignment from "./pages/Assignment";
import GroupAssignments from "./pages/GroupAssignments";
import Messages from "./pages/Messages";
import Terms from "./pages/Terms";
import Privacy from "./pages/Privacy";
import HowItWorks from "./pages/HowItWorks";
import Contact from "./pages/Contact";
import DMCA from "./pages/DMCA";
import NotFound from "./pages/NotFound";
import RolesTest from "./pages/RolesTest";
import Pricing from "./pages/Pricing";
import Marketplace from "./pages/Marketplace";
import MyProducts from "./pages/MyProducts";
import AdminAuditLogs from "./pages/AdminAuditLogs";
import AdminCorrections from "./pages/AdminCorrections";
import AdminDashboard from "./pages/AdminDashboard";
import AdminStats from "./pages/AdminStats";
import OnboardingWelcome from "./pages/OnboardingWelcome";
import Search from "./pages/Search";
import CreateListStep1 from "./pages/create-list/CreateListStep1";
import CreateListStep2 from "./pages/create-list/CreateListStep2";
import CreateListSuccess from "./pages/create-list/CreateListSuccess";
import SharedList from "./pages/SharedList";
import { lazy, Suspense } from "react";

const DebugPanel = lazy(() => import("@/components/DebugPanel").then(m => ({ default: m.DebugPanel })));

const queryClient = new QueryClient();

const App = () => (
  <ErrorBoundary>
    <QueryClientProvider client={queryClient}>
      <LanguageProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <ScrollToTop />
            <AnalyticsProvider>
              <AuthenticatedAIAssistant />
              <InstallPWA />
              {import.meta.env.DEV && (
                <Suspense fallback={null}>
                  <DebugPanel />
                </Suspense>
              )}
              <CookieConsent />
              <Routes>
                {/* PUBLIC ROUTES - No AppLayout */}
                <Route path="/" element={<Index />} />
                <Route path="/auth" element={<Auth />} />
                <Route path="/auth/callback" element={<AuthCallback />} />
                <Route path="/update-password" element={<UpdatePassword />} />
                <Route path="/onboarding/welcome" element={<OnboardingWelcome />} />
                
                {/* CREATE LIST WIZARD - No AppLayout (custom wizard UI) */}
                <Route path="/create-list/step-1" element={<CreateListStep1 />} />
                <Route path="/create-list/step-2" element={<CreateListStep2 />} />
                <Route path="/create-list/success" element={<CreateListSuccess />} />
                
                {/* SHARED LIST - Public view */}
                <Route path="/lists/:slug" element={<SharedList />} />
                
                {/* AUTHENTICATED ROUTES - With AppLayout (Header + Footer) */}
                <Route element={<AppLayout />}>
                  <Route path="/dashboard" element={<Dashboard />} />
                  <Route path="/lists" element={<Lists />} />
                  <Route path="/groups" element={<Groups />} />
                  <Route path="/groups/:groupId/assignment" element={<Assignment />} />
                  <Route path="/assignment/:groupId" element={<Assignment />} />
                  <Route path="/groups/:groupId/admin" element={<GroupAssignments />} />
                  <Route path="/messages" element={<Messages />} />
                  <Route path="/events" element={<Events />} />
                  <Route path="/search" element={<Search />} />
                  <Route path="/marketplace" element={<Marketplace />} />
                  <Route path="/my-products" element={<MyProducts />} />
                  <Route path="/pricing" element={<Pricing />} />
                  <Route path="/delete-account" element={<DeleteAccount />} />
                  <Route path="/roles-test" element={<RolesTest />} />
                  
                  {/* ADMIN ROUTES */}
                  <Route path="/admin" element={<AdminDashboard />} />
                  <Route path="/admin/audit-logs" element={<AdminAuditLogs />} />
                  <Route path="/admin/corrections" element={<AdminCorrections />} />
                  <Route path="/admin/stats" element={<AdminStats />} />
                  
                  {/* LEGAL/INFO PAGES */}
                  <Route path="/terms" element={<Terms />} />
                  <Route path="/privacy" element={<Privacy />} />
                  <Route path="/dmca" element={<DMCA />} />
                  <Route path="/contact" element={<Contact />} />
                  <Route path="/how-it-works" element={<HowItWorks />} />
                </Route>

                {/* CATCH-ALL */}
                <Route path="*" element={<NotFound />} />
              </Routes>
            </AnalyticsProvider>
          </BrowserRouter>
        </TooltipProvider>
      </LanguageProvider>
    </QueryClientProvider>
  </ErrorBoundary>
);

export default App;
