export type InterestType = {
  id: number | string;
  weekNumber: number;
  amount: number;
  rate: number;
  paymentDate: string;
  paid: boolean;
  paidAt?: string | null;
};

export type LoanType = {
  id: number;
  name: string;
  capitalAmount: number;
  principalPayment?: number;
  interestPercentage: number;
  period: "semanal" | "quincenal" | "mensual";
  paymentDate: string;
  status?: "pendiente" | "pagado";
  weeksCount?: number;
  interests?: InterestType[];
  note?: string;
};
