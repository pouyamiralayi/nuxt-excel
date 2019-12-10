<template>
  <section v-if="loading" class="container-fluid"
           style="height: 60vh;display: flex; justify-content: center;align-items: center">
    <b-spinner variant="success" type="grow"></b-spinner>
  </section>
  <b-row v-else class="container-fluid" align-h="center">
    <b-row align-h="center" class="container-fluid">
      <b-button
        :disabled="currentPage === 1"
        @click="movePage(1)"
      >ابتدا</b-button>&nbsp;&nbsp;&nbsp;
      <b-button
        v-for="page in pages"
        :key="page.name"
        @click="movePage(page.name)"
        :disabled="page.isDisabled"
      >{{page.name}}</b-button>
      &nbsp;&nbsp;&nbsp;<b-button
      @click="movePage(totalPages)" :disabled="currentPage === totalPages">انتها</b-button>&nbsp;&nbsp;&nbsp;
    </b-row>
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
          <p class="label">:نام فایل</p>
          <span class="ml-1">📝</span>{{file.name}}
        </h5>
        <div class="card-text subtitle-mini">
          <p class="label">:تاریخ بارگذاری </p>&nbsp;{{file.created_at | moment("jYYYY/jMM/jDD") || 'تاریخ ثبت نشده است'
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
    <b-row align-h="center" class="container-fluid">
      <b-button
        :disabled="currentPage === 1"
        @click="movePage(1)"
      >ابتدا</b-button>&nbsp;&nbsp;&nbsp;
      <b-button
        v-for="page in pages"
        :key="page.name"
        @click="movePage(page.name)"
        :disabled="page.isDisabled"
      >{{page.name}}</b-button>
      &nbsp;&nbsp;&nbsp;<b-button
      @click="movePage(totalPages)" :disabled="currentPage === totalPages">انتها</b-button>&nbsp;&nbsp;&nbsp;
    </b-row>
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
            const res = await axios.get(apiUrl + `/upload/files/count`)
            if (res.data == null || !res.data) {
                alert("داده ای یافت نشد")
                this.loading = false
                return
            }
            this.totalPages = Math.ceil(res.data.count / 100)
            await this.getFiles()
        },
        name: "AddExcel",
        data() {
            return {
                currentPage:1,
                totalPages:null,
                maxVisibleButtons:3,
                start:0,
                limit:100,
                file_id: '',
                files: [],
                invalidFeedback: 'مشتری را مشخص نمایید',
                validFeedback: '',
                fileName: '',
                file: false,
                loading: false,
                selected: null,
            }
        },
        methods: {
            async getFiles(){
                try{
                  const response = await axios.get(apiUrl + '/upload/files?_start='+this.start)
                  if (response.data) {
                      this.files = response.data
                  }
                }
                catch(e) {console.log(e)}
                this.loading = false
            },
            async movePage(i){
                if(i <= 0){
                    return
                }
                this.currentPage = i
                this.start =  (i-1) * this.limit
                await this.getFiles()
            },
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
            startPage() {
                // When on the first page
                console.log('currentPage: ',this.currentPage)
                if (this.currentPage === 1) {
                    return 1;
                }
                // When on the last page
                if (this.currentPage === this.totalPages) {
                    return this.totalPages - this.maxVisibleButtons;
                }
                // When in between
                return this.currentPage - 1;
            },
            endPage() {
                return Math.min(this.startPage + this.maxVisibleButtons - 1, this.totalPages);
            },
            pages() {
                const pages = [];

                for (let i = this.startPage;
                     i <= this.endPage;
                     i+= 1 ) {
                    if(i<=0){
                        continue
                    }
                    pages.push({
                        name: i,
                        isDisabled: i === this.currentPage
                    });
                }

                return pages;
            },
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
