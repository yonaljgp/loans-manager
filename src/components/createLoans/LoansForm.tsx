"use client";

import { useForm, Controller } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { DatePickerInput } from "@mantine/dates";
import { Select, TextInput, NumberInput, Card, Button } from "@mantine/core";
import { addLoan } from "@/utils/LocalStorage";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import "dayjs/locale/es";

const schema = z.object({
  name: z.string().min(3, "El nombre debe tener al menos 3 caracteres"),
  capitalAmount: z.number().min(1, "El monto debe ser mayor 0"),
  interestPercentage: z
    .number()
    .min(0, "El interes debe ser mayor a 0")
    .max(100, "El interes debe ser menor a 100"),
  period: z.enum(["Semanal", "Quincenal", "Mensual"]),
  paymentDate: z.string().min(1, "La fecha es requerida"),
  note: z
    .string()
    .max(200, "La nota debe tener máximo 200 caracteres")
    .optional(),
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
      capitalAmount: 0,
      interestPercentage: 0,
      period: "Semanal",
      paymentDate: "",
      note: "",
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
          placeholder="Juan Perez"
        />
        {errors.name && <span>{errors.name.message}</span>}

        <Controller
          name="capitalAmount"
          control={control}
          render={({ field }) => (
            <NumberInput
              label="Monto"
              placeholder="100$"
              required
              suffix="$"
              hideControls
              value={field.value}
              onChange={(val) => field.onChange(Number(val))}
              min={0}
            />
          )}
        />
        {errors.capitalAmount && <span>{errors.capitalAmount.message}</span>}

        <Controller
          name="interestPercentage"
          control={control}
          render={({ field }) => (
            <NumberInput
              label="Tasa de Interés"
              placeholder="20"
              required
              suffix="%"
              hideControls
              value={field.value}
              onChange={(val) => field.onChange(Number(val))}
              min={0}
              max={100}
            />
          )}
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
              data={["Semanal", "Quincenal", "Mensual"]}
              value={field.value}
              onChange={(val) => field.onChange(val ?? "Semanal")}
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
              locale="es"
              required
              value={field.value ? new Date(`${field.value}T00:00:00`) : null}
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

        <TextInput
          label="Nota"
          {...register("note")}
          placeholder="Préstamo para estudios"
          maxLength={200}
        />
        {errors.note && <span>{errors.note.message}</span>}

        <Button type="submit">Enviar</Button>
      </form>
    </Card>
  );
}

export default LoansForm;
