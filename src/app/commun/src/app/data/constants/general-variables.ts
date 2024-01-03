/**
 * Esta variabel va a ser el simbolo a remplazar en todos los componentes para cuando no haya informacion (ej: N/A, NA, --, ---, ...)
 */
export const CmmReplaceNotFoundIndicator = '--';

//? Para la lógica entre ventanas

/**
 * Tipos de eventos de ventana
 */
export const windowEventTypes = {
  CLOSE: 'close',
  COMPLETE: 'complete',
  ERROR: 'error',
  LOADED: 'content-loaded'
}

/**
 * Modelo de configuración para widget
 */
export interface WidgetConfigurationModel {
  url: string,
  target_blank?: boolean
  width?: number,
  height?: number,
  radius?: number
}

/**
 * Tipos de ambientes que existen
 */
export type CmmEnvironmentNames = 'Developer' | 'Quality' | 'Sandbox' | 'Production' | 'Environment' | 'Pre-production'
