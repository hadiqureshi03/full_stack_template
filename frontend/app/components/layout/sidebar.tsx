import { NavLink } from "react-router";
import { X, Sun, Moon } from "lucide-react";
import { cn } from "~/utils/cn";
import { useTheme } from "~/contexts/theme-context";

const adminLinks = [
  { to: "/perioder", label: "Perioder" },
  { to: "/adgangsstyring", label: "Adgangsstyring" },
  { to: "/afsnit", label: "Afsnit" },
  { to: "/personalegrupper", label: "Personalegrupper" },
  { to: "/vagtlag", label: "Vagtlag" },
  { to: "/ansaettelser", label: "Ansættelser" },
];

const planlaegningLinks = [{ to: "/personale", label: "Personale" }];

type SidebarProps = {
  mobileOpen: boolean;
  onMobileClose: () => void;
};

function SidebarLink({ to, label, onClick }: { to: string; label: string; onClick?: () => void }) {
  return (
    <NavLink
      to={to}
      onClick={onClick}
      className={({ isActive }) =>
        cn(
          "block px-3 py-2 rounded-md text-sm transition-colors",
          isActive
            ? "bg-accent text-accent-foreground font-medium"
            : "text-foreground-muted hover:bg-surface-hover hover:text-foreground"
        )
      }
    >
      {label}
    </NavLink>
  );
}

export function Sidebar({ mobileOpen, onMobileClose }: SidebarProps) {
  const { theme, toggleTheme } = useTheme();

  return (
    <>
      {mobileOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-40 md:hidden"
          onClick={onMobileClose}
        />
      )}

      <aside
        className={cn(
          "w-[240px] flex-shrink-0 bg-background border-r border-border flex flex-col",
          "fixed inset-y-0 left-0 z-50 transition-transform duration-200 md:sticky md:top-0 md:h-screen md:translate-x-0",
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="flex items-center justify-between px-5 py-5 border-b border-border">
          <div>
            <div className="text-[18px] font-semibold text-foreground">Fairplan</div>
            <div className="text-xs text-foreground-muted mt-0.5">Computation ApS</div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={toggleTheme}
              className="h-7 w-7 rounded-full border border-border-strong flex items-center justify-center text-foreground-muted hover:text-foreground hover:bg-surface-hover hover:border-border transition-colors"
              aria-label={theme === "dark" ? "Skift til lystilstand" : "Skift til mørk tilstand"}
            >
              {theme === "dark" ? <Sun className="h-3.5 w-3.5" /> : <Moon className="h-3.5 w-3.5" />}
            </button>
            <button
              onClick={onMobileClose}
              className="md:hidden text-foreground-muted hover:text-foreground transition-colors"
              aria-label="Luk menu"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        <nav className="flex-1 overflow-y-auto px-3 py-4 flex flex-col gap-6">
          <div>
            <div className="px-3 mb-1.5 text-[11px] font-semibold uppercase tracking-wider text-foreground-subtle">
              Administration
            </div>
            <div className="flex flex-col gap-0.5">
              {adminLinks.map((link) => (
                <SidebarLink key={link.to} {...link} onClick={onMobileClose} />
              ))}
            </div>
          </div>
          <div>
            <div className="px-3 mb-1.5 text-[11px] font-semibold uppercase tracking-wider text-foreground-subtle">
              Planlægning
            </div>
            <div className="flex flex-col gap-0.5">
              {planlaegningLinks.map((link) => (
                <SidebarLink key={link.to} {...link} onClick={onMobileClose} />
              ))}
            </div>
          </div>
        </nav>
      </aside>
    </>
  );
}
