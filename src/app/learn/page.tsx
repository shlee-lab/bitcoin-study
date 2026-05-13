import { Suspense } from "react";
import { LayerStack } from "@/components/LayerStack";

export default function LearnPage() {
  return (
    <Suspense fallback={null}>
      <LayerStack />
    </Suspense>
  );
}
