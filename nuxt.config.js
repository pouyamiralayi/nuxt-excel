import webpack from 'webpack'

export default {
  mode: 'universal',
  /*
  ** Headers of the page
  */
  head: {
    title: process.env.npm_package_name || '',
    meta: [
      {charset: 'utf-8'},
      {name: 'viewport', content: 'width=device-width, initial-scale=1'},
      {hid: 'description', name: 'description', content: process.env.npm_package_description || ''}
    ],
    link: [
      {rel: 'icon', type: 'image/x-icon', href: '/favicon.ico'}
    ]
  },
  env: {
    // apiUrl: 'http://127.0.0.1:1337'
    apiUrl: 'http://10.30.205.75:1339'
  },
  /*
  ** Customize the progress-bar color
  */
  loading: {color: '#fff'},
  /*
  ** Global CSS
  */
  css: ['@/assets/css/base.css'],
  /*
  ** Plugins to load before mounting the App
  */
  plugins: [
    '~/plugins/moment-jalaali',
    '~/plugins/filters.js'
  ],
  /*
  ** Nuxt.js dev-modules
  */
  buildModules: [],
  /*
  ** Nuxt.js modules
  */
  modules: [
    // Doc: https://bootstrap-vue.js.org
    'bootstrap-vue/nuxt',
    // Doc: https://axios.nuxtjs.org/usage
    '@nuxtjs/axios',
    '@nuxtjs/apollo'
  ],
  apollo: {
    clientConfigs: {
      default:'@/apollo/client-configs/default.js'
      // default: {
        // httpEndpoint: 'http://localhost:1337/graphql'
      // }
    }
  },
  /*
  ** Axios module configuration
  ** See https://axios.nuxtjs.org/options
  */
  axios: {},
  /*
  ** Build configuration
  */
  build: {
    plugins: [
      new webpack.IgnorePlugin(/^\.\/locale$/, /moment$/)
    ],
    /*
    ** You can extend webpack config here
    */
    extend(config, ctx) {
    }
  }
}
