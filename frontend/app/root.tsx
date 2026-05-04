import { useState, useEffect } from "react";
import {
  isRouteErrorResponse,
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
} from "react-router";
import { Menu } from "lucide-react";

import type { Route } from "./+types/root";
import "./app.css";
import { ToastProvider } from "~/contexts/toast-context";
import { ThemeProvider } from "~/contexts/theme-context";
import { Sidebar } from "~/components/layout/sidebar";
import { useFairplanStore } from "~/store/fairplan-store";

export const links: Route.LinksFunction = () => [
  { rel: "preconnect", href: "https://fonts.googleapis.com" },
  {
    rel: "preconnect",
    href: "https://fonts.gstatic.com",
    crossOrigin: "anonymous",
  },
  {
    rel: "stylesheet",
    href: "https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&display=swap",
  },
];

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="da">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
        <script dangerouslySetInnerHTML={{ __html: `
          (function(){
            var t=localStorage.getItem('theme');
            if(t==='dark'||(!t&&window.matchMedia('(prefers-color-scheme:dark)').matches)){
              document.documentElement.setAttribute('data-theme','dark');
            }
          })();
        `}} />
      </head>
      <body>
        {children}
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

export default function App() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    useFairplanStore.persist.rehydrate();
  }, []);

  return (
    <ThemeProvider>
    <ToastProvider>
      <div className="flex min-h-screen bg-background">
        <Sidebar mobileOpen={sidebarOpen} onMobileClose={() => setSidebarOpen(false)} />
        <div className="flex-1 flex flex-col min-w-0">
          <div className="md:hidden sticky top-0 z-30 h-14 bg-background border-b border-border flex items-center px-4">
            <button
              onClick={() => setSidebarOpen(true)}
              className="text-foreground-muted hover:text-foreground transition-colors"
              aria-label="Åbn menu"
            >
              <Menu className="h-5 w-5" />
            </button>
            <span className="ml-3 text-[18px] font-semibold text-foreground">Fairplan</span>
          </div>
          <main className="flex-1 overflow-auto">
            <div className="max-w-[1200px] mx-auto px-8 py-8">
              <Outlet />
            </div>
          </main>
        </div>
      </div>
    </ToastProvider>
    </ThemeProvider>
  );
}

export function ErrorBoundary({ error }: Route.ErrorBoundaryProps) {
  let message = "Oops!";
  let details = "An unexpected error occurred.";
  let stack: string | undefined;

  if (isRouteErrorResponse(error)) {
    message = error.status === 404 ? "404" : "Error";
    details =
      error.status === 404
        ? "The requested page could not be found."
        : error.statusText || details;
  } else if (import.meta.env.DEV && error && error instanceof Error) {
    details = error.message;
    stack = error.stack;
  }

  return (
    <main className="pt-16 p-4 container mx-auto">
      <h1>{message}</h1>
      <p>{details}</p>
      {stack && (
        <pre className="w-full p-4 overflow-x-auto">
          <code>{stack}</code>
        </pre>
      )}
    </main>
  );
}
