import { Skeleton, Card } from "@mantine/core";

function NewLoansSkeleton() {
  return (
    <div className="w-full max-w-2xl mx-auto px-4 py-6 md:py-8">
      {/* Header Skeleton */}
      <div className="w-full mb-8">
        <div className="card flex flex-row items-center justify-between p-6 rounded-2xl border">
          <div className="flex items-center gap-4 w-full">
            {/* Icon box */}
            <Skeleton height={56} width={56} radius="xl" className="shrink-0" />

            {/* Title, Badge & Subtitle */}
            <div className="flex flex-col gap-2 flex-1">
              <div className="flex items-center justify-between gap-2.5">
                <Skeleton height={26} width={180} radius="sm" />
                <Skeleton height={22} width={110} radius="md" />
              </div>
              <Skeleton height={14} width="85%" radius="sm" />
            </div>
          </div>
        </div>
      </div>

      {/* Form Card Skeleton */}
      <Card className="card h-max w-full p-6 md:p-8 rounded-2xl border">
        <div className="flex flex-col gap-6 md:gap-8">
          {/* Campo 1: Nombre */}
          <div className="flex flex-col gap-2">
            <Skeleton height={14} width={70} radius="sm" />
            <Skeleton height={42} radius="md" />
          </div>

          {/* Campo 2: Monto */}
          <div className="flex flex-col gap-2">
            <Skeleton height={14} width={60} radius="sm" />
            <Skeleton height={42} radius="md" />
          </div>

          {/* Campo 3: Tasa de Interés */}
          <div className="flex flex-col gap-2">
            <Skeleton height={14} width={110} radius="sm" />
            <Skeleton height={42} radius="md" />
          </div>

          {/* Campo 4: Periodo de Pago */}
          <div className="flex flex-col gap-2">
            <Skeleton height={14} width={120} radius="sm" />
            <Skeleton height={42} radius="md" />
          </div>

          {/* Campo 5: Fecha de Inicio */}
          <div className="flex flex-col gap-2">
            <Skeleton height={14} width={115} radius="sm" />
            <Skeleton height={42} radius="md" />
          </div>

          {/* Botón de Enviar */}
          <div className="pt-2">
            <Skeleton height={44} radius="md" />
          </div>
        </div>
      </Card>
    </div>
  );
}

export default NewLoansSkeleton;
