import { User, Clock, Phone } from "lucide-react";
import type { Order } from "@/hooks/useOrders";
import { formatOrderDate } from "@/hooks/useOrders";

interface OrdersTableViewProps {
  orders: Order[];
  onConfirm: (order: Order) => void;
}

const OrdersTableView = ({ orders, onConfirm }: OrdersTableViewProps) => {
  return (
    <div className="glass-card overflow-hidden animate-fade-in">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border">
              <th className="text-left px-5 py-4 font-heading text-xs uppercase tracking-widest text-muted-foreground">Order ID</th>
              <th className="text-left px-5 py-4 font-heading text-xs uppercase tracking-widest text-muted-foreground">Customer</th>
              <th className="text-left px-5 py-4 font-heading text-xs uppercase tracking-widest text-muted-foreground">Items</th>
              <th className="text-right px-5 py-4 font-heading text-xs uppercase tracking-widest text-muted-foreground">Price</th>
              <th className="text-right px-5 py-4 font-heading text-xs uppercase tracking-widest text-muted-foreground">Qty</th>
              <th className="text-right px-5 py-4 font-heading text-xs uppercase tracking-widest text-muted-foreground">Total</th>
              <th className="text-left px-5 py-4 font-heading text-xs uppercase tracking-widest text-muted-foreground">Date</th>
              <th className="text-center px-5 py-4 font-heading text-xs uppercase tracking-widest text-muted-foreground">Status</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order, index) => {
              const isConfirmed = order.status === "CONFIRMED";
              const displayStatus = order.status === "NEW" ? "PENDING" : order.status;

              return (
                <tr
                  key={order.order_db_id + "-" + index}
                  className="border-b border-border/50 hover:bg-muted/30 transition-colors animate-slide-up"
                  style={{ animationDelay: `${index * 0.03}s`, animationFillMode: "backwards" }}
                >
                  <td className="px-5 py-4 font-heading text-primary text-sm">
                    #{order.order_code}
                  </td>
                  <td className="px-5 py-4">
                    <div>
                      <p className="font-heading text-sm">{order.customer_name}</p>
                      <p className="text-xs text-muted-foreground flex items-center gap-1">
                        <Phone className="w-3 h-3" />
                        {order.phone}
                      </p>
                    </div>
                  </td>
                  <td className="px-5 py-4">
                    {order.items.length > 0 ? (
                      order.items.map((item, i) => (
                        <div key={i} className="text-sm">{item.food_item}</div>
                      ))
                    ) : (
                      <span className="text-muted-foreground italic">No items</span>
                    )}
                  </td>
                  <td className="px-5 py-4 text-right">
                    {order.items.map((item, i) => (
                      <div key={i} className="text-sm text-muted-foreground">₹{item.price}</div>
                    ))}
                  </td>
                  <td className="px-5 py-4 text-right">
                    {order.items.map((item, i) => (
                      <div key={i} className="text-sm text-muted-foreground">{item.quantity}</div>
                    ))}
                  </td>
                  <td className="px-5 py-4 text-right">
                    {order.items.map((item, i) => (
                      <div key={i} className="text-sm font-heading font-medium">₹{item.total}</div>
                    ))}
                    <div className="mt-1 pt-1 border-t border-border/50 text-sm font-heading font-medium text-primary">
                      ₹{order.order_total}
                    </div>
                  </td>
                  <td className="px-5 py-4 text-muted-foreground text-sm">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5" />
                      {formatOrderDate(order.order_date)}
                    </span>
                  </td>
                  <td className="px-5 py-4 text-center">
                    <span
                      className={`inline-block px-3 py-1 rounded-full text-xs font-heading tracking-wide ${
                        isConfirmed ? "status-success" : "status-warning"
                      }`}
                    >
                      {displayStatus}
                    </span>
                    {!isConfirmed && (
                      <button
                        onClick={() => onConfirm(order)}
                        className="block mx-auto mt-2 px-3 py-1 rounded-md bg-primary text-primary-foreground text-xs font-heading hover:opacity-90 transition-opacity"
                      >
                        Confirm
                      </button>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default OrdersTableView;
