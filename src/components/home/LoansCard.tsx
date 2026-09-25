"use client";

import { useState } from "react";
import { Badge, Title, ActionIcon, Tooltip, Button } from "@mantine/core";
import {
  Calendar,
  Clock,
  Trash2,
  TrendingUp,
  User,
  CheckCircle2,
  AlertCircle,
  Coins,
} from "lucide-react";
import type { LoanType } from "@/types/LoansType";
import { getPeriodLabel } from "@/utils/interestCalculator";
import ModalDelete from "./ModalDelete";
import ModalInterests from "./ModalInterests";
import { useDisclosure } from "@mantine/hooks";

type LoansCardProps = {
  loans: LoanType[];
};

function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("es-DO", {
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
    case "semanal":
      return "blue";
    case "quincenal":
      return "indigo";
    case "mensual":
      return "violet";
    default:
      return "gray";
  }
}

function LoansCard({ loans }: LoansCardProps) {
  const [openedDelete, { open: openDelete, close: closeDelete }] =
    useDisclosure(false);
  const [selectedId, setSelectedId] = useState<number | null>(null);

  const [openedInterests, { open: openInterests, close: closeInterests }] =
    useDisclosure(false);
  const [selectedLoanForInterests, setSelectedLoanForInterests] =
    useState<LoanType | null>(null);

  const handleOpenDelete = (id: number) => {
    setSelectedId(id);
    openDelete();
  };

  const handleCloseDelete = () => {
    setSelectedId(null);
    closeDelete();
  };

  const handleOpenInterests = (loan: LoanType) => {
    setSelectedLoanForInterests(loan);
    openInterests();
  };

  const handleCloseInterests = () => {
    setSelectedLoanForInterests(null);
    closeInterests();
  };

  // Keep selectedLoanForInterests synchronized if loans list updates
  const activeLoanForInterests = selectedLoanForInterests
    ? (loans.find((l) => l.id === selectedLoanForInterests.id) ??
      selectedLoanForInterests)
    : null;

  return (
    <>
      <div className="w-full max-w-6xl ">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {loans.map((loan) => {
            const interestVal =
              (loan.amount * (loan.interestPercentage || 0)) / 100;
            const totalAmount = loan.amount + interestVal;
            const isPaid = loan.status === "pagado";
            const interests = loan.interests ?? [];
            const paidInterestsCount = interests.filter((i) => i.paid).length;
            const totalInterestsCount = interests.length;

            return (
              <div
                key={loan.id}
                className="card group relative flex flex-col justify-between p-6 rounded-2xl border hover:border-blue-500/50 hover:shadow-lg transition-all duration-300"
              >
                {/* Encabezado: Cliente y Acciones */}
                <div className="flex items-start justify-between gap-3 mb-4">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="flex items-center justify-center w-11 h-11 rounded-xl bg-linear-to-br from-blue-500/15 to-blue-600/5 text-blue-600 dark:text-blue-400 font-bold text-sm border border-blue-500/20 shrink-0">
                      {getInitials(loan.name)}
                    </div>
                    <div className="min-w-0">
                      <Title
                        order={3}
                        className="text-base font-bold truncate group-hover:text-blue-500 transition-colors"
                        title={loan.name}
                      >
                        {loan.name}
                      </Title>
                      <div className="flex items-center gap-1.5 mt-0.5">
                        <User className="w-3.5 h-3.5 text-neutral-400" />
                        <span className="text-xs text-neutral-500 dark:text-neutral-400">
                          ID: #{loan.id?.toString().slice(-4)}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-1">
                    <Badge
                      variant="light"
                      color={isPaid ? "green" : "amber"}
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

                    <Tooltip label="Eliminar préstamo" withArrow position="top">
                      <ActionIcon
                        variant="subtle"
                        color="red"
                        size="sm"
                        radius="md"
                        onClick={() => handleOpenDelete(loan.id)}
                        className="opacity-60 group-hover:opacity-100 transition-opacity hover:bg-red-500/10"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </ActionIcon>
                    </Tooltip>
                  </div>
                </div>

                {/* Contenido Principal: Monto e Interés */}
                <div className="card my-4 p-4 ">
                  <div className="flex items-baseline justify-between mb-1">
                    <span className="text-xs text-neutral-500 dark:text-neutral-400 font-medium">
                      Monto prestado
                    </span>
                    <Badge
                      variant="outline"
                      color="blue"
                      size="xs"
                      radius="sm"
                      className="font-medium"
                    >
                      +{loan.interestPercentage}% interés
                    </Badge>
                  </div>

                  <div className="text-2xl font-extrabold tracking-tight">
                    {formatCurrency(loan.amount)}
                  </div>

                  <div className="mt-3 pt-2.5 border-t border-border/70 flex items-center justify-between text-xs">
                    <span className="text-neutral-500 dark:text-neutral-400 flex items-center gap-1">
                      <TrendingUp className="w-3.5 h-3.5 text-green-500" />
                      Total a cobrar:
                    </span>
                    <span className="font-bold">
                      {formatCurrency(totalAmount)}
                    </span>
                  </div>
                </div>

                {/* Semanas / Cuotas de Intereses */}
                <div className="mb-4">
                  <Button
                    variant="light"
                    color="blue"
                    fullWidth
                    size="xs"
                    radius="md"
                    leftSection={<Coins className="w-3.5 h-3.5" />}
                    onClick={() => handleOpenInterests(loan)}
                  >
                    Ver {getPeriodLabel(loan.period, 2)} ({paidInterestsCount}/
                    {totalInterestsCount || 0} cobradas)
                  </Button>
                </div>

                {/* Pie de Tarjeta: Plazo y Fecha de Inicio */}
                <div className="mt-auto pt-3 border-t border-border/60 flex items-center justify-between text-xs text-neutral-500 dark:text-neutral-400">
                  <div className="flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-blue-500" />
                    <Badge
                      variant="dot"
                      color={getPeriodColor(loan.period)}
                      size="sm"
                      className="capitalize"
                    >
                      {loan.period}
                    </Badge>
                  </div>

                  <div className="flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-neutral-400" />
                    <span>{formatDate(loan.paymentDate)}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
      <ModalDelete
        opened={openedDelete}
        close={handleCloseDelete}
        id={selectedId}
      />
      <ModalInterests
        opened={openedInterests}
        close={handleCloseInterests}
        loan={activeLoanForInterests}
      />
    </>
  );
}

export default LoansCard;
