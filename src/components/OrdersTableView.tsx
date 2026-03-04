import { User, Clock, Hash } from "lucide-react";
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
              <th className="text-center px-5 py-4 font-heading text-xs uppercase tracking-widest text-muted-foreground">Table</th>
              <th className="text-left px-5 py-4 font-heading text-xs uppercase tracking-widest text-muted-foreground">Items</th>
              <th className="text-right px-5 py-4 font-heading text-xs uppercase tracking-widest text-muted-foreground">Qty</th>
              <th className="text-left px-5 py-4 font-heading text-xs uppercase tracking-widest text-muted-foreground">Date & Time</th>
              <th className="text-center px-5 py-4 font-heading text-xs uppercase tracking-widest text-muted-foreground">Status</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order, index) => {
              const isConfirmed = order.kitchen_status === "CONFIRMED";
              const displayStatus = order.kitchen_status === "NEW" ? "PENDING" : order.kitchen_status;
              const totalQty = order.items.reduce((s, i) => s + i.quantity, 0);

              return (
                <tr
                  key={order.id + "-" + index}
                  className="border-b border-border/50 hover:bg-muted/30 transition-colors animate-slide-up"
                  style={{ animationDelay: `${index * 0.03}s`, animationFillMode: "backwards" }}
                >
                  <td className="px-5 py-4 font-heading text-primary text-sm">
                    #{order.id}
                  </td>
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-full bg-muted flex items-center justify-center shrink-0">
                        <User className="w-3.5 h-3.5 text-muted-foreground" />
                      </div>
                      <p className="font-heading text-sm">{order.customer_name}</p>
                    </div>
                  </td>
                  <td className="px-5 py-4 text-center font-heading">
                    {order.table_no}
                  </td>
                  <td className="px-5 py-4">
                    {order.items.length > 0 ? (
                      order.items.map((item, i) => (
                        <div key={i} className="text-sm">
                          <span>{item.food_item}</span>
                          <span className="text-muted-foreground ml-2">×{item.quantity}</span>
                        </div>
                      ))
                    ) : (
                      <span className="text-muted-foreground italic">No items</span>
                    )}
                  </td>
                  <td className="px-5 py-4 text-right text-lg font-heading">
                    {totalQty}
                  </td>
                  <td className="px-5 py-4 text-muted-foreground text-sm">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5" />
                      {formatOrderDate(order.created_at)}
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
