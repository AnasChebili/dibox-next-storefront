"use client";
import AssetMarket from "@/components/asset-market";
import Break from "@/components/break";
import Works from "@/components/works";
import { useSearchParams } from "next/navigation";
import { useEffect, useRef } from "react";

export const dynamic = "force-dynamic";

export default function Home() {
  let category: string | null | undefined;
  if (typeof window !== "undefined") {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const searchParams = useSearchParams();
    category = searchParams.get("category");
  }

  const targetRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (category) {
      targetRef.current?.scrollIntoView({ behavior: "smooth" });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div>
      <AssetMarket></AssetMarket>
      <Break></Break>
      <div className="mx-[5%] my-24 " ref={targetRef}>
        <h1 className="text-5xl font-extralight">FEATURED WORKS</h1>
        <div>
          <Works
            initialFilter={category ? category : ""}
            user={undefined}
          ></Works>
        </div>
      </div>
    </div>
  );
}
