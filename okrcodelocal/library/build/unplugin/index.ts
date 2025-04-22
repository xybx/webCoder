/* import { ElementPlusResolver } from 'unplugin-vue-components/resolvers' */
import { unplugin } from 'vite-plugin-unplugin'

export const createUnPlugin = (env: Record<string, string>) => {
  return unplugin({
    env,
    imports: [
      'vue',
      'pinia',
      'vue-i18n',
      'vue-router',
      '@vueuse/core',
      {
        axios: [['default', 'axios']],
      },
    ],
    resolvers: [
      /* ElementPlusResolver() */
    ],
    dirs: [],
  })
}
