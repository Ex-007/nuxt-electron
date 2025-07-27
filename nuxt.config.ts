export default defineNuxtConfig({
  modules: ['@pinia/nuxt'],
  css: ['~/assets/css/global.css'],
  ssr: false,
  nitro: {
    preset: 'static'
  },
  app: {
    baseURL: './',
    buildAssetsDir: '_nuxt/',
    cdnURL: './'
  },
  experimental: {
    payloadExtraction: false
  },
  router: {
    options: {
      hashMode: true
    }
  }
})