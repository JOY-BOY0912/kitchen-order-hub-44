import { useState, useEffect, useCallback } from "react";

export interface OrderItem {
  name: string;
  price: number;
  quantity: number;
  total: number;
}

export interface Order {
  orderId: string;
  customerName: string;
  phone: string;
  items: OrderItem[];
  total: number;
  status: string;
  date: string;
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
      
      // Normalize data - handle both array and single object
      const normalized: Order[] = (Array.isArray(data) ? data : [data]).map((item: any) => ({
        orderId: item.orderId || item.order_id || item.id || "",
        customerName: item.customerName || item.customer_name || item.customer || "",
        phone: item.phone || item.phone_number || "",
        items: Array.isArray(item.items)
          ? item.items.map((i: any) => ({
              name: i.name || i.item || i.itemName || "",
              price: Number(i.price) || 0,
              quantity: Number(i.quantity) || Number(i.qty) || 1,
              total: Number(i.total) || Number(i.price) * (Number(i.quantity) || 1),
            }))
          : [],
        total: Number(item.total) || Number(item.totalAmount) || 0,
        status: (item.status || "PENDING").toUpperCase(),
        date: item.date || item.dateTime || item.created_at || "",
      }));
      
      setOrders(normalized);
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
            orderId: order.orderId,
            customerName: order.customerName,
            phone: order.phone,
            items: order.items,
            total: order.total,
          }),
        }
      );
      if (!res.ok) throw new Error("Failed to confirm order");
      
      // Update local state
      setOrders((prev) =>
        prev.map((o) =>
          o.orderId === order.orderId ? { ...o, status: "CONFIRMED" } : o
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
