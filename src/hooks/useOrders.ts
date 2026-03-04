import { useState, useEffect, useCallback } from "react";
import { format } from "date-fns";

export interface OrderItem {
  food_item: string;
  quantity: number;
}

export interface Order {
  id: number;
  customer_name: string;
  table_no: number;
  kitchen_status: string;
  created_at: string;
  items: OrderItem[];
}

export function useOrders() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchOrders = useCallback(async () => {
    try {
      const res = await fetch(
        "https://n8n.srv1302157.hstgr.cloud/webhook/kitchen-departmant-dashboard"
      );
      if (!res.ok) throw new Error("Failed to fetch orders");
      const data = await res.json();
      const list: Order[] = (Array.isArray(data) ? data : [data]).map((item: any) => ({
        id: item.id,
        customer_name: item.customer_name || "",
        table_no: item.table_no || 0,
        kitchen_status: (item.kitchen_status || "NEW").toUpperCase(),
        created_at: item.created_at || "",
        items: Array.isArray(item.items)
          ? item.items.map((i: any) => ({
              food_item: i.food_item || "Unknown item",
              quantity: Number(i.quantity) || 1,
            }))
          : [],
      }));
      setOrders(list);
      setError(null);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  const confirmOrder = useCallback(async (order: Order) => {
    try {
      const res = await fetch(
        "https://n8n.srv1302157.hstgr.cloud/webhook/confirm-order",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            id: order.id,
            customer_name: order.customer_name,
            table_no: order.table_no,
            items: order.items,
            status: "CONFIRMED",
          }),
        }
      );
      if (!res.ok) throw new Error("Failed to confirm order");
      setOrders((prev) =>
        prev.map((o) =>
          o.id === order.id ? { ...o, kitchen_status: "CONFIRMED" } : o
        )
      );
    } catch (err: any) {
      setError(err.message);
    }
  }, []);

  useEffect(() => {
    fetchOrders();
    const interval = setInterval(fetchOrders, 10000);
    return () => clearInterval(interval);
  }, [fetchOrders]);

  return { orders, loading, error, refetch: fetchOrders, confirmOrder };
}

export function formatOrderDate(dateStr: string): string {
  if (!dateStr) return "—";
  try {
    return format(new Date(dateStr), "MMM dd, hh:mm a");
  } catch {
    return dateStr;
  }
}
