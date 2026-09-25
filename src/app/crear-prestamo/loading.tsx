import NewLoansSkeleton from "@/components/createLoans/NewLoansSkeleton";

export default function Loading() {
  return (
    <div className="flex flex-col flex-1 items-center justify-start w-full  pb-24 md:pb-12 font-sans">
      <NewLoansSkeleton />
    </div>
  );
}
