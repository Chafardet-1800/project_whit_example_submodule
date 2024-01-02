
export interface UsersModel {}

/**
 * Modelo de la data que viene en listado de retiros
 */
export interface WidthdrawModel {
  idWithdraw: string
  withdrawNumberReference: string
  withdrawAmount: string
  withdrawValidated: boolean
  withdrawValidatedDescription: string
  withdrawCreatedDate: string
  withdrawInternalHash: string
  idWithdrawStatus: string
  withdrawStatusName: string
  withdrawUserName: string
  withdrawUserEmail: string
  withdrawPersonName: string
  withdrawPersonSurname: string
  idWithdrawCurrency: string
  withdrawCurrency: string
  withdrawIssuingBank: any
  withdrawIssuingBankPrefix: any
  withdrawTargetBank: string
  withdrawTargetBankPrefix: string
  withdrawTargetBankAccountType: string
  withdrawTargetBankNumberAccount: string
  withdrawTargetOwnerSurname: string
  withdrawTargetOwnerDocumentNumber: string
}
