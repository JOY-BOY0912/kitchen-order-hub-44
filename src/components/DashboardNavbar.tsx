import { LayoutGrid, RefreshCw } from "lucide-react";

interface DashboardNavbarProps {
  onRefresh: () => void;
  refreshing: boolean;
}

const DashboardNavbar = ({ onRefresh, refreshing }: DashboardNavbarProps) => {
  return (
    <nav className="w-full px-6 py-4 flex items-center justify-between"
      style={{
        background: "linear-gradient(135deg, hsl(var(--primary)), hsl(var(--secondary)))",
      }}
    >
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-lg bg-primary-foreground/20 flex items-center justify-center">
          <LayoutGrid className="w-5 h-5 text-primary-foreground" />
        </div>
        <div>
          <h1 className="text-xl text-primary-foreground leading-tight">FoodAdmin Dashboard</h1>
          <p className="text-sm text-primary-foreground/70 font-body">Auto-refreshes every 10s</p>
        </div>
      </div>
      <button
        onClick={onRefresh}
        className="flex items-center gap-2 px-4 py-2 rounded-lg bg-primary-foreground/20 text-primary-foreground text-sm font-heading hover:bg-primary-foreground/30 transition-colors"
      >
        <RefreshCw className={`w-4 h-4 ${refreshing ? "smooth-spin" : ""}`} />
        Refresh
      </button>
    </nav>
  );
};

export default DashboardNavbar;
