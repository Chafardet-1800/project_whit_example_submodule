export interface WithdrawFilterModel {
  limit: string;
  page: string;
  search: string;
  startDate: any;
  endDate: any;
  amountStart: string;
  amountEnd: string;
  idWithdrawStatus: string;
  idWithdrawCurrency: string;
}

export interface DepositFilterModel {
  limit: string;
  page: string;
  search: string;
  startDate: any;
  endDate: any;
  amountStart: string;
  amountEnd: string;
  idDepositStatus: string;
  idDepositCurrency: string;
}
