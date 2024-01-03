/**
 * Interface para los modulos del SideNav
 */
export interface CmmSideNavModel {
  moduleName: string,
  description: string,
  page: string,
  icon: string,
  image?: string,
  actions: CmmActionSideNavModel[]
}

/**
 * Interface para las acciones de los modulos del sidenav
 */
export interface CmmActionSideNavModel {
  actionName: string,
  description: string,
  hideAction: boolean,
  status: string,
  tag_status: string,
  page:string,
  key:string,
  image: string | undefined,
  apis: string[]
}

/**
 * Interface para listar las acciones de un usuario
 */
export interface CmmActionListModel {
  actionName: string,
  key: string
}

/**
 * Interface para las cartas de informacion de CmmOptionCardComponent
 */
export interface CmmModuleActionOption {
  title: string,
  subtitle: string,
  url: string,
  privileges?: string[],
  imgUrl:string,
  imgDimentions: {width: number, height: number}
}
