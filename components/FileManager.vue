<template>
  <section v-if="loading" class="container-fluid"
           style="height: 60vh;display: flex; justify-content: center;align-items: center">
    <b-spinner variant="success" type="grow"></b-spinner>
  </section>
  <b-row v-else class="container-fluid" align-h="center">
    <b-modal id="modal-remove-excel" dir="" title="حذف فایل" busy>
      <p class="my-4 subtitle-mini" style="text-align: center"><span>😔</span>آیا از حذف اطمینان دارید؟</p>
      <b-form @submit.stop.prevent="removeFile" class="text-center">
        <b-button type="submit">تایید</b-button>
        <b-button @click="$bvModal.hide('modal-remove-excel')">لغو</b-button>
      </b-form>
      <div slot="modal-footer"></div>
    </b-modal>
    <b-card
      v-if="files && files.length > 0"
      v-for="file in files"
      :key="file.id"
      class="card w-100"
    >
      <div class="card-body">
        <h5 class="card-title subtitle-mini">
          <p class="label">نام فایل</p>
          <span class="ml-1">📝</span>{{file.name}}
        </h5>
        <div class="card-text subtitle-mini">
          <p class="label">تاریخ بارگذاری </p>&nbsp;{{file.created_at | moment("jYYYY/jMM/jDD") || 'تاریخ ثبت نشده است'
          }}
        </div>
        <b-badge
          class="subtitle-icon"
          style="padding:8px;background-color:white;cursor: pointer;"
          pill
          @click="showRemoveModal(file.id)">
          🗑️
        </b-badge>
      </div>
    </b-card>
    <p v-if="files && !files.length"><span>😔</span> <span>بدون نتیجه</span></p>

    <!--    <div class="col-md-12">-->
    <!--&lt;!&ndash;      <b-form dir="rtl" @submit.stop.prevent="sendFile">&ndash;&gt;-->
    <!--&lt;!&ndash;&lt;!&ndash;        <b-form-group&ndash;&gt;&ndash;&gt;-->
    <!--&lt;!&ndash;&lt;!&ndash;          label="نام فایل"&ndash;&gt;&ndash;&gt;-->
    <!--&lt;!&ndash;&lt;!&ndash;          label-cols="12"&ndash;&gt;&ndash;&gt;-->
    <!--&lt;!&ndash;&lt;!&ndash;          label-align="right"&ndash;&gt;&ndash;&gt;-->
    <!--&lt;!&ndash;&lt;!&ndash;          :invalid-feedback="invalidFeedback"&ndash;&gt;&ndash;&gt;-->
    <!--&lt;!&ndash;&lt;!&ndash;          :valid-feedback="validFeedback">&ndash;&gt;&ndash;&gt;-->
    <!--&lt;!&ndash;&lt;!&ndash;          <b-form-input&ndash;&gt;&ndash;&gt;-->
    <!--&lt;!&ndash;&lt;!&ndash;            id="email"&ndash;&gt;&ndash;&gt;-->
    <!--&lt;!&ndash;&lt;!&ndash;            v-model="fileName"&ndash;&gt;&ndash;&gt;-->
    <!--&lt;!&ndash;&lt;!&ndash;            type="text"&ndash;&gt;&ndash;&gt;-->
    <!--&lt;!&ndash;&lt;!&ndash;            :autofocus="true"&ndash;&gt;&ndash;&gt;-->
    <!--&lt;!&ndash;&lt;!&ndash;            placeholder="نام فایل را وارد نمایید"&ndash;&gt;&ndash;&gt;-->
    <!--&lt;!&ndash;&lt;!&ndash;          />&ndash;&gt;&ndash;&gt;-->
    <!--&lt;!&ndash;&lt;!&ndash;        </b-form-group>&ndash;&gt;&ndash;&gt;-->
    <!--&lt;!&ndash;        <b-form-group&ndash;&gt;-->
    <!--&lt;!&ndash;          label="فایل اکسل"&ndash;&gt;-->
    <!--&lt;!&ndash;          label-cols="12"&ndash;&gt;-->
    <!--&lt;!&ndash;          label-align="right">&ndash;&gt;-->
    <!--&lt;!&ndash;          <b-form-file&ndash;&gt;-->
    <!--&lt;!&ndash;            v-model="file"&ndash;&gt;-->
    <!--&lt;!&ndash;            :state="Boolean(file)"&ndash;&gt;-->
    <!--&lt;!&ndash;            placeholder="فایل را انتخاب نمایید"&ndash;&gt;-->
    <!--&lt;!&ndash;            drop-placeholder="فایل را انتخاب نمایید"&ndash;&gt;-->
    <!--&lt;!&ndash;            required&ndash;&gt;-->
    <!--&lt;!&ndash;          >&ndash;&gt;-->
    <!--&lt;!&ndash;          </b-form-file>&ndash;&gt;-->
    <!--&lt;!&ndash;        </b-form-group>&ndash;&gt;-->
    <!--&lt;!&ndash;&lt;!&ndash;        <b-form-group&ndash;&gt;&ndash;&gt;-->
    <!--&lt;!&ndash;&lt;!&ndash;          label="مشتری"&ndash;&gt;&ndash;&gt;-->
    <!--&lt;!&ndash;&lt;!&ndash;          label-cols="12"&ndash;&gt;&ndash;&gt;-->
    <!--&lt;!&ndash;&lt;!&ndash;          label-align="right">&ndash;&gt;&ndash;&gt;-->
    <!--&lt;!&ndash;&lt;!&ndash;          <b-form-select v-model="selected" :options="customersOptions"></b-form-select>&ndash;&gt;&ndash;&gt;-->
    <!--&lt;!&ndash;&lt;!&ndash;        </b-form-group>&ndash;&gt;&ndash;&gt;-->
    <!--&lt;!&ndash;        <div class="w-100 text-right">&ndash;&gt;-->
    <!--&lt;!&ndash;          <b-button :disabled="!file || loading" :variant="(file) ? 'success' : ''"&ndash;&gt;-->
    <!--&lt;!&ndash;                    type="submit">تایید&ndash;&gt;-->
    <!--&lt;!&ndash;          </b-button>&ndash;&gt;-->
    <!--&lt;!&ndash;        </div>&ndash;&gt;-->
    <!--&lt;!&ndash;      </b-form>&ndash;&gt;-->
    <!--    </div>-->
  </b-row>
