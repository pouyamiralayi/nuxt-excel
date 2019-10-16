<template>
  <b-row>
    <b-col cols="12">
      <b-form dir="rtl" @submit.stop.prevent="changePass">
        <b-form-group
          label="رمز عبور فعلی"
          label-cols="12"
          label-align="right"
          :invalid-feedback="invalidOldFeedback"
          :valid-feedback="validOldFeedback">
          <b-form-input
            id="old_pass"
            v-model="oldPass"
            type="text"
            :autofocus="true"
            placeholder="رمز عبور فعلی را وارد نمایید"
          />
        </b-form-group>
        <b-form-group
          label="رمز عبور جدید"
          label-cols="12"
          label-align="right"
          :invalid-feedback="invalidNewFeedback"
          :valid-feedback="validNewFeedback">
          <b-form-input
            id="new_pass"
            v-model="newPass"
            type="password"
            :autofocus="true"
            placeholder="رمز عبور جدید را وارد نمایید"
          />
        </b-form-group>
        <b-form-group
          label="رمز عبور جدید"
          label-cols="12"
          label-align="right"
          :invalid-feedback="invalidNewAgainFeedback"
          :valid-feedback="validNewAgainFeedback">
          <b-form-input
            id="new_pass_again"
            v-model="newPassAgain"
            type="password"
            :autofocus="true"
            placeholder="رمز عبور جدید را تکرار نمایید"
          />
        </b-form-group>
        <div class="w-100 text-right">
          <b-button :disabled="!oldPass || !newPass || !newPassAgain" :variant="(oldPass && newPass && newPassAgain) ? 'success' : ''"
                    type="submit">تغییر رمز
          </b-button>
        </div>
      </b-form>
    </b-col>
  </b-row>
</template>

<script>
    import Strapi from 'strapi-sdk-javascript/build/main'
    import axios from 'axios'
    const apiUrl = process.env.API_URL || 'http://10.30.205.75:1339'
    const strapi = new Strapi(apiUrl)

    export default {
        name: "ChangePass",
        data(){
            return {
                newPass:'',
                newPassAgain:'',
                oldPass:'',
                invalidOldFeedback: 'رمز عبور قبلی خالی میباشد',
                invalidNewFeedback: 'رمز عبور جدید خالی میباشد',
                invalidNewAgainFeedback: 'رمز عبور جدید خالی میباشد',
                validOldFeedback: '',                customer_no_query:'',
                validNewFeedback: '',                customer_no_query:'',
                validNewAgainFeedback: '',
            }
        },
        methods:{
            async changePass(){
              // console.log(this.$store.getters['auth/id'])
                const userId = this.$store.getters['auth/id']
                const res = await strapi.getEntry("users", userId)
                console.log(res)
            },
        }
    }
</script>

<style scoped>

</style>
