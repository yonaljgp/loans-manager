"use client";

import { Modal, Button, Badge } from "@mantine/core";
import { Plus, Check, Calendar } from "lucide-react";
import type { LoanType, InterestType } from "@/types/LoansType";
import { toggleInterestPaid, addNextInterestWeek } from "@/utils/LocalStorage";
import {
  calculateInterestsSummary,
  getPeriodLabel,
} from "@/utils/interestCalculator";

type ModalInterestsProps = {
  loan: LoanType | null;
  opened: boolean;
  close: () => void;
};

function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(amount);
}

function formatDate(dateStr: string): string {
  if (!dateStr) return "Sin fecha";
  try {
    const [year, month, day] = dateStr.split("-");
    if (year && month && day) {
      const date = new Date(Number(year), Number(month) - 1, Number(day));
      return date.toLocaleDateString("es-ES", {
        day: "numeric",
        month: "short",
        year: "numeric",
      });
    }
    const d = new Date(dateStr);
    return isNaN(d.getTime())
      ? dateStr
      : d.toLocaleDateString("es-ES", {
          day: "numeric",
          month: "short",
          year: "numeric",
        });
  } catch {
    return dateStr;
  }
}

export default function ModalInterests({
  loan,
  opened,
  close,
}: ModalInterestsProps) {
  if (!loan) return null;

  const interests: InterestType[] = loan.interests ?? [];
  const summary = calculateInterestsSummary(interests);
  const periodSingular = getPeriodLabel(loan.period, 1);
  const periodPlural = getPeriodLabel(loan.period, 2);

  const handleToggle = (interestId: number | string, currentPaid: boolean) => {
    toggleInterestPaid(loan.id, interestId, !currentPaid);
  };

  const handleAddWeek = () => {
    addNextInterestWeek(loan.id);
  };

  return (
    <Modal
      opened={opened}
      onClose={close}
      title={
        <div className="flex flex-col">
          <span className="text-base font-bold">Control de Intereses</span>
          <span className="text-xs text-neutral-500">
            {loan.name} • {formatCurrency(loan.amount)} • {loan.period}
          </span>
        </div>
      }
      centered
      size="md"
      radius="lg"
    >
      <div className="flex flex-col gap-4">
        {/* Resumen rápido */}
        <div className="grid grid-cols-3 gap-2 p-3 bg-neutral-100 dark:bg-neutral-800 rounded-xl text-center">
          <div>
            <span className="text-[11px] text-neutral-500 block">
              Total {periodPlural}
            </span>
            <span className="text-sm font-bold">{summary.totalWeeks}</span>
          </div>
          <div>
            <span className="text-[11px] text-green-600 dark:text-green-400 block">
              Cobradas
            </span>
            <span className="text-sm font-bold text-green-600 dark:text-green-400">
              {summary.paidWeeks} ({formatCurrency(summary.paidAmount)})
            </span>
          </div>
          <div>
            <span className="text-[11px] text-amber-600 dark:text-amber-400 block">
              Pendientes
            </span>
            <span className="text-sm font-bold text-amber-600 dark:text-amber-400">
              {summary.pendingWeeks} ({formatCurrency(summary.pendingAmount)})
            </span>
          </div>
        </div>

        {/* Lista de cuotas */}
        <div className="flex flex-col gap-2 max-h-72 overflow-y-auto pr-1">
          {interests.length === 0 ? (
            <div className="text-center py-6 text-sm text-neutral-500">
              No hay cuotas de intereses registradas.
            </div>
          ) : (
            interests.map((item, idx) => (
              <div
                key={item.id || idx}
                className={`flex items-center justify-between p-3 rounded-xl border transition-all ${
                  item.paid
                    ? "bg-green-50/50 dark:bg-green-950/20 border-green-200 dark:border-green-800/40"
                    : "card border-border hover:border-active"
                }`}
              >
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => handleToggle(item.id, item.paid)}
                    className={`w-7 h-7 rounded-full flex items-center justify-center border transition-colors cursor-pointer ${
                      item.paid
                        ? "bg-green-500 border-green-500 text-white"
                        : "border-neutral-300 dark:border-neutral-600 hover:border-green-500 text-transparent"
                    }`}
                  >
                    <Check className="w-4 h-4" />
                  </button>

                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-bold">
                        {periodSingular} {item.weekNumber || idx + 1}
                      </span>
                      <Badge
                        size="xs"
                        variant="light"
                        color={item.paid ? "green" : "amber"}
                      >
                        {item.paid ? "Cobrado" : "Pendiente"}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-1.5 text-xs text-neutral-500 mt-0.5">
                      <Calendar className="w-3 h-3" />
                      <span>{formatDate(item.paymentDate)}</span>
                      {item.paid && item.paidAt && (
                        <span className="text-[10px] text-fg">
                          (Pagado: {formatDate(item.paidAt)})
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="text-right">
                  <span className="text-sm font-bold">
                    {formatCurrency(item.amount)}
                  </span>
                  <span className="text-[11px] text-neutral-400 block">
                    {item.rate}%
                  </span>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Acciones */}
        <div className="flex items-center justify-between pt-3 border-t border-border">
          <Button
            variant="light"
            color="blue"
            size="sm"
            leftSection={<Plus className="w-4 h-4" />}
            onClick={handleAddWeek}
          >
            Agregar {periodSingular} Siguiente
          </Button>

          <Button variant="default" size="sm" onClick={close}>
            Cerrar
          </Button>
        </div>
      </div>
    </Modal>
  );
}
