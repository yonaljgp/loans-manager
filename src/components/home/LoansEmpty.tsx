"use client";

import { Button, Text, Title } from "@mantine/core";
import Link from "next/link";
import { HandCoins, Plus } from "lucide-react";

function LoansEmpty() {
  return (
    <div className="w-full h-[calc(100vh-5.5rem)] max-w-xl mx-auto px-4 py-12 flex flex-col items-center justify-center text-center">
      <div className="card w-full p-8 md:p-12 flex flex-col items-center gap-6 rounded-3xl">
        <div className="relative flex items-center justify-center w-20 h-20 rounded-2xl bg-blue-500/10 text-blue-500 border border-blue-500/20 shadow-inner">
          <HandCoins className="w-10 h-10" />
          <span className="absolute -top-1.5 -right-1.5 flex h-4 w-4">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-4 w-4 bg-blue-500"></span>
          </span>
        </div>

        <div className="flex flex-col gap-2 max-w-md">
          <Title order={2} className="text-2xl font-bold tracking-tight">
            Aún no tienes préstamos
          </Title>
          <Text className="text-sm text-neutral-500 dark:text-neutral-400">
            Comienza a administrar tus créditos y clientes creando tu primer
            registro de préstamo.
          </Text>
        </div>

        <Link href="/crear-prestamo" className="mt-2">
          <Button
            size="md"
            radius="xl"
            leftSection={<Plus className="w-4 h-4" />}
            className="font-medium shadow-md shadow-blue-500/20 hover:scale-[1.02] transition-transform"
          >
            Crea tu primer préstamo
          </Button>
        </Link>
      </div>
    </div>
  );
}

export default LoansEmpty;
