"use client";
import dynamic from "next/dynamic";
// import MetaCallback from "@/components/meta/MetaCallback";
// Disable SSR for the component that uses useSearchParams
const DynamicMetaCallback = dynamic(() => import("@/components/meta/MetaCallback"), {
  ssr: false,
});

export default function Page() {
  return <DynamicMetaCallback />;
}
