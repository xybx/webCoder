export interface ArrayTypeProps{
  pid?:number | string,
  value?: number | string,
  text?:string,
  label?:string,
  img?:string,
  url?:string,
  index?:number,
  children?:ArrayTypeProps[],
  code?:string|undefined
}
