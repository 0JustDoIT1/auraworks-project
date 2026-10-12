"use client";

import { useState } from "react";
import { ShoppingCart } from "lucide-react";
import { useCart } from "../hooks/useCart";
import CountBadge from "@/components/ui/CountBadge";
import CartDrawer from "./CartDrawer";

export default function CartButton() {
  const [isOpen, setIsOpen] = useState(false);
  const { itemCount } = useCart();

  return (
    <>
      <button
        type="button"
        aria-label={itemCount > 0 ? `장바구니 ${itemCount}개` : "장바구니"}
        onClick={() => setIsOpen(true)}
        className="relative cursor-pointer transition-colors hover:text-primary"
      >
        <ShoppingCart size={24} strokeWidth={1.75} />
        <CountBadge count={itemCount} />
      </button>

      <CartDrawer open={isOpen} onClose={() => setIsOpen(false)} />
    </>
  );
}
