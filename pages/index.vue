<template>
  <div>
      <section v-if="loading" class="container-fluid" style="height: 100vh;display: flex; justify-content: center;align-items: center">
        <b-spinner variant="success" type="grow"></b-spinner>
      </section>
    <section v-else class="container-fluid">
      <b-row  align-h="center">
        <b-col cols="6" class="text-center">
          <app-logo/>
          <h1 class="title" style="font-weight: bold; text-align: center">
            داشبورد اکسل
          </h1>
          <h2 class="subtitle mt-3" style="text-align: center">
            پنل مدیریت
          </h2>
            <b-form style="width: 100%" autocomplete="off" @submit.stop.prevent="handleSubmit">
              <b-form-group
                label="نام کاربری"
                label-cols="12"
                label-align="right"
                :invalid-feedback="invalidFeedback"
                :valid-feedback="validFeedback"
              >
                <b-form-input
                  id="email"
                  v-model="email"
                  type="text"
                  :autofocus="true"
                  placeholder="نام کاربری را وارد نمایید"
                  required/>
              </b-form-group>
              <b-form-group
                label="رمز عبور"
                label-cols="12"
                label-align="right"
              >
                <b-form-input
                  id="password"
                  v-model="password"
                  label="password"
                  type="password"
                  class="form-control"
                  :autofocus="true"
                  placeholder="رمز عبور را وارد نمایید"
                  required/>
              </b-form-group>
              <button :disabled="loading" type="submit" class="btn btn-primary btn-block mt-3 pt-2 pb-3"><span style="font-weight: 100; font-size: 23px">ورود</span></button>
              <!--<p class="text-center mt-3">-->
                <!--No account yet-->
                <!--<router-link :to="{ name: 'signup'}" tag="a">-->
                  <!--Register-->
                <!--</router-link>-->
              <!--</p>-->
            </b-form>
        </b-col>
      </b-row>
    </section>

  </div>
</template>

<script>
  import Strapi from 'strapi-sdk-javascript/build/main'
  // import {BRow,BCol, BForm, BFormInput, BFormGroup} from 'bootstrap-vue/es/components';
  import AppLogo from '~/components/AppLogo.vue'

  // const apiUrl = process.env.API_URL || ''
  const apiUrl = process.env.API_URL || 'http://10.30.205.75:1337'
  // console.log('apiUrl',apiUrl)
  const strapi = new Strapi(apiUrl)
  import { mapMutations } from 'vuex'
  export default {
      created(){
        console.log(process.env.API_URL)
        if(this.isLoggedIn){
            this.$router.push('dashboard')
        }
      },
    components:{
      AppLogo,
      // 'b-form':BForm,
      // 'b-form-group':BFormGroup,
      // 'b-form-input':BFormInput,
      // 'b-row':BRow,
      // 'b-col':BCol,
    },
    mounted(){
      this.mounted = true
      if(!this.mounted){
        window.location.reload()
      }
    },
    data() {
      return {
        mounted:false,
        email: '',
        password: '',
        loading: false,
        invalidFeedback:'',
        validFeedback:'',
      }
    },
    methods: {
      async handleSubmit() {
        try {
          this.loading = true
          const response = await strapi.login(this.email, this.password)
            console.log(response)
          // this.loading = false
          // this.$store.commit('auth/setUser', response.user)
          this.setUser({jwt:response.jwt, ...response.user})
          this.$router.push('dashboard')
        } catch (err) {
          // this.loading = false
          alert(err.message || 'An error occurred.')
        }
      },
      ...mapMutations({
        setUser: 'auth/setUser'
      })
    },
      computed:{
          isLoggedIn(){
              return this.$store.getters['auth/username']
          },
      }
  }
</script>
