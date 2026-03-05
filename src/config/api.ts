// ===== API Configuration =====
// Update your API endpoints here

export const API = {
  /** Fetch all orders */
  GET_ORDERS: "https://n8n.srv1302157.hstgr.cloud/webhook/admin-dashboard-menu",

  /** Confirm a pending order (POST with { order_id }) */
  CONFIRM_ORDER: "https://n8n.srv1302157.hstgr.cloud/webhook/confirm-order",
} as const;
