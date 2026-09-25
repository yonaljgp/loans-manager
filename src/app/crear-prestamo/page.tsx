"use client";

import Header from "@/components/createLoans/Header";
import LoansForm from "@/components/createLoans/LoansForm";

function CreateLoans() {
  return (
    <div className="flex-1 w-full flex flex-col items-center justify-center px-4 py-6">
      <div className="w-full max-w-xl flex flex-col justify-center items-center my-auto">
        <Header />
        <LoansForm />
      </div>
    </div>
  );
}

export default CreateLoans;
