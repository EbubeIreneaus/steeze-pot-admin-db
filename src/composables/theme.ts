import { Dark } from 'quasar'

export default function useDarkMode(val: boolean){
  if (val) {
    Dark.set(true)
    localStorage.setItem('theme', 'dark')
    return
  }
  Dark.set(false)
  localStorage.setItem('theme', 'light')
}

export const configureTheme = ()=>{
  const theme = localStorage.getItem('theme')
  if (!theme) {
    Dark.set('auto')
    return
  }

  if(theme == 'dark'){
    Dark.set(true)
    return
  }

  if(theme == 'light'){
    Dark.set(false)
    return
  }
}
