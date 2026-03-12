import { Suspense } from "react";
import VerifyClient from "./VerifyClient";

export default function VerifyPage() {
  return (
    <Suspense fallback={<div className="pt-45 text-center">Loading...</div>}>
      <VerifyClient />
    </Suspense>
  );
}