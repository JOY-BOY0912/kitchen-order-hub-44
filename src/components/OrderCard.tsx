import { User, Clock, Phone } from "lucide-react";
import type { Order } from "@/hooks/useOrders";
import { formatOrderDate } from "@/hooks/useOrders";

interface OrderCardProps {
  order: Order;
  onConfirm: (order: Order) => void;
  index: number;
}

const OrderCard = ({ order, onConfirm, index }: OrderCardProps) => {
  const isConfirmed = order.status === "CONFIRMED";
  const displayStatus = order.status === "NEW" ? "PENDING" : order.status;

  return (
    <div
      className="glass-card p-5 flex flex-col gap-4 animate-slide-up"
      style={{ animationDelay: `${index * 0.05}s`, animationFillMode: "backwards" }}
    >
      {/* Header */}
      <div className="flex items-center justify-between">
        <span className="text-sm font-heading text-primary font-medium">
          #{order.order_code}
        </span>
        <span
          className={`px-3 py-1 rounded-full text-xs font-heading tracking-wide ${
            isConfirmed ? "status-success" : "status-warning"
          }`}
        >
          ● {displayStatus}
        </span>
      </div>

      {/* Customer */}
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center">
          <User className="w-4 h-4 text-muted-foreground" />
        </div>
        <div>
          <p className="text-sm font-heading font-medium">{order.customer_name}</p>
          <p className="text-xs text-muted-foreground flex items-center gap-1">
            <Phone className="w-3 h-3" />
            {order.phone}
          </p>
        </div>
      </div>

      {/* Items Table */}
      <div>
        <div className="grid grid-cols-[1fr_auto_auto_auto] gap-x-3 text-[10px] font-heading uppercase tracking-widest text-muted-foreground mb-2 px-1">
          <span>Item</span>
          <span className="text-right">Price</span>
          <span className="text-right">Qty</span>
          <span className="text-right">Total</span>
        </div>
        {order.items.length > 0 ? (
          order.items.map((item, i) => (
            <div
              key={i}
              className="grid grid-cols-[1fr_auto_auto_auto] gap-x-3 text-sm py-1.5 px-1 border-t border-border/50"
            >
              <span className="font-body text-foreground">{item.food_item}</span>
              <span className="text-right text-muted-foreground">₹{item.price}</span>
              <span className="text-right text-muted-foreground">{item.quantity}</span>
              <span className="text-right font-heading font-medium">₹{item.total}</span>
            </div>
          ))
        ) : (
          <p className="text-sm text-muted-foreground italic px-1">No items available</p>
        )}
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between mt-auto pt-3 border-t border-border/50">
        <p className="text-xs text-muted-foreground flex items-center gap-1">
          <Clock className="w-3 h-3" />
          {formatOrderDate(order.order_date)}
        </p>
        <span className="px-3 py-1 rounded-lg bg-primary/10 text-primary text-sm font-heading font-medium">
          ₹{order.order_total}
        </span>
      </div>

      {/* Confirm button */}
      {!isConfirmed && (
        <button
          onClick={() => onConfirm(order)}
          className="w-full py-2.5 rounded-lg bg-primary text-primary-foreground font-heading text-sm tracking-wide hover:opacity-90 transition-opacity shadow-md"
        >
          Confirm Order
        </button>
      )}
    </div>
  );
};

export default OrderCard;
