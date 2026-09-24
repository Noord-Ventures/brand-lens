import { Suspense } from "react";
import { Lens } from "@/components/Lens";

export default function Page() {
  return (
    <Suspense fallback={null}>
      <Lens />
    </Suspense>
  );
}
