"use client";

import { useSyncExternalStore } from "react";
import { getLoansSnapshot, subscribeLoans } from "@/utils/LocalStorage";
import Header from "@/components/home/Header";
import LoansCard from "@/components/home/LoansCard";
import LoansEmpty from "@/components/home/LoansEmpty";
import CardSummary from "@/components/home/CardSummary";

const getServerSnapshot = () => null;

export default function Home() {
  const loans = useSyncExternalStore(
    subscribeLoans,
    getLoansSnapshot,
    getServerSnapshot,
  );
  if (loans === null) return null;

  return (
    <div className="flex flex-col flex-1 items-center justify-start w-full font-sans">
      {loans?.length === 0 ? (
        <LoansEmpty />
      ) : (
        <>
          <div className="mt-4 mb-10">
            <CardSummary loans={loans} />
          </div>
          <Header loans={loans} />
          <LoansCard loans={loans} />
        </>
      )}
    </div>
  );
}
