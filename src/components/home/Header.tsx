"use client";

import Link from "next/link";
import { Button, Text, Title } from "@mantine/core";
import { Plus } from "lucide-react";
import type { LoanType } from "@/types/LoansType";

function Header({ loans }: { loans: LoanType[] }) {
  return (
    <div className="w-full max-w-6xl mx-auto px-4 py-2">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6 md:mb-8 pb-4">
        <div>
          <Title
            order={2}
            className="text-2xl md:text-3xl font-bold tracking-tight"
          >
            Préstamos Activos
          </Title>
          <Text className="text-sm text-neutral-500 dark:text-neutral-400">
            {loans.length}{" "}
            {loans.length === 1 ? "registro activo" : "registros activos"} en el
            sistema
          </Text>
        </div>

        <Link href="/crear-prestamo">
          <Button
            radius="xl"
            leftSection={<Plus className="w-4 h-4" />}
            className="shadow-sm font-medium hover:scale-[1.02] transition-transform"
          >
            Nuevo Préstamo
          </Button>
        </Link>
      </div>
    </div>
  );
}

export default Header;
