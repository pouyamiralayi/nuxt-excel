<template>
  <b-row>
    <div class="col-md-12">
      <b-form dir="rtl" @submit.stop.prevent="sendFile">
        <b-form-group
          label="نام فایل"
          label-cols="12"
          label-align="right"
        >
          <b-form-input
            id="email"
            v-model="fileName"
            type="text"
            :autofocus="true"
            placeholder="نام فایل را وارد نمایید"
          />
        </b-form-group>
        <b-form-group
          label="فایل اکسل"
          label-cols="12"
          label-align="right">
          <b-form-file
            v-model="file"
            :state="Boolean(file)"
            placeholder="فایل را انتخاب نمایید"
            drop-placeholder="فایل را انتخاب نمایید"
          >
          </b-form-file>
        </b-form-group>
        <b-form-group
          label="مشتری"
          label-cols="12"
          label-align="right">
          <b-form-select v-model="selected" :options="customersOptions"></b-form-select>
        </b-form-group>
        <div class="w-100 text-right">
          <b-button :disabled=" loading || !selected" :variant="(selected) ? 'success' : ''"
                    type="submit">تایید
          </b-button>
        </div>
      </b-form>
    </div>
  </b-row>
</template>

<script>
  import Strapi from 'strapi-sdk-javascript/build/main'

  const apiUrl = process.env.API_URL || 'http://localhost:1337'
  const strapi = new Strapi(apiUrl)

  export default {
    name: "AddExcel",
    props: {
      eid: {
        type: String,
        required: true
      }
    },
    created() {
      const excel = this.$store.getters['excels/byId'](this.eid)
      if (excel) {
        this.fileName = excel.file_name
        // console.log(excel)
        if (excel.customer) {
          const sel = this.customersOptions.find(item => item.value === excel.customer.id)
          this.selected = sel.value
        }
      }
    },
    data() {
      return {
        fileName: '',
        file: false,
        loading: false,
        selected: null,
      }
    },
    methods: {
      async sendFile() {
        this.loading = true
        try {

          const entity = await strapi.updateEntry('excels', this.eid, {
            file_name: this.fileName,
            customer: this.selected,
          })
          if (this.file) {
            const form = new FormData();
            form.append('ref', 'excel');
            form.append('refId', entity.id);
            form.append('field', 'excel_file');
            form.append('files', this.file);
            const files = await strapi.upload(form);
          }

          this.loading = false
          this.$store.commit('excels/update', {
            id: entity.id,
            ...entity
          })
          alert('فایل با موفقیت ویرایش شد.')
        } catch (e) {
          this.loading = false
          alert(e)
        }
      }
    },
    computed: {
      customersOptions() {
        return this.$store.getters['customers/list'].map(customer => {
          return {
            value: customer.id,
            text: customer.customer_name || customer.customer_phone_number,
          }
        })
      }
    }
  }
</script>

<style scoped>

</style>
