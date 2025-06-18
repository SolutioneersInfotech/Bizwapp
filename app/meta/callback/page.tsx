import dynamic from "next/dynamic";

// Disable SSR for the component that uses useSearchParams
const MetaCallback = dynamic(() => import("./client-page"), {
  ssr: false,
});

export default function Page() {
  return <MetaCallback />;
}
