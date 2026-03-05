import { useState, useEffect, useCallback } from "react";
import { format } from "date-fns";

export interface OrderItem {
  food_item: string;
  quantity: number;
  price: number;
  total: number;
}

export interface Order {
  order_db_id: number;
  order_code: string;
  customer_name: string;
  phone: string;
  order_date: string;
  status: string;
  items: OrderItem[];
  order_total: number;
}

export function useOrders() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchOrders = useCallback(async () => {
    try {
      const res = await fetch(
        "https://n8n.srv1302157.hstgr.cloud/webhook/admin-dashboard-menu"
      );
      if (!res.ok) throw new Error("Failed to fetch orders");
      const data = await res.json();
      const list: Order[] = (Array.isArray(data) ? data : [data]).map((item: any) => ({
        order_db_id: item.order_db_id,
        order_code: item.order_code || "",
        customer_name: item.customer_name || "",
        phone: item.phone || "",
        status: (item.status || "PENDING").toUpperCase(),
        order_date: item.order_date || "",
        items: Array.isArray(item.items)
          ? item.items.map((i: any) => ({
              food_item: i.food_item || "Unknown item",
              quantity: Number(i.quantity) || 1,
              price: Number(i.price) || 0,
              total: Number(i.total) || 0,
            }))
          : [],
        order_total: Number(item.order_total) || 0,
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
            order_id: order.order_db_id,
          }),
        }
      );
      if (!res.ok) throw new Error("Failed to confirm order");
      setOrders((prev) =>
        prev.map((o) =>
          o.order_db_id === order.order_db_id ? { ...o, status: "CONFIRMED" } : o
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
