<template>
  <client-only>
    <div v-if="username">
      <b-modal id="modal-admin" dir="ltr" title="تغییر رمز عبور" busy>
        <change-pass></change-pass>
        <div slot="modal-footer"></div>
      </b-modal>
      <b-navbar toggleable="lg" type="dark" variant="light" :sticky="true">
        <b-navbar-toggle style="background-color: #e3f2fd;" target="nav-collapse"></b-navbar-toggle>
        <b-collapse id="nav-collapse" is-nav>
          <b-navbar-nav>
            <b-nav-item href="#">
              <!--          <a href="#" class="nav-link mt-3" style="text-align: center" @click="logout">-->
              <p class="subtitle" @click="logout" dir="rtl"><span>⛱</span>&nbsp;<span>خروج</span></p>
              <!--<span class="subtitle">{{ username }}</span><br>-->
              <!--          </a>-->
            </b-nav-item>
            &nbsp;&nbsp;&nbsp;
<!--            <b-nav-item href="#">-->
<!--                <p class="subtitle" @click="showAdmin" dir="rtl"><span>⛱</span>&nbsp;<span>مدیریت ورود</span></p>-->
<!--            </b-nav-item>-->
          </b-navbar-nav>
          <b-navbar-nav class="ml-auto">
            <b-nav-item href="#">
            <router-link v-if="username" tag="a" class="mt-3 navbar-brand" to="/dashboard" exact><p class="subtitle">
              صورتحساب
              <span>👋</span></p></router-link>
            </b-nav-item>
            <b-nav-item href="#">
            <router-link v-if="username" tag="a" class="mt-3 navbar-brand" to="/seller" exact><p class="subtitle">
              گزارش فروش
              <span>👋</span></p></router-link>
            </b-nav-item>
          </b-navbar-nav>
        </b-collapse>
      </b-navbar>
    </div>
  </client-only>
<!--  <nav class="navbar navbar-expand-lg navbar-light bg-light">-->
<!--    <div class="collapse navbar-collapse justify-content-start">-->
<!--      <ul class="navbar-nav">-->
<!--        <li v-if="username">-->
<!--          <a href="#" class="nav-link mt-3" style="text-align: center" @click="logout">-->
<!--            <p class="subtitle" dir="rtl"><span>⛱</span>&nbsp;<span>خروج</span></p>-->
<!--            &lt;!&ndash;<span class="subtitle">{{ username }}</span><br>&ndash;&gt;-->
<!--          </a>-->
<!--        </li>-->
<!--        &lt;!&ndash;<li v-if="username" class="ml-4">&ndash;&gt;-->
<!--        &lt;!&ndash;<a href="#" class="nav-link">&ndash;&gt;-->
<!--        &lt;!&ndash;<span class="ml-1">خوش آمدید</span>&ndash;&gt;-->
<!--        &lt;!&ndash;</a>&ndash;&gt;-->
<!--        &lt;!&ndash;</li>&ndash;&gt;-->
<!--        &lt;!&ndash;<li v-if="!username">&ndash;&gt;-->
<!--        &lt;!&ndash;<router-link v-if="!username" tag="a" class="nav-link" to="/signin" exact>&ndash;&gt;-->
<!--        &lt;!&ndash;Signin&ndash;&gt;-->
<!--        &lt;!&ndash;</router-link>&ndash;&gt;-->
<!--        &lt;!&ndash;</li>&ndash;&gt;-->
<!--        &lt;!&ndash;<li v-if="!username">&ndash;&gt;-->
<!--        &lt;!&ndash;<router-link v-if="!username" tag="a" class="nav-link" to="/signup" exact>&ndash;&gt;-->
<!--        &lt;!&ndash;Signup&ndash;&gt;-->
<!--        &lt;!&ndash;</router-link>&ndash;&gt;-->
<!--        &lt;!&ndash;</li>&ndash;&gt;-->
<!--      </ul>-->
<!--    </div>-->
<!--    <router-link v-if="username" tag="a" class="mt-3 navbar-brand" to="/dashboard" exact><p class="subtitle"> داشبورد-->
<!--      <span>👋</span></p></router-link>-->
<!--    <router-link v-if="username" tag="a" class="mt-3 navbar-brand" to="/customers" exact><p class="subtitle"> مشتریان-->
<!--      <span>👋</span></p></router-link>-->
<!--  </nav>-->
</template>

<script>
    import {mapMutations} from 'vuex'
    import ChangePass from '@/components/ChangePass'
    export default {
        computed: {
            username() {
                return this.$store.getters['auth/username']
            }
        },
        methods: {
            showAdmin(){
                this.$bvModal.show('modal-admin')
            },
            logout() {
                this.$store.commit('auth/logout')
                this.$store.commit('customers/setOwed', null)
                // this.$apolloHelpers.onLogout()
                this.$router.push('/')
            }
        },
        components:{
            'change-pass': ChangePass
        }
    }
</script>
<style scoped>
  .subtitle {
    font-weight: 500;
    font-size: 22px;
    color: #526488;
    word-spacing: 1px;
    padding-bottom: 15px;
  }

  .nuxt-link-exact-active {
    -webkit-text-decoration: slateblue solid underline;
    text-decoration: slateblue solid underline;
    -webkit-text-underline-position: under;
    text-underline-position: under;
    /*text-decoration: underline;*/
    /*-webkit-text-decoration-color: salmon;*/
    /*text-decoration-color: salmon;*/
    -webkit-text-decoration-style: double;
    text-decoration-style: double;
    /*-webkit-text-decoration-line: overline;*/
    /*text-decoration-line: overline;*/
  }
</style>
