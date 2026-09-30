// /src/app/(client)/cart/checkout/page.tsx

import { auth } from "@/auth";
import ConfirmOrderComponent from "./ConfirmOrderComponent";

export default async function CheckoutPage() {
  const session = await auth();

  return (
    <ConfirmOrderComponent
      userId={session?.user?.id || undefined}
      userName={session?.user?.name || undefined}
      userEmail={session?.user?.email || undefined}
    />
  );
}
