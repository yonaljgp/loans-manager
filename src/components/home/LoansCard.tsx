"use client";

import { useState } from "react";
import { Badge, Title, ActionIcon, Tooltip, Button } from "@mantine/core";
import {
  Calendar,
  Clock,
  Trash2,
  User,
  CheckCircle2,
  AlertCircle,
  Coins,
  Wallet,
} from "lucide-react";
import type { LoanType } from "@/types/LoansType";
import ModalDelete from "./ModalDelete";
import ModalLoans from "./ModalLoans";
import ModalPayCapital from "./ModalPayCapital";
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

function LoansCard({ loans }: LoansCardProps) {
  const [openedDelete, { open: openDelete, close: closeDelete }] =
    useDisclosure(false);
  const [selectedId, setSelectedId] = useState<number | null>(null);

  const [openedModal, { open: openModal, close: closeModal }] =
    useDisclosure(false);
  const [selectedLoan, setSelectedLoan] = useState<LoanType | null>(null);

  const [openedCapital, { open: openCapital, close: closeCapital }] =
    useDisclosure(false);
  const [selectedCapitalLoan, setSelectedCapitalLoan] =
    useState<LoanType | null>(null);

  const handleOpenDelete = (id: number) => {
    setSelectedId(id);
    openDelete();
  };

  const handleCloseDelete = () => {
    setSelectedId(null);
    closeDelete();
  };

  const handleOpenModal = (loan: LoanType) => {
    setSelectedLoan(loan);
    openModal();
  };

  const handleCloseModal = () => {
    setSelectedLoan(null);
    closeModal();
  };

  const handleOpenCapital = (loan: LoanType) => {
    setSelectedCapitalLoan(loan);
    openCapital();
  };

  const handleCloseCapital = () => {
    setSelectedCapitalLoan(null);
    closeCapital();
  };

  // Mantener sincronizado si la lista de préstamos se actualiza
  const activeLoan = selectedLoan
    ? (loans.find((l) => l.id === selectedLoan.id) ?? selectedLoan)
    : null;

  const activeCapitalLoan = selectedCapitalLoan
    ? (loans.find((l) => l.id === selectedCapitalLoan.id) ??
      selectedCapitalLoan)
    : null;

  return (
    <>
      <div className="w-full max-w-6xl">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {loans.map((loan) => {
            const isPaid = loan.status === "pagado";
            const interests = loan.interests ?? [];
            const paidInterestsCount = interests.filter((i) => i.paid).length;
            const totalInterestsCount = interests.length;
            const currentPaidCapital = loan.principalPayment || 0;
            const remainingCapital = Math.max(
              0,
              loan.capitalAmount - currentPaidCapital,
            );

            return (
              <div
                key={loan.id}
                className="card group relative flex flex-col justify-between p-5 rounded-2xl border hover:border-blue-500/40 hover:shadow-md transition-all duration-200"
              >
                {/* Cabecera: Iniciales, Nombre, ID, Estado y Eliminar */}
                <div className="flex items-start justify-between gap-3 mb-4">
                  <div className="flex items-center gap-3 min-w-0">
                    <div
                      onClick={() => handleOpenModal(loan)}
                      className="flex items-center justify-center w-10 h-10 rounded-xl bg-blue-500/10 text-blue-600 dark:text-blue-400 font-bold text-sm border border-blue-500/20 shrink-0 cursor-pointer hover:scale-105 transition-transform"
                    >
                      {getInitials(loan.name)}
                    </div>
                    <div className="min-w-0">
                      <Title
                        order={3}
                        className="text-base font-bold truncate group-hover:text-blue-500 transition-colors cursor-pointer"
                        title={loan.name}
                        onClick={() => handleOpenModal(loan)}
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

                    <Tooltip label="Eliminar préstamo" withArrow position="top">
                      <ActionIcon
                        variant="subtle"
                        color="red"
                        size="sm"
                        radius="md"
                        onClick={() => handleOpenDelete(loan.id)}
                        className="opacity-50 hover:opacity-100 transition-opacity hover:bg-red-500/10"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </ActionIcon>
                    </Tooltip>
                  </div>
                </div>

                {/* Monto de Capital e Interés */}
                <div className="mb-4">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs text-neutral-500 dark:text-neutral-400">
                      Monto prestado
                    </span>
                    {currentPaidCapital > 0 && (
                      <span className="text-[11px] text-amber font-semibold">
                        Saldo: {formatCurrency(remainingCapital)}
                      </span>
                    )}
                  </div>
                  <div className="flex items-baseline justify-between">
                    <span className="text-2xl font-extrabold tracking-tight">
                      {formatCurrency(loan.capitalAmount)}
                    </span>
                    <Badge
                      variant="outline"
                      color="blue"
                      size="xs"
                      radius="sm"
                      className="font-medium"
                    >
                      {loan.interestPercentage}% interés
                    </Badge>
                  </div>
                </div>

                {/* Metadatos: Frecuencia y Fecha de Inicio */}
                <div className="flex items-center justify-between text-xs text-neutral-500 dark:text-neutral-400 py-2.5 px-3 rounded-lg bg-neutral-500/5 mb-4">
                  <div className="flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-blue-500" />
                    <span className="capitalize font-medium text-foreground">
                      {loan.period}
                    </span>
                  </div>

                  <div className="flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-neutral-400" />
                    <span>
                      {paidInterestsCount}/{totalInterestsCount || 0} cuotas
                    </span>
                  </div>

                  <div className="flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-neutral-400" />
                    <span>{formatDate(loan.paymentDate)}</span>
                  </div>
                </div>

                {/* Acciones: Ver más y Abonar Capital */}
                <div className="flex flex-col md:flex-row gap-5 pt-4 border-t border-border/60">
                  <Button
                    variant="transparent"
                    color="var(--bg-active)"
                    fullWidth
                    size="xs"
                    radius="md"
                    leftSection={<Coins className="w-3.5 h-3.5" />}
                    onClick={() => handleOpenModal(loan)}
                  >
                    Ver más
                  </Button>

                  {!isPaid && (
                    <Button
                      variant="transparent"
                      color="var(--amber)"
                      size="xs"
                      fullWidth
                      radius="md"
                      disabled={isPaid}
                      leftSection={<Wallet className="w-3.5 h-3.5" />}
                      className="text-amber hover:bg-amber/10 transition-colors font-medium"
                      onClick={() => handleOpenCapital(loan)}
                    >
                      Abonar Capital
                    </Button>
                  )}
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
      <ModalLoans
        opened={openedModal}
        close={handleCloseModal}
        loan={activeLoan}
      />
      <ModalPayCapital
        opened={openedCapital}
        close={handleCloseCapital}
        loan={activeCapitalLoan}
      />
    </>
  );
}

export default LoansCard;
