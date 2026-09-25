import { Badge, Text } from "@mantine/core";
import { Wallet, Clock, CheckCircle2, TrendingUp } from "lucide-react";
import type { LoanType } from "@/types/LoansType";

interface Props {
  loans: LoanType[];
}

function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(amount);
}

function CardSummary({ loans }: Props) {
  const totalAmount = loans.reduce(
    (acc, loan) => acc + (loan.capitalAmount || 0),
    0,
  );

  const pendingLoans = loans.filter((l) => l.status !== "pagado");
  const totalPending = pendingLoans.reduce(
    (acc, loan) => acc + (loan.capitalAmount || 0),
    0,
  );

  const paidLoans = loans.filter((l) => l.status === "pagado");
  const totalInterestsPending = pendingLoans.reduce((acc, loan) => {
    const loanPendingAmount = (loan.interests || []).reduce(
      (sum, interest) => (!interest.paid ? sum + (interest.amount || 0) : sum),
      0,
    );
    return acc + loanPendingAmount;
  }, 0);

  const stats = [
    {
      title: "Capital Prestado",
      amount: totalAmount,
      subtitle: `${loans.length} ${loans.length === 1 ? "préstamo total" : "préstamos totales"}`,
      icon: Wallet,
      badgeText: "Cartera Total",
      badgeColor: "blue",
      colorClass: "text-blue-600 dark:text-blue-400",
      bgClass: "bg-linear-to-br from-blue-500/15 to-blue-600/5",
      borderClass: "border-blue-500/20",
      hoverBorder: "hover:border-blue-500/50",
    },
    {
      title: "Por Cobrar",
      amount: totalPending,
      subtitle: `${pendingLoans.length} ${pendingLoans.length === 1 ? "préstamo activo" : "préstamos activos"}`,
      icon: Clock,
      badgeText: "En curso",
      badgeColor: "amber",
      colorClass: "text-amber-600 dark:text-amber-400",
      bgClass: "bg-linear-to-br from-amber-500/15 to-amber-600/5",
      borderClass: "border-amber-500/20",
      hoverBorder: "hover:border-amber-500/50",
    },
    {
      title: "Intereses Pendientes",
      amount: totalInterestsPending,
      subtitle: ` Cuotas Pendientes`,
      icon: CheckCircle2,
      badgeText: `${paidLoans.length} saldados`,
      badgeColor: "emerald",
      colorClass: "text-emerald-600 dark:text-emerald-400",
      bgClass: "bg-linear-to-br from-emerald-500/15 to-emerald-600/5",
      borderClass: "border-emerald-500/20",
      hoverBorder: "hover:border-emerald-500/50",
    },
  ];

  return (
    <div className="w-full max-w-6xl mx-auto px-4 py-4 ">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-5">
        {stats.map((item, index) => {
          const Icon = item.icon;
          return (
            <div
              key={index}
              className={`card group relative flex flex-col justify-between p-5 md:p-6 rounded-2xl border transition-all duration-300 hover:shadow-lg ${item.hoverBorder}`}
            >
              <div className="flex items-start justify-between gap-3 mb-3">
                <div className="flex items-center gap-3">
                  <div
                    className={`flex items-center justify-center w-11 h-11 rounded-xl ${item.bgClass} ${item.colorClass} border ${item.borderClass} shrink-0 transition-transform group-hover:scale-105`}
                  >
                    <Icon className="w-5 h-5" />
                  </div>
                  <div>
                    <Text className="text-xs font-semibold text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">
                      {item.title}
                    </Text>
                    <div className="text-xl md:text-2xl font-extrabold tracking-tight mt-0.5">
                      {formatCurrency(item.amount)}
                    </div>
                  </div>
                </div>

                <Badge
                  variant="light"
                  color={item.badgeColor}
                  size="sm"
                  radius="md"
                  className="shrink-0 font-medium"
                >
                  {item.badgeText}
                </Badge>
              </div>

              <div className="pt-3 mt-1 border-t border-border/60 flex items-center justify-between text-xs text-neutral-500 dark:text-neutral-400">
                <span className="flex items-center gap-1.5 font-medium">
                  {item.subtitle}
                </span>
                <TrendingUp className="w-3.5 h-3.5 opacity-50 group-hover:opacity-100 transition-opacity" />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default CardSummary;
