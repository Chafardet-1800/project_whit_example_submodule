/**
 * Interfaz objeto deposit
 */
export interface DepositsModel {
  idDeposit: string | number;
  depositNumberReference: string | number;
  depositAmount: number;
  depositDescription: string;
  depositDate: string;
  idDepositTargetUser: string | number;
  depositTargetUserName: string;
  depositTargetUserEmail: string;
  depositTargetPersonName: string;
  depositTargetPersonSurname: string;
  idDepositCurrency: string | number;
  depositCurrencyName: string;
  depositIssuingBankName: string;
  depositIssuingBankPrefix: string | number;
  depositInternalHash: string | number;
  idDepositStatus: string | number;
  depositStatusName: string;
  depositTargetBankName: string;
  depositTargetBankPrefix: string | number;

  // detalle de deposito
  depositCreatedDate: string;
  depositDepositDate: string;
  depositValidated: boolean;
  depositValidatedDescription: string | null;
  depositCommissionByReceive: string | number;
  depositTotalAmountReceive: string | number;
  idDepositReceiveCurrency: string | number;
  depositReceiveCurrencyName: string;
  depositReceiveUserName: string;
  depositReceiveUserEmail: string;
  depositReceiveUserPhoneNumber: string | number;
  depositReceivePersonName: string;
  depositReceivePersonSurname: string;
  depositReceivePersonDocumentNumber: string | number;
  depositTargetBankNumberAccount: string | number;
  idDepositTargetBankTypeAccount: string | number;
  depositTargetBankTypeAccountName: string;
  depositImageUrl: string;
  depositImageCreatedDate: string;
  idDepositImageDepositBank: string | number;
}
