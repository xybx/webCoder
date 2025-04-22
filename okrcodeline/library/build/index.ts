import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'
import chokidar from 'chokidar'
import dayjs from 'dayjs'
import pc from 'picocolors'
import type { Plugin } from 'vite'
import { createBanner } from './banner/'
import { createCompress } from './compress/'
import { createProgress } from './progress/'
import { createSvgIcons } from './svgSprite/'
import { createUnPlugin } from './unplugin/'
import { createVisualizer } from './visualizer/'
import { compress, https, localEnabled, port, prodEnabled, report } from '/@/config/'

const viteApp = 'VITE_' + 'APP_'
const viteUser = 'VITE_' + 'USER_'

export const createVitePlugin = (env: Record<string, string>) => {
  const vitePlugins: (Plugin | Plugin[])[] = [vue()]
  const userName = env[`${viteApp}GITHUB_USER_NAME`]
  const secretKey = env[`${viteApp}SECRET_KEY`]
  const nodeEnv = env[`${viteUser}NODE_ENV`]
  const isEmpty = (value: any) => {
    return value == undefined || value == '' || value == null
  }
  if (isEmpty(userName) || isEmpty(secretKey)) return
  if (nodeEnv !== 'development') if (isEmpty(userName) || isEmpty(secretKey)) return
  vitePlugins.push(vueJsx())
  vitePlugins.push(createProgress(env))
  vitePlugins.push(createUnPlugin(env))
  vitePlugins.push(createSvgIcons())
  vitePlugins.push(createBanner())
  if (compress) vitePlugins.push(createCompress(compress))
  if (report) vitePlugins.push(createVisualizer())
  return vitePlugins
}

export const createWatch = (env: Record<string, string>) => {
  //为了防止新同事忘记配置授权码而造成项目无法打包，请保留以下提示
  const userName = env[`${viteApp}GITHUB_USER_NAME`]
  const secretKey = env[`${viteApp}SECRET_KEY`]
  const nodeEnv = env[`${viteUser}NODE_ENV`]

  if (nodeEnv === 'production') {
    if (userName === 'test' || secretKey === 'preview') {
      console.log(
        `${pc.red(
          '\u68c0\u6d4b\u5230\u60a8\u7684\u7528\u6237\u540d\u6216\u006b\u0065\u0079\u672a\u914d\u7f6e\uff0c\u8bf7\u914d\u7f6e\u006b\u0065\u0079'
        )}`
      )
      process.exit()
    }
  }

  if (nodeEnv === 'development') {
    chokidar.watch('./src/views').on('change', (path) => {
      if (path.endsWith('vue')) {
        console.log(
          `\n${pc.gray(dayjs().format('HH:mm:ss'))} ${pc.cyan('[vite]')} ${pc.cyan(`http://localhost:${port}/`)} ${pc.green(
            'update success'
          )} `
        )
      }
    })
  }
}
