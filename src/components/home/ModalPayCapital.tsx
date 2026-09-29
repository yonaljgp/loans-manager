"use client";

import { useState } from "react";
import {
  Modal,
  Button,
  NumberInput,
  Badge,
  Group,
  Progress,
  Divider,
} from "@mantine/core";
import {
  Wallet,
  TrendingDown,
  Sparkles,
  CheckCircle2,
  User,
} from "lucide-react";
import type { LoanType } from "@/types/LoansType";
import { payLoanCapital } from "@/utils/LocalStorage";
import {
  calculateInterestAmount,
  getPeriodLabel,
} from "@/utils/interestCalculator";
import { toast } from "react-toastify";

interface ModalPayCapitalProps {
  loan: LoanType | null;
  opened: boolean;
  close: () => void;
}

function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("es-DO", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(amount);
}

function ModalPayCapital({ loan, opened, close }: ModalPayCapitalProps) {
  const [amount, setAmount] = useState<number | string>("");

  const handleClose = () => {
    setAmount("");
    close();
  };

  if (!loan) return null;

  const initialCapital = loan.capitalAmount;
  const currentPaid = loan.principalPayment || 0;
  const remainingCapital = Math.max(0, initialCapital - currentPaid);
  const isFullyPaid = remainingCapital === 0 || loan.status === "Pagado";

  const numAmount = typeof amount === "number" ? amount : Number(amount) || 0;
  const newRemainingCapital = Math.max(0, remainingCapital - numAmount);
  const isLiquidation = numAmount >= remainingCapital && remainingCapital > 0;

  // Cálculo de nuevos intereses proyectados tras el abono
  const currentInterestPerPeriod = calculateInterestAmount(
    remainingCapital,
    loan.interestPercentage || 0,
  );
  const newInterestPerPeriod = calculateInterestAmount(
    newRemainingCapital,
    loan.interestPercentage || 0,
  );

  const periodLabel = getPeriodLabel(loan.period, 1).toLowerCase();

  // Porcentajes para la barra de progreso
  const currentProgressPercent =
    initialCapital > 0
      ? Math.min(100, Math.round((currentPaid / initialCapital) * 100))
      : 0;
  const newProgressPercent =
    initialCapital > 0
      ? Math.min(
          100,
          Math.round(((currentPaid + numAmount) / initialCapital) * 100),
        )
      : 0;

  const handleSetPreset = (fraction: number) => {
    const val = Math.round(remainingCapital * fraction);
    setAmount(val);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (numAmount <= 0) {
      toast.error("Ingresa un monto válido mayor a 0");
      return;
    }
    if (numAmount > remainingCapital) {
      toast.error(
        `El monto no puede superar el saldo pendiente (${formatCurrency(
          remainingCapital,
        )})`,
      );
      return;
    }

    payLoanCapital(loan.id, numAmount);

    if (isLiquidation) {
      toast.success(
        `¡Préstamo liquidado con éxito! Se abonó ${formatCurrency(numAmount)}`,
      );
    } else {
      toast.success(
        `Abono de ${formatCurrency(numAmount)} realizado con éxito`,
      );
    }

    setAmount("");
    close();
  };

  return (
    <Modal
      opened={opened}
      onClose={handleClose}
      title={
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-amber/15 text-amber font-bold text-sm border border-amber/25 shrink-0">
            <Wallet className="w-5 h-5" />
          </div>
          <div>
            <span className="font-bold text-base block text-foreground leading-tight">
              Abonar a Capital
            </span>
            <span className="text-xs text-neutral-500 dark:text-neutral-400 flex items-center gap-1.5 mt-0.5">
              <User className="w-3 h-3" />
              {loan.name} • ID: #{loan.id?.toString().slice(-4)}
            </span>
          </div>
        </div>
      }
      size="md"
      centered
      radius="lg"
      overlayProps={{
        backgroundOpacity: 0.55,
        blur: 3,
      }}
    >
      {isFullyPaid ? (
        <div className="text-center py-6 space-y-3">
          <div className="w-12 h-12 rounded-full bg-bg-active/10 text-bg-active mx-auto flex items-center justify-center">
            <CheckCircle2 className="w-7 h-7" />
          </div>
          <h3 className="font-bold text-lg">Préstamo Liquidado</h3>
          <p className="text-xs text-neutral-500 max-w-xs mx-auto">
            Este préstamo ya no tiene saldo pendiente de capital.
          </p>
          <Button
            variant="default"
            onClick={handleClose}
            radius="md"
            className="mt-4"
          >
            Cerrar
          </Button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="flex flex-col gap-4 pt-1">
          {/* Tarjeta de Estado y Resumen del Capital */}
          <div className="p-4 rounded-xl bg-neutral-500/5 border border-border space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs text-neutral-500 dark:text-neutral-400 font-medium">
                Saldo de Capital Pendiente
              </span>
              <Badge variant="light" color="amber" size="sm" radius="md">
                {currentProgressPercent}% amortizado
              </Badge>
            </div>

            <div className="flex items-baseline justify-between">
              <div className="text-2xl font-extrabold tracking-tight text-foreground">
                {formatCurrency(remainingCapital)}
              </div>
              <span className="text-xs text-neutral-400">
                de {formatCurrency(initialCapital)} inicial
              </span>
            </div>

            {/* Barra de progreso de amortización */}
            <div className="space-y-1">
              <Progress
                value={
                  numAmount > 0 ? newProgressPercent : currentProgressPercent
                }
                color="amber"
                size="sm"
                radius="xl"
              />
              <div className="flex justify-between text-[10px] text-neutral-400">
                <span>Abonado: {formatCurrency(currentPaid)}</span>
                <span>
                  {numAmount > 0 && (
                    <span className="text-amber font-medium">
                      + {formatCurrency(numAmount)} con este abono
                    </span>
                  )}
                </span>
              </div>
            </div>
          </div>

          {/* Campo de ingreso de monto */}
          <div className="space-y-2">
            <NumberInput
              label="Monto a abonar"
              placeholder="0.00"
              required
              prefix="$"
              hideControls
              value={amount}
              onChange={(val) => setAmount(val)}
              min={1}
              max={remainingCapital}
              classNames={{
                input:
                  "input-white font-semibold hover:border-gray-400 text-base py-2.5",
              }}
            />

            {/* Botones de montos sugeridos */}
            <div className="flex gap-1.5 pt-1">
              <Button
                type="button"
                variant="subtle"
                color="gray"
                size="xs"
                radius="md"
                onClick={() => handleSetPreset(0.25)}
                className="flex-1 text-[11px]"
              >
                25%
              </Button>
              <Button
                type="button"
                variant="subtle"
                color="gray"
                size="xs"
                radius="md"
                onClick={() => handleSetPreset(0.5)}
                className="flex-1 text-[11px]"
              >
                50%
              </Button>
              <Button
                type="button"
                variant="light"
                color="amber"
                size="xs"
                radius="md"
                onClick={() => handleSetPreset(1)}
                className="flex-1 text-[11px] font-semibold"
                leftSection={<Sparkles className="w-3 h-3" />}
              >
                Liquidar Todo
              </Button>
            </div>
          </div>

          {/* Proyección en vivo del nuevo saldo e interés */}
          {numAmount > 0 && (
            <div className="p-3.5 rounded-xl border border-amber/30 bg-amber/5 space-y-2 transition-all">
              <span className="text-xs font-semibold text-amber flex items-center gap-1.5">
                <TrendingDown className="w-3.5 h-3.5" />
                Impacto de este abono
              </span>

              <div className="grid grid-cols-2 gap-2 text-xs pt-1">
                <div className="p-2 rounded-lg bg-background/60 border border-border">
                  <span className="text-[11px] text-neutral-400 block mb-0.5">
                    Nuevo Saldo Pendiente:
                  </span>
                  <span className="font-bold text-foreground">
                    {formatCurrency(newRemainingCapital)}
                  </span>
                </div>

                <div className="p-2 rounded-lg bg-background/60 border border-border">
                  <span className="text-[11px] text-neutral-400 block mb-0.5">
                    Nuevo Interés / {periodLabel}:
                  </span>
                  <div className="flex items-center gap-1 font-bold ">
                    <span>{formatCurrency(newInterestPerPeriod)}</span>
                  </div>
                </div>
              </div>

              {isLiquidation && (
                <div className="flex items-center gap-2 text-xs font-semibold text-bg-active pt-1">
                  <CheckCircle2 className="w-4 h-4 shrink-0" />
                  <span>Este abono liquidará el préstamo en su totalidad.</span>
                </div>
              )}
            </div>
          )}

          <Divider my="xs" />

          {/* Botones de acción */}
          <Group justify="center" gap="sm">
            <Button
              variant="outline"
              color="var(--red)"
              size="sm"
              radius="md"
              onClick={handleClose}
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              variant="light"
              color="var(--amber)"
              size="sm"
              radius="md"
              disabled={numAmount <= 0 || numAmount > remainingCapital}
            >
              {isLiquidation ? "Liquidar Préstamo" : "Confirmar Abono"}
            </Button>
          </Group>
        </form>
      )}
    </Modal>
  );
}

export default ModalPayCapital;
