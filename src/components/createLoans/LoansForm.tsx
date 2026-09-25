"use client";

import { useForm, Controller } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { DatePickerInput } from "@mantine/dates";
import { Select, TextInput, NumberInput, Card, Button } from "@mantine/core";
import { addLoan } from "@/utils/LocalStorage";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";

const schema = z.object({
  name: z.string().min(3, "El nombre debe tener al menos 3 caracteres"),
  amount: z.number().min(1, "El monto debe ser mayor 0"),
  interestPercentage: z
    .string()
    // 1. Evita que escriban letras (solo permite números, opcionalmente un punto/coma decimal y el signo %)
    .regex(/^[0-9.,]*%?$/, { message: "Solo se permiten números" })

    // 2. Transforma el texto a número para la base de datos o estado
    .transform((val) => {
      const numeroLimpio = val.replace("%", "").replace(",", ".").trim();
      return numeroLimpio === "" ? 0 : Number(numeroLimpio);
    })

    // 3. Valida el número resultante
    .pipe(
      z
        .number()
        .min(0, { message: "El porcentaje mínimo es 0%" })
        .max(100, { message: "El porcentaje máximo es 100%" }),
    ),
  period: z.enum(["semanal", "quincenal", "mensual"]),
  paymentDate: z.string().min(1, "La fecha es requerida"),
});

type FormInput = z.input<typeof schema>;
type FormOutput = z.output<typeof schema>;

function LoansForm() {
  const {
    register,
    reset,
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<FormInput, unknown, FormOutput>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: "",
      amount: 0,
      interestPercentage: "0%",
      period: "semanal",
      paymentDate: "",
    },
  });

  const router = useRouter();

  const onSubmit = (data: FormOutput) => {
    addLoan("loans", data);
    reset();
    toast.success("Préstamo agregado correctamente");
    setTimeout(() => {
      router.push("/");
    }, 2000);
  };

  return (
    <Card className="card h-max w-full ">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex flex-col gap-6 md:gap-8 p-2 md:p-4"
      >
        <TextInput
          label="Nombre"
          required
          {...register("name")}
          placeholder="ej. Juan Perez"
        />
        {errors.name && <span>{errors.name.message}</span>}

        <Controller
          name="amount"
          control={control}
          render={({ field }) => (
            <NumberInput
              label="Monto"
              placeholder="100$"
              required
              prefix="$"
              hideControls
              value={field.value}
              onChange={(val) =>
                field.onChange(typeof val === "number" ? val : 0)
              }
              min={0}
            />
          )}
        />
        {errors.amount && <span>{errors.amount.message}</span>}

        <TextInput
          label="Tasa de Interes"
          required
          {...register("interestPercentage")}
          placeholder="20%"
        />
        {errors.interestPercentage && (
          <span>{errors.interestPercentage.message}</span>
        )}

        <Controller
          name="period"
          control={control}
          render={({ field }) => (
            <Select
              label="Periodo de Pago"
              required
              rightSection={null}
              data={["semanal", "quincenal", "mensual"]}
              value={field.value}
              onChange={(val) => field.onChange(val ?? "semanal")}
            />
          )}
        />
        {errors.period && <span>{errors.period.message}</span>}

        <Controller
          name="paymentDate"
          control={control}
          render={({ field }) => (
            <DatePickerInput
              label="Fecha de Inicio"
              placeholder="12/10/2022"
              maxDate={new Date()}
              required
              value={field.value ? new Date(field.value) : null}
              onChange={(date) => {
                if (!date) {
                  field.onChange("");
                  return;
                }
                const d = new Date(date);
                field.onChange(
                  isNaN(d.getTime()) ? "" : d.toISOString().split("T")[0],
                );
              }}
            />
          )}
        />
        {errors.paymentDate && <span>{errors.paymentDate.message}</span>}

        <Button type="submit">Enviar</Button>
      </form>
    </Card>
  );
}

export default LoansForm;
