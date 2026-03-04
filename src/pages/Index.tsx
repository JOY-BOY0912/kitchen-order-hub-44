import { useState } from "react";
import { LayoutGrid, List, RefreshCw, Loader2, Package } from "lucide-react";
import DashboardNavbar from "@/components/DashboardNavbar";
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
      <DashboardNavbar onRefresh={handleRefresh} refreshing={refreshing} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        {/* Orders header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl text-foreground">Orders</h2>
            <p className="text-sm text-muted-foreground font-body">
              {orders.length} total orders
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handleRefresh}
              className="p-2.5 rounded-lg bg-card border border-border hover:bg-muted transition-colors"
            >
              <RefreshCw className={`w-4 h-4 text-muted-foreground ${refreshing ? "smooth-spin" : ""}`} />
            </button>
            <div className="flex rounded-lg border border-border overflow-hidden">
              <button
                onClick={() => setView("grid")}
                className={`p-2.5 transition-colors ${
                  view === "grid"
                    ? "bg-primary text-primary-foreground"
                    : "bg-card text-muted-foreground hover:bg-muted"
                }`}
              >
                <LayoutGrid className="w-4 h-4" />
              </button>
              <button
                onClick={() => setView("table")}
                className={`p-2.5 transition-colors ${
                  view === "table"
                    ? "bg-primary text-primary-foreground"
                    : "bg-card text-muted-foreground hover:bg-muted"
                }`}
              >
                <List className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Loading */}
        {loading && (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-8 h-8 text-primary smooth-spin" />
          </div>
        )}

        {/* Error */}
        {error && (
          <div className="glass-card p-6 text-center text-destructive">
            <p className="font-heading">Failed to load orders</p>
            <p className="text-sm text-muted-foreground mt-1">{error}</p>
          </div>
        )}

        {/* Empty */}
        {!loading && !error && orders.length === 0 && (
          <div className="glass-card p-12 text-center">
            <Package className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
            <p className="font-heading text-muted-foreground">No orders yet</p>
          </div>
        )}

        {/* Grid View */}
        {!loading && !error && orders.length > 0 && view === "grid" && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {orders.map((order, i) => (
              <OrderCard
                key={order.orderId + i}
                order={order}
                onConfirm={confirmOrder}
                index={i}
              />
            ))}
          </div>
        )}

        {/* Table View */}
        {!loading && !error && orders.length > 0 && view === "table" && (
          <OrdersTableView orders={orders} onConfirm={confirmOrder} />
        )}
      </div>
    </div>
  );
};

export default Index;
