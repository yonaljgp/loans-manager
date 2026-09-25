import LoansSkeleton from "@/components/home/LoansSkeleton";

export default function Loading() {
  return (
    <div className="flex flex-col flex-1 items-center justify-start w-full md:pt-24 pb-24 md:pb-12 font-sans">
      <LoansSkeleton />
    </div>
  );
}
