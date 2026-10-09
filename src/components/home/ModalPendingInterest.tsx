import { Badge, Divider, Modal, ScrollArea } from "@mantine/core";
import type { LoanType, InterestType } from "@/types/LoansType";
import { AlertCircle, Clock, DollarSign, TrendingDown } from "lucide-react";

interface ModalPendingInterestProps {
  opened: boolean;
  handleClose: () => void;
  pendingInterest: LoanType[];
}

function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(amount);
}

function getInitials(name: string): string {
  if (!name) return "??";
  const parts = name.trim().split(" ");
  if (parts.length >= 2) return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
  return name.slice(0, 2).toUpperCase();
}

const totalAmountInterests = (interests: InterestType[]) =>
  interests.reduce((acc, i) => (!i.paid ? acc + i.amount : acc), 0);

const totalInstallmentsPending = (interests: InterestType[]) =>
  interests.reduce((acc, i) => (!i.paid ? acc + 1 : acc), 0);

const totalInstallments = (interests: InterestType[]) => interests.length;

function ModalPendingInterest({
  opened,
  handleClose,
  pendingInterest,
}: ModalPendingInterestProps) {
  const overdueInterests = pendingInterest.filter((l) =>
    l.interests?.some((i) => !i.paid),
  );

  const grandTotal = overdueInterests.reduce(
    (acc, loan) => acc + totalAmountInterests(loan.interests ?? []),
    0,
  );
  const grandInstallments = pendingInterest.reduce(
    (acc, loan) => acc + totalInstallmentsPending(loan.interests ?? []),
    0,
  );

  return (
    <Modal
      opened={opened}
      onClose={handleClose}
      size="lg"
      centered
      radius="lg"
      overlayProps={{ backgroundOpacity: 0.55, blur: 3 }}
      title={
        <div className="flex items-center gap-3">
          {/* Amber icon badge */}
          <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-amber/10 border border-amber/25 text-amber shrink-0">
            <AlertCircle className="w-5 h-5" />
          </div>
          <div>
            <span className="font-bold text-base block text-foreground leading-tight">
              Intereses Vencidos
            </span>
            <span className="text-xs text-neutral-500 dark:text-neutral-400">
              {pendingInterest.length}{" "}
              {pendingInterest.length === 1 ? "préstamo" : "préstamos"} con
              cuotas pendientes
            </span>
          </div>
        </div>
      }
    >
      <div className="flex flex-col gap-4 pt-1">
        {/* Summary banner */}
        <div className="grid grid-cols-2 gap-2.5">
          <div className="p-3 rounded-xl border border-amber/20 bg-amber/5">
            <div className="flex items-center gap-1 text-[11px] text-neutral-500 dark:text-neutral-400 mb-0.5">
              <DollarSign className="w-3 h-3 text-amber" />
              <span>Total por Cobrar</span>
            </div>
            <div className="text-base font-bold text-amber">
              {formatCurrency(grandTotal)}
            </div>
          </div>

          <div className="p-3 rounded-xl border border-border bg-neutral-500/5">
            <div className="flex items-center gap-1 text-[11px] text-neutral-500 dark:text-neutral-400 mb-0.5">
              <Clock className="w-3 h-3 text-amber" />
              <span>Cuotas Pendientes</span>
            </div>
            <div className="text-base font-bold">
              {grandInstallments}{" "}
              <span className="text-xs font-normal text-neutral-400">
                cuotas
              </span>
            </div>
          </div>
        </div>

        <Divider label="Detalle por Préstamo" labelPosition="center" />

        {/* Loan list */}
        <ScrollArea h={340} pr={4}>
          <div className="flex flex-col gap-2.5">
            {overdueInterests.length === 0 ? (
              <div className="flex justify-center py-10 text-md font-semibold text-neutral-500">
                No hay intereses vencidos 🎉
              </div>
            ) : (
              overdueInterests.map((loan) => {
                const pendingAmount = totalAmountInterests(
                  loan.interests ?? [],
                );
                const pendingCount = totalInstallmentsPending(
                  loan.interests ?? [],
                );
                return (
                  <div
                    key={loan.id}
                    className="flex flex-col gap-2.5 p-4 rounded-xl border transition-all card border-border hover:border-amber/40"
                  >
                    {/* Top row: avatar + name + amount */}
                    <div className="flex items-center justify-between gap-3">
                      <div className="flex items-center gap-3">
                        {/* Initials avatar */}
                        <div className="flex items-center justify-center w-9 h-9 rounded-xl bg-amber/10 text-amber font-bold text-sm border border-amber/20 shrink-0">
                          {getInitials(loan.name)}
                        </div>
                        <div>
                          <span className="font-semibold text-sm block leading-tight">
                            {loan.name}
                          </span>
                          <span className="text-[11px] text-neutral-500 dark:text-neutral-400">
                            Préstamo #{loan.id?.toString().slice(-4)}
                          </span>
                        </div>
                      </div>

                      {/* Pending amount */}
                      <div className="text-right">
                        <span className="text-sm font-bold text-amber block mr-2">
                          {formatCurrency(pendingAmount)}
                        </span>
                        <Badge
                          size="xs"
                          variant="light"
                          color="amber"
                          leftSection={<TrendingDown className="w-2.5 h-2.5" />}
                        >
                          {pendingCount}{" "}
                          {pendingCount === 1 ? "cuota" : "cuotas"}
                        </Badge>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </ScrollArea>
      </div>
    </Modal>
  );
}

export default ModalPendingInterest;
