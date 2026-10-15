export const ROUTES = {
  home: "/",
  shop: "/products",
  track: "/track-order",
  myOrders: "/my-orders",
  refundPolicy: "/refund-policy",
  cart: "/cart",
  login: "/login",
} as const;

export const MAIN_NAV_LINKS = [
  { href: ROUTES.shop, label: "ইলিশ কিনুন" },
  { href: ROUTES.track, label: "অর্ডার ট্র্যাক" },
  { href: ROUTES.myOrders, label: "আমার অর্ডার" },
  { href: ROUTES.refundPolicy, label: "রিফান্ড নীতি" },
] as const;