</template>

<script>
    import Strapi from 'strapi-sdk-javascript/build/main'
    import axios from "axios";
    // const apiUrl = process.env.API_URL || 'http://localhost:1337'
    const apiUrl = process.env.apiUrl
    const strapi = new Strapi(apiUrl)

    export default {
        async created() {
            this.loading = true
            axios.defaults.headers.common.Authorization = 'Bearer ' + this.$store.getters['auth/token'];
            const response = await axios.get(apiUrl + '/upload/files')
            if (response.data) {
                this.files = response.data
            }
            this.loading = false
        },
        name: "AddExcel",
        data() {
            return {
                file_id: '',
                files: [],
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
            showRemoveModal(id) {
                this.file_id = id
                this.$bvModal.show('modal-remove-excel')
            },
            async removeFile() {
                this.$bvModal.hide('modal-remove-excel')
                this.loading = true
                try {
                    const res = await axios({
                        url: apiUrl + "/destroy/" + this.file_id,
                        // url:apiUrl+'/upload/files',
                        // data:{
                        //     id:this.file_id
                        // },
                        method: 'delete',
                    })
                    console.log(res)
                    if (res) {
                        this.files = this.files.filter(f => f.id !== this.file_id)
                        alert('فایل با موفقیت حذف گردید.')
                    }
                } catch (e) {
                    console.log(e)
                    this.loading = false
                    alert("خطا! مجددا تلاش نمایید")
                }
                this.loading = false
                // const entry = await strapi.deleteEntry('excels', this.eid)
                // if (entry) {
                //     this.$store.commit('excels/remove', this.eid)
                //     alert('فایل با موفقیت حذف گردید.')
                // }
                // this.$bvModal.hide('modal-remove-excel')
            },
            async sendFile() {
                this.loading = true
                try {
                    const entity = await axios.get(apiUrl + '/excels?file_name=default')
                    const excel_id = entity.data[0].id
                    const form = new FormData();
                    form.append('ref', 'excel');
                    form.append('refId', entity.data[0].id);
                    form.append('field', 'excel_file');
                    form.append('files', this.file);
                    const files = await strapi.upload(form);
                    const file_id = files[0].id
                    // console.log(files)
                    const response = await axios.post(apiUrl + `/updatehook?id=${excel_id}&file_name=default&file_id=${file_id}`)
                    this.loading = false
                    alert('فایل با موفقیت پردازش شد.')
                    location.reload()
                } catch (e) {
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
  .subtitle-mini {
    font-weight: 400;
    font-size: 22px;
    color: #526488;
    word-spacing: 5px;
    padding-bottom: 5px;
  }

  .label {
    font-weight: bold;
  }
</style>
