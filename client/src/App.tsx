import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Switch } from "wouter";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/react";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import Home from "./pages/Home";
import VersionB from "./pages/VersionB";
import VersionC from "./pages/VersionC";
import VersionD from "./pages/VersionD";
import VersionE from "./pages/VersionE";
import Assessment from "./pages/Assessment";
import Results from "./pages/Results";
import PaymentSuccess from "./pages/PaymentSuccess";
import PaymentCancel from "./pages/PaymentCancel";
import Success from "./pages/Success";
import AdminDashboard from "./pages/AdminDashboard";
import AdminMatches from "./pages/AdminMatches";
import EmailCapture from "./pages/EmailCapture";
import TestResults from "./pages/TestResults";


function Router() {
  // make sure to consider if you need authentication for certain routes
  return (
    <Switch>
      <Route path={"/"} component={Home} />
      <Route path={"/version-b"} component={VersionB} />
      <Route path={"/version-c"} component={VersionC} />
      <Route path={"/version-d"} component={VersionD} />
      <Route path={"/version-e"} component={VersionE} />
      <Route path={"/email-capture"} component={EmailCapture} />
      <Route path={"/test"} component={TestResults} />
      <Route path={"/test-results"} component={TestResults} />
      <Route path={"/assessment"} component={Assessment} />
      <Route path={"/results"} component={Results} />
      <Route path={"/success"} component={Success} />
      <Route path={"/payment-success"} component={PaymentSuccess} />
      <Route path={"/payment-cancel"} component={PaymentCancel} />
      <Route path={"/admin"} component={AdminDashboard} />
      <Route path={"/admin/matches"} component={AdminMatches} />
      <Route path={"/404"} component={NotFound} />
      {/* Final fallback route */}
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider
        defaultTheme="light"
        // switchable
      >
        <TooltipProvider>
          <Toaster />
          <Router />
          <Analytics />
          <SpeedInsights />
        </TooltipProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
