/**
 * Interface con los datos necesarios para el uso del componente AlertModal
 */
export interface CmmAlertModalModel {
  title: string;
  text: string;
  giftData?: string;
  icon?: string;
  typeIcon: 'success' | 'error' | 'warning' | 'info' | '',
  showCancelButton: boolean;
  showConfirmButton: boolean;
  cancelButtonText: string;
  confirmButtonText: string;
  timeLeft?: number,
}

/**
 * Interface con los datos necesarios para el uso del componente AlertToastr
 */
export interface CmmAlertToastrModel {
  icon?: string;
  typeIcon: string;
  text: string;
  giftData?: string;
  errorText?: string;
}

/**
 * Interface con los datos necesarios para el uso del componente SelectDialog
 */
export interface CmmSelectDialogModel {
  title: string,
  optionsList: any[],
  label: string,
  placehoder: string,
  searchKey: string,
  optionValue: string,
  siblingOptionValue: string,
  displayImages: boolean,
  imagesRoute: string,
  imageSearchKey: string,
  imgDimentions: {width: number, height: number},
}

/**
 * Interface con los datos necesarios para el uso del componente QuestionDialog
 */
export interface CmmQuestionDialogModel {
  type: boolean,
  method: string,
  showForm: boolean,
  isQuestion: boolean,
  title: string,
  message: string
}
