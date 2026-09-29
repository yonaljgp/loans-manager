"use client";

import { Modal, Button, Badge, Divider } from "@mantine/core";
import {
  Plus,
  Check,
  Calendar,
  Clock,
  Coins,
  DollarSign,
  Percent,
  TrendingUp,
  FileText,
  CheckCircle2,
  AlertCircle,
  User,
} from "lucide-react";
import type { LoanType, InterestType } from "@/types/LoansType";
import { toggleInterestPaid, addNextInterestWeek } from "@/utils/LocalStorage";
import {
  calculateInterestAmount,
  calculateInterestsSummary,
  getPeriodLabel,
} from "@/utils/interestCalculator";

interface ModalInterestsProps {
  loan: LoanType | null;
  opened: boolean;
  close: () => void;
}

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

function getInitials(name: string): string {
  if (!name) return "CL";
  const parts = name.trim().split(" ");
  if (parts.length >= 2) {
    return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
  }
  return name.slice(0, 2).toUpperCase();
}

function getPeriodColor(period: LoanType["period"]) {
  switch (period) {
    case "Semanal":
      return "blue";
    case "Quincenal":
      return "indigo";
    case "Mensual":
      return "violet";
    default:
      return "gray";
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
  const isPaid = loan.status === "Pagado";

  const interestPerPeriod = calculateInterestAmount(
    loan.capitalAmount,
    loan.interestPercentage || 0,
  );

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
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-blue-500/10 text-blue-600 dark:text-blue-400 font-bold text-sm border border-blue-500/20 shrink-0">
            {getInitials(loan.name)}
          </div>
          <div>
            <span className="font-bold text-base block text-foreground leading-tight">
              {loan.name}
            </span>
            <div className="flex items-center gap-1.5 mt-0.5">
              <User className="w-3 h-3 text-neutral-400" />
              <span className="text-xs text-neutral-500 dark:text-neutral-400">
                Préstamo #{loan.id?.toString().slice(-4)}
              </span>
            </div>
          </div>
        </div>
      }
      size="lg"
      centered
      radius="lg"
      overlayProps={{
        backgroundOpacity: 0.55,
        blur: 3,
      }}
    >
      <div className="flex flex-col gap-4 pt-1">
        {/* Estado y Frecuencia */}
        <div className="flex items-center justify-between p-3 rounded-xl bg-neutral-500/5 border border-border">
          <div className="flex items-center gap-2">
            <span className="text-xs text-neutral-500 dark:text-neutral-400">
              Estado:
            </span>
            <Badge
              variant="light"
              color={isPaid ? "blue" : "amber"}
              size="sm"
              radius="md"
              leftSection={
                isPaid ? (
                  <CheckCircle2 className="w-3 h-3" />
                ) : (
                  <AlertCircle className="w-3 h-3" />
                )
              }
            >
              {isPaid ? "Pagado" : "Pendiente"}
            </Badge>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs text-neutral-500 dark:text-neutral-400">
              Frecuencia:
            </span>
            <Badge
              variant="dot"
              color={getPeriodColor(loan.period)}
              size="sm"
              className="capitalize"
            >
              {loan.period}
            </Badge>
          </div>
        </div>

        {/* Resumen Financiero Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
          <div className="p-3 rounded-xl border border-border bg-neutral-500/5">
            <div className="flex items-center gap-1 text-[11px] text-neutral-500 dark:text-neutral-400 mb-0.5">
              <DollarSign className="w-3 h-3 text-blue-500" />
              <span>Capital</span>
            </div>
            <div className="text-base font-bold">
              {formatCurrency(loan.capitalAmount)}
            </div>
          </div>

          <div className="p-3 rounded-xl border border-border bg-neutral-500/5">
            <div className="flex items-center gap-1 text-[11px] text-neutral-500 dark:text-neutral-400 mb-0.5">
              <Percent className="w-3 h-3 text-indigo-500" />
              <span>Interés</span>
            </div>
            <div className="text-base font-bold">
              {loan.interestPercentage}%
            </div>
            <span className="text-[10px] text-neutral-400 block">
              {formatCurrency(interestPerPeriod)} /{" "}
              {periodSingular.toLowerCase()}
            </span>
          </div>

          <div className="p-3 rounded-xl border border-border bg-neutral-500/5">
            <div className="flex items-center gap-1 text-[11px] text-neutral-500 dark:text-neutral-400 mb-0.5">
              <TrendingUp className="w-3 h-3" />
              <span>Capital Pendiente</span>
            </div>
            <div className="text-base font-bold ">
              {formatCurrency(
                loan.capitalAmount - (loan.principalPayment || 0),
              )}
            </div>
          </div>

          <div className="p-3 rounded-xl border border-border bg-neutral-500/5">
            <div className="flex items-center gap-1 text-[11px] text-neutral-500 dark:text-neutral-400 mb-0.5">
              <Coins className="w-3 h-3" />
              <span>Cobrado</span>
            </div>
            <div className="text-base font-bold ">
              {formatCurrency(summary.paidAmount)}
            </div>
            <span className="text-[10px] text-neutral-400 block">
              {summary.paidWeeks}/{summary.totalWeeks} cuotas
            </span>
          </div>
        </div>

        {/* Fecha de inicio y Nota */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs">
          <div className="p-3 rounded-xl border border-border bg-neutral-500/5 flex items-center justify-between">
            <span className="text-neutral-500 dark:text-neutral-400 flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-blue-500" />
              Fecha de Inicio:
            </span>
            <span className="font-medium text-foreground">
              {formatDate(loan.paymentDate)}
            </span>
          </div>

          <div className="p-3 rounded-xl border border-border bg-neutral-500/5 flex items-center justify-between">
            <span className="text-neutral-500 dark:text-neutral-400 flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-amber" />
              Pendiente de Cobro:
            </span>
            <span className="font-bold text-amber">
              {formatCurrency(summary.pendingAmount)} ({summary.pendingWeeks}{" "}
              {periodPlural.toLowerCase()})
            </span>
          </div>
        </div>

        {/* Observaciones / Notas si existen */}
        {loan.note && loan.note.trim() ? (
          <div className="p-3 rounded-xl border border-border bg-neutral-500/5">
            <div className="flex items-center gap-1.5 text-xs font-medium text-neutral-500 dark:text-neutral-400 mb-1">
              <FileText className="w-3.5 h-3.5" />
              <span>Nota:</span>
            </div>
            <p className="text-xs text-foreground whitespace-pre-wrap wrap-break-words">
              {loan.note}
            </p>
          </div>
        ) : null}

        <Divider
          label="Historial de Cuotas e Intereses"
          labelPosition="center"
        />

        {/* Lista de cuotas de intereses */}
        <div className="flex flex-col gap-2 max-h-64 overflow-y-auto pr-1">
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
                    ? "bg-bg-active/10 border-bg-active/30"
                    : "card border-border hover:border-active"
                }`}
              >
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => handleToggle(item.id, item.paid)}
                    title={
                      item.paid
                        ? "Marcar como pendiente"
                        : "Marcar como cobrado"
                    }
                    className={`w-7 h-7 rounded-full flex items-center justify-center border transition-colors cursor-pointer shrink-0 ${
                      item.paid
                        ? "bg-bg-active border-bg-active text-white"
                        : "border-neutral-300 dark:border-neutral-600 hover:border-bg-active text-transparent"
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
                        color={item.paid ? "blue" : "amber"}
                      >
                        {item.paid ? "Cobrado" : "Pendiente"}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-1.5 text-xs text-neutral-500 mt-0.5">
                      <Calendar className="w-3 h-3" />
                      <span>{formatDate(item.paymentDate)}</span>
                      {item.paid && item.paidAt && (
                        <span className="text-[10px] text-bg-active">
                          • Pagado: {formatDate(item.paidAt)}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="text-right">
                  <span className="text-sm font-bold block">
                    {formatCurrency(item.amount)}
                  </span>
                  <span className="text-[11px] text-neutral-400">
                    {item.rate}%
                  </span>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Acciones del pie de modal */}
        <div className="flex items-center justify-between pt-2 border-t border-border">
          <Button
            variant="light"
            color="blue"
            size="sm"
            radius="md"
            leftSection={<Plus className="w-4 h-4" />}
            onClick={handleAddWeek}
          >
            Agregar {periodSingular} Siguiente
          </Button>

          <Button variant="default" size="sm" radius="md" onClick={close}>
            Cerrar
          </Button>
        </div>
      </div>
    </Modal>
  );
}
