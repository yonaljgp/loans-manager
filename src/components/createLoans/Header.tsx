import { Title, Text, Badge } from "@mantine/core";
import { HandCoins } from "lucide-react";

function Header() {
  return (
    <div className="w-full mb-8">
      <div className="card flex flex-row items-center justify-between p-6 transition-all">
        <div className="flex items-center gap-4">
          <div className="relative flex items-center justify-center w-14 h-14 rounded-xl bg-blue-500/10 text-blue-500 border border-blue-500/20">
            <HandCoins className="w-7 h-7" />
            <span className="absolute -top-1 -right-1 flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-blue-500"></span>
            </span>
          </div>

          <div className="flex flex-col gap-1">
            <div className="flex items-center justify-between gap-2.5">
              <Title order={2} className="text-2xl font-bold tracking-tight">
                Crear Préstamo
              </Title>
              <Badge
                variant="light"
                color="blue"
                size="sm"
                radius="md"
                className=""
              >
                Nuevo Registro
              </Badge>
            </div>
            <Text className="hidden md:block text-sm text-neutral-500 dark:text-neutral-400">
              Ingresa los datos del cliente y los términos del crédito para
              generar el cronograma
            </Text>
            <Text className="block md:hidden text-sm text-neutral-500 dark:text-neutral-400">
              Ingresa los datos del cliente
            </Text>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Header;
