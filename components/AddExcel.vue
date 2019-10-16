<template>
  <section v-if="loading" class="container-fluid" style="height: 60vh;display: flex; justify-content: center;align-items: center">
    <b-spinner variant="success" type="grow"></b-spinner>
  </section>
  <b-row v-else>
    <div class="col-md-12">
      <b-form dir="rtl" @submit.stop.prevent="sendFile">
<!--        <b-form-group-->
<!--          label="نام فایل"-->
<!--          label-cols="12"-->
<!--          label-align="right"-->
<!--          :invalid-feedback="invalidFeedback"-->
<!--          :valid-feedback="validFeedback">-->
<!--          <b-form-input-->
<!--            id="email"-->
<!--            v-model="fileName"-->
<!--            type="text"-->
<!--            :autofocus="true"-->
<!--            placeholder="نام فایل را وارد نمایید"-->
<!--          />-->
<!--        </b-form-group>-->
        <b-form-group
          label="فایل اکسل"
          label-cols="12"
          label-align="right">
          <b-form-file
            v-model="file"
            :state="Boolean(file)"
            placeholder="فایل را انتخاب نمایید"
            drop-placeholder="فایل را انتخاب نمایید"
            required
          >
          </b-form-file>
        </b-form-group>
<!--        <b-form-group-->
<!--          label="مشتری"-->
<!--          label-cols="12"-->
<!--          label-align="right">-->
<!--          <b-form-select v-model="selected" :options="customersOptions"></b-form-select>-->
<!--        </b-form-group>-->
        <div class="w-100 text-right">
          <b-button :disabled="!file || loading" :variant="(file) ? 'success' : ''"
                    type="submit">تایید
          </b-button>
        </div>
      </b-form>
    </div>
  </b-row>
</template>

<script>
  import Strapi from 'strapi-sdk-javascript/build/main'
import axios from "axios";
  const apiUrl = process.env.API_URL || 'http://10.30.205.75:1337'
  const strapi = new Strapi(apiUrl)

  export default {
    name: "AddExcel",
    data() {
      return {
        invalidFeedback: 'مشتری را مشخص نمایید',
        validFeedback: '',
        fileName: '',
        file: false,
        loading: false,
        selected: null,
        options: [
          // { value: null, text: 'Please select an option' },
          // { value: 'a', text: 'This is First option' },
          // { value: 'b', text: 'Selected Option' },
          // { value: { C: '3PO' }, text: 'This is an option with object value' },
          // { value: 'd', text: 'This one is disabled', disabled: true }
        ]
      }
    },
    methods: {
      async sendFile() {
        this.loading = true
          try{
            const entity = await axios.get(apiUrl+'/excels?file_name=default')
              const excel_id = entity.data[0].id
            const form = new FormData();
            form.append('ref', 'excel');
            form.append('refId', entity.data[0].id);
            form.append('field', 'excel_file');
            form.append('files', this.file);
            const files = await strapi.upload(form);
              const file_id = files[0].id
            // console.log(files)
            const response = await axios.post(apiUrl+`/updatehook?id=${excel_id}&file_name=default&file_id=${file_id}`)
            this.loading = false
            alert('فایل با موفقیت پردازش شد.')
              location.reload()
          }
          catch (e) {
              this.loading = false
              alert(e)
          }
      }
    },
    computed: {
      // customersOptions() {
      //   return this.$store.getters['customers/list'].map(customer => {
      //     return {
      //       value: customer.id,
      //       text: customer.customer_name || customer.customer_phone_number,
      //     }
      //   })
      // }
    }
  }
</script>

<style scoped>

</style>
