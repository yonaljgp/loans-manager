import type { LoanType } from "@/types/LoansType";
import {
  generateInterestsUpToDate,
  generateNextInterestWeek,
} from "./interestCalculator";

let cachedRawLoans: string | null = null;
let cachedLoans: LoanType[] = [];

function syncLoansWithCurrentDate(loans: LoanType[]): {
  syncedLoans: LoanType[];
  hasChanges: boolean;
} {
  let hasChanges = false;
  const syncedLoans = loans.map((loan) => {
    // Si el préstamo ya está completamente pagado, no generamos nuevas cuotas de interés
    if (loan.status === "pagado") {
      return loan;
    }

    const updatedInterests = generateInterestsUpToDate({
      startDate: loan.paymentDate,
      amount: loan.capitalAmount,
      interestPercentage: loan.interestPercentage,
      period: loan.period,
      existingInterests: loan.interests ?? [],
      loanId: loan.id,
    });

    if (
      !loan.interests ||
      JSON.stringify(updatedInterests) !== JSON.stringify(loan.interests)
    ) {
      hasChanges = true;
      return { ...loan, interests: updatedInterests };
    }
    return loan;
  });

  return { syncedLoans, hasChanges };
}

function getLoansSnapshot(): LoanType[] {
  if (typeof window === "undefined") return cachedLoans;
  const raw = window.localStorage.getItem("loans");
  if (raw !== cachedRawLoans) {
    cachedRawLoans = raw;
    try {
      const parsed = raw ? (JSON.parse(raw) as LoanType[]) : [];
      const { syncedLoans, hasChanges } = syncLoansWithCurrentDate(parsed);
      cachedLoans = syncedLoans;
      if (hasChanges) {
        cachedRawLoans = JSON.stringify(syncedLoans);
        window.localStorage.setItem("loans", cachedRawLoans);
      }
    } catch {
      cachedLoans = [];
    }
  }
  return cachedLoans;
}

function checkAndSyncLoans(): boolean {
  if (typeof window === "undefined") return false;
  const raw = window.localStorage.getItem("loans");
  if (!raw) return false;
  try {
    const parsed = JSON.parse(raw) as LoanType[];
    const { syncedLoans, hasChanges } = syncLoansWithCurrentDate(parsed);
    if (hasChanges) {
      cachedLoans = syncedLoans;
      cachedRawLoans = JSON.stringify(syncedLoans);
      window.localStorage.setItem("loans", cachedRawLoans);
      return true;
    }
  } catch {
    // ignore
  }
  return false;
}

function subscribeLoans(callback: () => void): () => void {
  if (typeof window === "undefined") return () => {};
  const handleSync = () => {
    checkAndSyncLoans();
    callback();
  };
  window.addEventListener("storage", callback);
  window.addEventListener("focus", handleSync);
  document.addEventListener("visibilitychange", handleSync);
  return () => {
    window.removeEventListener("storage", callback);
    window.removeEventListener("focus", handleSync);
    document.removeEventListener("visibilitychange", handleSync);
  };
}

function getAll(key: string): LoanType[] {
  if (typeof window === "undefined") return [];
  const item = window.localStorage.getItem(key);
  if (!item) return [];
  try {
    const parsed = JSON.parse(item) as LoanType[];
    const { syncedLoans, hasChanges } = syncLoansWithCurrentDate(parsed);
    if (hasChanges) {
      window.localStorage.setItem(key, JSON.stringify(syncedLoans));
    }
    return syncedLoans;
  } catch {
    return [];
  }
}

function get(key: string, id: number): LoanType | null {
  const data = getAll(key);
  return data.find((item) => item.id === id) ?? null;
}

function remove(key: string, id: number): void {
  if (typeof window === "undefined") return;
  const data = getAll(key);
  const newData = data.filter((item) => item.id !== id);
  window.localStorage.setItem(key, JSON.stringify(newData));
  window.dispatchEvent(new Event("storage"));
}

function updateLoan(key: string, updatedLoan: LoanType): void {
  if (typeof window === "undefined") return;
  const data = getAll(key);
  const newData = data.map((item) =>
    item.id === updatedLoan.id ? updatedLoan : item,
  );
  window.localStorage.setItem(key, JSON.stringify(newData));
  window.dispatchEvent(new Event("storage"));
}

function addLoan(key: string, loan: Omit<LoanType, "id">): LoanType {
  const loanId = Date.now();
  const interests =
    loan.interests && loan.interests.length > 0
      ? loan.interests
      : generateInterestsUpToDate({
          startDate: loan.paymentDate,
          amount: loan.capitalAmount,
          interestPercentage: loan.interestPercentage,
          period: loan.period,
          loanId,
        });

  const newLoan: LoanType = {
    ...loan,
    id: loanId,
    interests,
  };

  if (typeof window === "undefined") return newLoan;
  const data = getAll(key);
  const newData = [...data, newLoan];
  window.localStorage.setItem(key, JSON.stringify(newData));
  window.dispatchEvent(new Event("storage"));
  return newLoan;
}

/**
 * Marca o desmarca una semana de interés como pagada.
 */
function toggleInterestPaid(
  loanId: number,
  interestId: number | string,
  forceStatus?: boolean,
): LoanType | null {
  if (typeof window === "undefined") return null;
  const loan = get("loans", loanId);
  if (!loan) return null;

  const currentInterests = loan.interests ?? [];
  const updatedInterests = currentInterests.map((interest) => {
    if (interest.id === interestId) {
      const nextPaid =
        typeof forceStatus === "boolean" ? forceStatus : !interest.paid;
      return {
        ...interest,
        paid: nextPaid,
        paidAt: nextPaid ? new Date().toISOString().split("T")[0] : null,
      };
    }
    return interest;
  });

  const updatedLoan: LoanType = {
    ...loan,
    interests: updatedInterests,
  };

  updateLoan("loans", updatedLoan);
  return updatedLoan;
}

/**
 * Agrega la siguiente semana de interés al préstamo.
 */
function addNextInterestWeek(loanId: number): LoanType | null {
  if (typeof window === "undefined") return null;
  const loan = get("loans", loanId);
  if (!loan) return null;

  const nextWeek = generateNextInterestWeek(loan);
  const updatedLoan: LoanType = {
    ...loan,
    interests: [...(loan.interests ?? []), nextWeek],
  };

  updateLoan("loans", updatedLoan);
  return updatedLoan;
}

export {
  getAll,
  get,
  remove,
  addLoan,
  updateLoan,
  toggleInterestPaid,
  addNextInterestWeek,
  getLoansSnapshot,
  subscribeLoans,
};
