import { useState } from "react";
import { LayoutGrid, List, RefreshCw, Loader2, Package } from "lucide-react";
import OrderCard from "@/components/OrderCard";
import OrdersTableView from "@/components/OrdersTableView";
import { useOrders } from "@/hooks/useOrders";

const Index = () => {
  const { orders, loading, error, refetch, confirmOrder } = useOrders();
  const [refreshing, setRefreshing] = useState(false);
  const [view, setView] = useState<"grid" | "table">("grid");

  const handleRefresh = async () => {
    setRefreshing(true);
    try {
      await refetch();
    } finally {
      setTimeout(() => setRefreshing(false), 800);
    }
  };

  return (
    <div className="min-h-screen animate-fade-in">
      {/* Orders Navbar */}
      <nav
        className="w-full px-6 py-4 flex items-center justify-between"
        style={{
          background: "linear-gradient(135deg, hsl(var(--primary)), hsl(140, 22%, 45%))",
        }}
      >
        <div>
          <h1 className="text-xl text-primary-foreground leading-tight">Orders</h1>
          <p className="text-sm text-primary-foreground/70 font-body">
            {orders.length} total orders
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={handleRefresh}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-primary-foreground/20 text-primary-foreground text-sm font-heading hover:bg-primary-foreground/30 transition-colors"
          >
            <RefreshCw className={`w-4 h-4 ${refreshing ? "smooth-spin" : ""}`} />
            Refresh
          </button>
          <div className="flex rounded-lg border border-primary-foreground/30 overflow-hidden">
            <button
              onClick={() => setView("grid")}
              className={`p-2.5 transition-colors ${
                view === "grid"
                  ? "bg-primary-foreground/30 text-primary-foreground"
                  : "text-primary-foreground/60 hover:bg-primary-foreground/10"
              }`}
            >
              <LayoutGrid className="w-4 h-4" />
            </button>
            <button
              onClick={() => setView("table")}
              className={`p-2.5 transition-colors ${
                view === "table"
                  ? "bg-primary-foreground/30 text-primary-foreground"
                  : "text-primary-foreground/60 hover:bg-primary-foreground/10"
              }`}
            >
              <List className="w-4 h-4" />
            </button>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        {loading && (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-8 h-8 text-primary smooth-spin" />
          </div>
        )}

        {error && (
          <div className="glass-card p-6 text-center text-destructive">
            <p className="font-heading">Failed to load orders</p>
            <p className="text-sm text-muted-foreground mt-1">{error}</p>
          </div>
        )}

        {!loading && !error && orders.length === 0 && (
          <div className="glass-card p-12 text-center">
            <Package className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
            <p className="font-heading text-muted-foreground">No orders yet</p>
          </div>
        )}

        {!loading && !error && orders.length > 0 && view === "grid" && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {orders.map((order, i) => (
              <OrderCard
                key={order.order_db_id + "-" + i}
                order={order}
                onConfirm={confirmOrder}
                index={i}
              />
            ))}
          </div>
        )}

        {!loading && !error && orders.length > 0 && view === "table" && (
          <OrdersTableView orders={orders} onConfirm={confirmOrder} />
        )}
      </div>
    </div>
  );
};

export default Index;
