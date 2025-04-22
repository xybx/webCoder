export interface TableProps{
  pid?:number | string,
  username?:string,
}

export interface TabPorps {
  prop: string,
  label: string
}

export interface queryPorps {
  name?:string,
  password?:string|number,
  username?:string,
  type?:string,
  des?:string,
  projectinfopid?:string|number,
  url?:string,
  drivermsgpid?:string|number,
  schemaname?:string,
  dsname?:string,
  datasource?:string,
  value?:string,
  templatestylepid?:string|number,
  typepid?:string | number,
  img?:string,
  path?:string,
  sort?:number|string,
  packName?:string,
  controllerName?:string,
  domianName?:string,
  serviceName?:string,
  serviceImplName?:string,
  mapperName?:string,
  xmlName?:string,
  pojoName?:string,
  grouppid?:number
  rule?:string
}
