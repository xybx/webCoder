interface LoginData {
  depart?:string;
  username?: string;
  userName?:string;
  password?: string;
  captchaKey?: string;
  captchaCode?: string;
}

interface OptionProps {
  pid?:number | string,
  label?:string,
  text?:string,
  value?:number | string,
  name?:string | number
}

export type { LoginData, OptionProps }
