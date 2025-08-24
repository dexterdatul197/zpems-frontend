export type Category = {
  _id: string;
  name: string;
  internalId: string;
  glCode: string;
  status: "active" | "inactive";
};

export type Expense = {
  receiptFile: string;
  merchantName: string;
  date: Date;
  total: number;
  currency: string;
  category: string;
  description: string;

  // TODO: update to reference field?
  expenseReportId: string;
  attendee: string;
  userId: string;
};

export type ExpenseGroup = {
  _id: string;
  total: number;
  count: number;
  average: number;
  expenses: Expense[];
};
