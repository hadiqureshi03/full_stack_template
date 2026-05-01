import { NavLink } from "react-router";
import { cn } from "~/utils/cn";

const adminLinks = [
  { to: "/perioder", label: "Perioder" },
  { to: "/adgangsstyring", label: "Adgangsstyring" },
  { to: "/afsnit", label: "Afsnit" },
  { to: "/personalegrupper", label: "Personalegrupper" },
  { to: "/vagtlag", label: "Vagtlag" },
  { to: "/ansaettelser", label: "Ansaettelser" },
];

const planlaegningLinks = [{ to: "/personale", label: "Personale" }];

function SidebarLink({ to, label }: { to: string; label: string }) {
  return (
    <NavLink
      to={to}
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

export function Sidebar() {
  return (
    <aside className="w-[240px] flex-shrink-0 h-screen sticky top-0 border-r border-border bg-background flex flex-col">
      <div className="px-5 py-5 border-b border-border">
        <div className="text-[18px] font-semibold text-foreground">Fairplan</div>
        <div className="text-xs text-foreground-muted mt-0.5">Computation ApS</div>
      </div>
      <nav className="flex-1 overflow-y-auto px-3 py-4 flex flex-col gap-6">
        <div>
          <div className="px-3 mb-1.5 text-[11px] font-semibold uppercase tracking-wider text-foreground-subtle">
            Administration
          </div>
          <div className="flex flex-col gap-0.5">
            {adminLinks.map((link) => (
              <SidebarLink key={link.to} {...link} />
            ))}
          </div>
        </div>
        <div>
          <div className="px-3 mb-1.5 text-[11px] font-semibold uppercase tracking-wider text-foreground-subtle">
            Planlægning
          </div>
          <div className="flex flex-col gap-0.5">
            {planlaegningLinks.map((link) => (
              <SidebarLink key={link.to} {...link} />
            ))}
          </div>
        </div>
      </nav>
    </aside>
  );
}
