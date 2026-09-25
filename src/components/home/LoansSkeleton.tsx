import { Skeleton } from "@mantine/core";

function LoansSkeleton() {
  return (
    <div className="w-full max-w-6xl mx-auto px-4 py-6 md:py-8">
      {/* Skeleton del Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6 md:mb-8 pb-4">
        <div>
          <Skeleton height={32} width={220} radius="md" mb={8} />
          <Skeleton height={16} width={160} radius="sm" />
        </div>
        <Skeleton height={38} width={150} radius="xl" />
      </div>

      {/* Grid de Tarjetas Skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {Array.from({ length: 6 }).map((_, index) => (
          <div
            key={index}
            className="card relative flex flex-col justify-between p-6 rounded-2xl border"
          >
            {/* Encabezado: Avatar, Nombre/ID y Estado */}
            <div className="flex items-start justify-between gap-3 mb-4">
              <div className="flex items-center gap-3 min-w-0 flex-1">
                <Skeleton
                  height={44}
                  width={44}
                  radius="xl"
                  className="shrink-0"
                />
                <div className="min-w-0 flex-1">
                  <Skeleton height={18} width="70%" radius="sm" mb={6} />
                  <Skeleton height={12} width="40%" radius="sm" />
                </div>
              </div>

              <div className="flex items-center gap-1.5 shrink-0">
                <Skeleton height={22} width={70} radius="md" />
                <Skeleton height={28} width={28} radius="md" />
              </div>
            </div>

            {/* Contenido Principal: Monto e Interés */}
            <div className="card my-4 p-4">
              <div className="flex items-baseline justify-between mb-2">
                <Skeleton height={14} width={90} radius="sm" />
                <Skeleton height={18} width={75} radius="sm" />
              </div>

              <Skeleton height={30} width="60%" radius="md" my={8} />

              <div className="mt-3 pt-2.5 border-t border-border/70 flex items-center justify-between">
                <Skeleton height={14} width={95} radius="sm" />
                <Skeleton height={16} width={75} radius="sm" />
              </div>
            </div>

            {/* Pie de Tarjeta: Plazo y Fecha de Pago */}
            <div className="mt-3 pt-3 border-t border-border/60 flex items-center justify-between">
              <Skeleton height={18} width={80} radius="xl" />
              <Skeleton height={16} width={90} radius="sm" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default LoansSkeleton;
