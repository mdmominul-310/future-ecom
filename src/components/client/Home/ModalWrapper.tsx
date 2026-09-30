"use client";

import { useEffect, useState } from "react";
import DiscountModal from "./DiscountModal";

export default function ModalWrapper() {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) return null;

  return <DiscountModal />;
}
