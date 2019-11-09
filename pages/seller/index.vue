<template>
  <div v-if="isLoggedIn">
    <section v-if="loading" class="container-fluid" style="height: 100vh;display: flex; justify-content: center;align-items: center">
      <b-spinner variant="success" type="grow"></b-spinner>
    </section>
    <section v-else class="container-fluid" dir="rtl">
      <div>
        <br>
<!--        <p class="text-right w-100">-->
<!--          <span>تعداد کل آیتم ها:</span>&nbsp;&nbsp;&nbsp;{{sellers.length || 0}}-->
<!--        </p>-->
        <!--<b-row>-->
          <!--<b-col cols="12" class="text-center">-->
            <!--<app-logo/>-->
            <!--<h1 class="title" style="font-weight: bold">-->
              <!--داشبورد اکسل-->
            <!--</h1>-->
            <!--<h2 class="subtitle mt-3" style="">-->
              <!--پنل مدیریت-->
            <!--</h2>-->
          <!--</b-col>-->
        <!--</b-row>-->
        <client-only>
          <div style="display: flex; justify-content: flex-start">
            <div class="form-group mt-3">
              <!--              <input v-model="customer_no" type="text" class="form-control pt-2 pb-2 mt-2"-->
              <!--                     placeholder="کد مشتری را وارد نمایید...">-->
            </div>
            <div class="text-right">
              <span>از تاریخ:</span><br>
              <date-picker v-model="dateFromG"></date-picker>
            </div>
            <br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
            <div class="text-right">
              <span>تا تاریخ:</span><br>
              <date-picker v-model="dateToG" class=""></date-picker>
            </div>
            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
            <div class="form-group mt-4">
              <b-button type="submit" variant="success" @click="searchRangeGlobal">جستجو</b-button>&nbsp;&nbsp;&nbsp;
              <b-button type="submit" variant="danger" @click="removeRangeGlobal" v-if="!is_android">حذف</b-button>
            </div>
          </div>
        </client-only>
        <client-only v-if="!is_android">
          <div style="display: flex; justify-content: flex-start">
            <div class="form-group mt-3">
              <input v-model="seller_no" type="text" class="form-control pt-2 pb-2 mt-2" placeholder="کد فروشنده را وارد نمایید...">
            </div>
            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
            <div class="text-right">
              <span>از تاریخ:</span><br>
              <date-picker v-model="dateFrom"></date-picker>
            </div>
            <br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
            <div class="text-right">
              <span>تا تاریخ:</span><br>
              <date-picker v-model="dateTo" class=""></date-picker>
            </div>
            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
            <div class="form-group mt-4">
              <b-button type="submit" variant="success" @click="searchRange">جستجو</b-button>&nbsp;&nbsp;&nbsp;
              <b-button type="submit" variant="danger" @click="removeRange">حذف</b-button>
            </div>
          </div>
        </client-only>
        <b-modal id="modal-file" dir="ltr" title="مدیریت فایل ها" busy>
          <file-manager></file-manager>
          <div slot="modal-footer"></div>
        </b-modal>
        <b-modal id="modal-new" dir="ltr" title="تعریف اکسل" busy>
          <add-excel></add-excel>
          <div slot="modal-footer"></div>
        </b-modal>
        <b-modal id="modal-new-customer" dir="rtl" title="تعریف مشتری">
          <add-customer></add-customer>
          <div slot="modal-footer"></div>
        </b-modal>
        <b-modal id="modal-edit-excel" dir="rtl" title="ویرایش فایل">
          <edit-excel :eid="eid"></edit-excel>
          <div slot="modal-footer"></div>
        </b-modal>
        <b-modal id="modal-remove-excel" dir="rtl" title="حذف فایل" busy>
          <p class="my-4 subtitle-mini" style="text-align: center"><span>😔</span>آیا از حذف اطمینان دارید؟</p>
          <b-form @submit.stop.prevent="removeExcel" class="text-center">
            <b-button  type="submit">تایید</b-button>
            <b-button @click="$bvModal.hide('modal-remove-excel')">لغو</b-button>
          </b-form>
          <div slot="modal-footer"></div>
        </b-modal>
        <b-row aling-h="start">
          <div class="col-md-3" v-if="!is_android">
            <div class="form-group mt-3">
              <input v-model="seller_no_query" type="text" class="form-control pt-4 pb-4" placeholder="جستجوی کد فروشنده...">
            </div>
            <div class="form-group">
              <b-button @click="searchSellerNo">جستجو</b-button>
            </div>
          </div>
          <div class="col-md-3" v-if="!is_android">
            <div class="form-group mt-3">
              <input v-model="seller_name_query" type="text" class="form-control pt-4 pb-4" placeholder="جستجوی نام فروشنده...">
            </div>
            <div class="form-group">
              <b-button @click="searchSellerName">جستجو</b-button>
            </div>
          </div>
          <div class="col-md-3">
            <div class="form-group mt-3">
              <input v-model="seller_product_query" type="text" class="form-control pt-4 pb-4" placeholder="جستجوی محصول...">
            </div>
            <div class="form-group">
              <b-button @click="searchProduct">جستجو</b-button>
            </div>
          </div>
          <b-col align-h="start">
            <b-col class="" v-if="!is_android">
              <b-button variant="success" class="mt-1" v-b-modal.modal-new dir="rtl">تعریف اکسل</b-button>
            </b-col>
            <b-col class="">
              &nbsp;&nbsp;&nbsp;<b-button variant="info" class="mt-1" @click="reload" dir="rtl">بارگذاری مجدد</b-button>
            </b-col>
            <b-col class="" v-if="!is_android">
              <b-button variant="warning" class="mt-1" v-b-modal.modal-file dir="rtl">مدیریت فایل</b-button>
            </b-col>
          </b-col>
        </b-row>
        <hr>
        <br>
        <br>
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
        <b-row align-h="start" class="container-fluid">
          <b-card
            v-if="filteredList && filteredList.length"
            v-for="seller in filteredList"
            :key="seller.id"
            class="card"
          >
            <div class="card-body">
              <h5 class="card-title subtitle-mini"><p class="ml-1">📝</p>{{ seller.seller_name || 'بدون نام'}}</h5>
              <div class="card-text subtitle-mini"><p class="label">کد فروشنده:</p>&nbsp;{{ seller.seller_no || 'کد فروشنده ثبت نشده است' }}</div>
              <br>
              <div class="card-text subtitle-mini"><p class="label">کد فاکتور:</p>{{ seller.record_no || 'شرحی ثبت نشده است' }}</div>
              <br>
              <div class="card-text subtitle-mini"><p class="label">تاریخ:</p>&nbsp;{{ seller.date | moment("jYYYY/jMM/jDD") || 'تاریخ ثبت نشده است' }}</div>
              <br>
              <div class="card-text subtitle-mini"><p class="label">تاریخ انقضا:</p>&nbsp;{{ seller.expire_date | moment("jYYYY/jMM/jDD") || 'تاریخ انقضا ثبت نشده است' }}</div>
              <br>
              <p class="card-text subtitle-mini">{{ seller.description || 'شرحی ثبت نشده است' }}</p>
              <div class="card-text subtitle-mini"><p class="label" style="color: cornflowerblue">نام محصول:</p>&nbsp;<span class="subtitle-mini" style="color: cornflowerblue">{{ seller.product || 'نام محصول ثبت نشده است' }}</span></div>
              <br>
              <p class="card-text subtitle-mini"><span class="label">کد محصول:</span>&nbsp;{{ seller.product_no || 'کد محصول ثبت نشده است' }}</p>
              <div class="card-text subtitle-mini" ><p class="label" style="color: #41b883">قابل پرداخت:</p>&nbsp;<span class="subtitle-mini label" style="color: #41b883">{{ seller.payment || ' ثبت نشده است' }}</span></div>
              <br>
              <p class="card-text subtitle-mini"><span class="label">واحد:</span>&nbsp;{{ seller.first_unit || ' ثبت نشده است' }}</p>
              <p class="card-text subtitle-mini"><span class="label">مقدار:</span>&nbsp;{{ seller.quantity || ' ثبت نشده است' }}</p>
              <p class="card-text subtitle-mini"><span class="label">نرخ:</span>&nbsp;{{ seller.rate || ' ثبت نشده است' }}</p>
<!--              <p class="subtitle-mini">مشتری ثبت نشده است</p>-->
<!--              <b-badge class="subtitle-icon" style="padding:8px;background-color:white;cursor: pointer;"-->
<!--                       @click="editFile(excel.id)" pill>🖊️-->
<!--              </b-badge>-->
<!--              <b-badge class="subtitle-icon" style="padding:8px;background-color:white;cursor: pointer;" pill-->
<!--                       @click="showRemoveModal(excel.id)">🗑️-->
<!--              </b-badge>-->
<!--              <router-link v-if="excel.customer" :to="{ name: 'customers-id', params: { id: excel.customer.id }}"-->
<!--                           tag="a"-->
<!--                           class="btn btn-primary">-->
<!--                مشاهدۀ مشتری-->
<!--              </router-link>-->
            </div>
          </b-card>
          <p v-if="filteredList && !filteredList.length"><span>😔</span> <span>بدون نتیجه</span></p>
        </b-row>
      </div>
    </section>
  </div>
</template>

<script>
    import moment from 'moment-jalaali'
    import qs from 'qs'
  import axios from "axios";

  import AppLogo from '~/components/AppLogo.vue'
  import AddExcel from '~/components/AddExcel.vue'
  import EditExcel from '~/components/EditExcel.vue'
  import AddCustomer from '~/components/AddCustomer.vue'
  import Strapi from 'strapi-sdk-javascript/build/main'
  import {mapGetters} from 'vuex'
    import FileManager from '@/components/FileManager.vue'

  import SellersQueryParam from '@/apollo/queries/SellersQueryParam.gql'


  // const apiUrl = process.env.API_URL || ''
  const apiUrl = process.env.apiUrl
  const strapi = new Strapi(apiUrl)

  export default {
      apollo: {
          sellers: {
              manual:true,
              prefetch:false,
              query: SellersQueryParam,
              fetchPolicy: 'no-cache',
              variables(){
                  return {
                      start: this.start,
                      limit: this.limit,
                      sort:'id:asc',
                      where:this.where
                  }
              },
              watchLoading(isLoading) {
                  // => it would be great if the isLoading variable could be synchronized with the nuxt state change behaviour
                  // following is not working:
                  this.loading = !!isLoading;
              },
              result ({ data, loading, networkStatus }) {
                  if(!loading){
                      this.sellers = data.sellers
                  }
              },
              error (error) {
                  // alert("خطا! لطفاً صفحه را مجدد بارگذاری نمایید.")
                  console.error('We\'ve got an error!', error)
              },
          },
      },
      async created(){
          const user = this.$store.getters['auth/user']
          if (user && user.role && user.role.name) {
              if (user.role.name == "Authenticated") {
                  this.is_android = false
                  console.log(user.role.name)
              } else if (user.role.name == 'android') {
                  this.is_android = true
                  this.customer_no = this.$store.getters['auth/username']
                  console.log(user.role.name)
              } else {
                  console.log('NO ROLE!')
                  this.$router.push('/')
                  this.$store.commit('auth/setUser',null)
                  return
              }
          }
          else {
              console.log('NO ROLE!')
              this.$router.push('/')
              this.$store.commit('auth/setUser',null)
              return
          }
          await this.$apolloHelpers.onLogin(`${this.$store.getters['auth/token']}`)
          this.reload()
      },
      async beforeDestroy(){
          const client = this.$apolloProvider.defaultClient
          await client.queryManager.fetchQueryRejectFns;
          await client.clearStore()
      },
      async mounted(){
      },
    data() {
      return {
          is_android:false,
          where:{},
          seller_no_query:'',
          seller_name_query:'',
          seller_product_query:'',
          maxVisibleButtons:3,
          currentPage:1,
          totalPages:null,
          start:0,
          limit:100,
          loading: false,
          seller_no:'',
          dateFrom:'',
          dateFromG:'',
          dateTo:'',
          dateToG:'',
          sellers:[],
          query: '',
          queryCustomer: '',
          eid: '',
      }
    },
    components: {
        datePicker: () => import('vue-persian-datetime-picker'),
        'file-manager':FileManager,
        AppLogo,
        AddExcel,
        AddCustomer,
        EditExcel,
    },
    methods: {
        resetCursor() {
            if(!this.is_android){
              this.where = {}
            } else{
                if(!this.seller_no){
                    this.$router.push('/')
                    this.$store.commit('auth/setUser',null)
                    return
                }
                this.where = {'seller_no':this.seller_no}
            }
            this.start = 0
            this.currentPage = 1
        },
        async reload(){
            this.loading = true
            const client = this.$apolloProvider.defaultClient
            await client.queryManager.fetchQueryRejectFns;
            await client.clearStore()
            this.resetCursor()
            if (!this.isLoggedIn) {
                this.$router.push('/')
                this.$store.commit('auth/setUser',null)
                return
            }
            axios.defaults.headers.common.Authorization = 'Bearer ' + this.$store.getters['auth/token'];
            let resp = null
            if(!this.is_android){
               resp = await axios.get(apiUrl + '/sellers/count')
            }
            else {
                if(!this.seller_no){
                    this.$router.push('/')
                    this.$store.commit('auth/setUser',null)
                    return
                }
               resp = await axios.get(apiUrl + '/sellers/count?seller_no'+this.seller_no)
            }
            if (resp && resp.data) {
                this.totalPages = Math.ceil(resp.data / 100)
                if (!this.totalPages) {
                    alert("داده ای یافت نشد.")
                    this.loading = false
                    return
                }
                console.log('total pages: ', this.totalPages)
            } else {
                alert("داده ای یافت نشد.")
                this.loading = false
                return
            }
            this.loading = false
            await this.$apollo.queries.sellers.refetch()
        },
        async searchSellerNo(){
            if(!this.seller_no_query){
                alert("کد فروشنده را وارد نمایید!")
                return
            }
            if (!this.isLoggedIn) {
                this.$router.push('/')
                this.$store.commit('auth/setUser',null)
                return
            }
            const resp = await axios.get(apiUrl + `/sellers/count?seller_no_contains=${this.seller_no_query}`)
            if (resp.data) {
                // console.log(resp.data)
                this.totalPages = Math.ceil(resp.data / 100)
                if (!this.totalPages) {
                    alert("داده ای یافت نشد.")
                    return
                }
                console.log('total pages: ', this.totalPages)
            } else {
                alert("داده ای یافت نشد.")
                return
            }
            this.resetCursor()
            this.where['seller_no_contains'] = this.seller_no_query
            console.log('where? ',this.where)
            await this.$apollo.queries.sellers.refetch()
        },
        async searchSellerName(){
            if(!this.seller_name_query){
                alert("نام فروشنده را وارد نمایید!")
                return
            }
            if (!this.isLoggedIn) {
                this.$router.push('/')
                this.$store.commit('auth/setUser',null)
                return
            }
            const resp = await axios.get(apiUrl + `/sellers/count?seller_name_contains=${this.seller_name_query}`)
            if (resp.data) {
                // console.log(resp.data)
                this.totalPages = Math.ceil(resp.data / 100)
                if (!this.totalPages) {
                    alert("داده ای یافت نشد.")
                    return
                }
                console.log('total pages: ', this.totalPages)
            } else {
                alert("داده ای یافت نشد.")
                return
            }
            this.resetCursor()
            this.where['seller_name_contains'] = this.seller_name_query
            console.log('where? ',this.where)
            await this.$apollo.queries.sellers.refetch()
        },
        async searchProduct(){
            if(!this.seller_product_query){
                alert("نام محصول را وارد نمایید!")
                return
            }
            if (!this.isLoggedIn) {
                this.$router.push('/')
                this.$store.commit('auth/setUser',null)
                return
            }
            this.loading = true
            let resp = null
            if(!this.is_android){
              resp = await axios.get(apiUrl + '/sellers/count?product_contains='+this.seller_product_query)
            }
            else{
              resp = await axios.get(apiUrl + '/sellers/count?product_contains='+this.seller_product_query+'&seller_no='+this.seller_no)
            }
            if (resp && resp.data) {
                // console.log(resp.data)
                this.totalPages = Math.ceil(resp.data / 100)
                if (!this.totalPages) {
                    alert("داده ای یافت نشد.")
                    return
                }
                console.log('total pages: ', this.totalPages)
            } else {
                alert("داده ای یافت نشد.")
                this.loading = false
                return
            }
            this.resetCursor()
            this.where['product_contains'] = this.seller_product_query
            console.log('where? ',this.where)
            await this.$apollo.queries.sellers.refetch()
        },
        async movePage(i){
            if(i <= 0){
                return
            }
            this.currentPage = i
            this.start =  (i-1) * this.limit
            await this.$apollo.queries.sellers.start()
        },
        async searchRangeGlobal(){
            try {
                this.loading = true
                const fdateFrom = moment(this.dateFromG, "jYYYY/jMM/jDD").format("YYYY-MM-DDTHH:mm:ss")
                const fdateTo = moment(this.dateToG, "jYYYY/jMM/jDD").format("YYYY-MM-DDTHH:mm:ss")
                let response = null
                if(!this.is_android){
                   response = await axios.get(apiUrl + `/sellers/count?date_gte=${fdateFrom}&date_lt=${fdateTo}`)
                }
                else {
                   response = await axios.get(apiUrl + `/sellers/count?date_gte=${fdateFrom}&date_lt=${fdateTo}&seller_no=${this.seller_no}`)
                }
                if (response.data == null || !response.data) {
                    alert("داده ای یافت نشد")
                    this.loading = false
                    return
                }
                this.totalPages = Math.ceil(response.data / 100)
                if (!this.totalPages) {
                    alert("داده ای یافت نشد.")
                    this.loading = false
                    return
                }
                console.log('total pages: ', this.totalPages)
                this.resetCursor()
                this.where['date_gte'] = fdateFrom
                this.where['date_lt'] = fdateTo
                console.log('where? ',this.where)
                await this.$apollo.queries.sellers.refetch()
            } catch (e) {
                console.log(e)
                this.loading = false
            }
        },
        async searchRange(){
            if (!this.seller_no) {
                alert("شمارۀ فروشنده را مشخص نمایید")
                return
            }
            try {
                this.loading = true
                const fdateFrom = moment(this.dateFrom, "jYYYY/jMM/jDD").format("YYYY-MM-DDTHH:mm:ss")
                const fdateTo = moment(this.dateTo, "jYYYY/jMM/jDD").format("YYYY-MM-DDTHH:mm:ss")
                const response = await axios.get(apiUrl + `/sellers/count?date_gte=${fdateFrom}&date_lt=${fdateTo}&seller_no=${this.seller_no}`)
                if (response.data == null || !response.data) {
                    alert("داده ای یافت نشد")
                    this.loading = false
                    return
                }
                this.totalPages = Math.ceil(response.data / 100)
                if (!this.totalPages) {
                    alert("داده ای یافت نشد.")
                    this.loading = false
                    return
                }
                console.log('total pages: ', this.totalPages)
                this.resetCursor()
                this.where['date_gte'] = fdateFrom
                this.where['date_lt'] = fdateTo
                this.where['seller_no'] = this.seller_no
                console.log('where? ',this.where)
                await this.$apollo.queries.sellers.refetch()
            } catch (e) {
                console.log(e)
                this.loading = false
            }
        },

        async removeRange(){
            if(!this.seller_no){
                alert("شمارۀ فروشنده را مشخص نمایید")
                return
            }
            try{
              this.loading = true
              const fdateFrom = moment( this.dateFrom ,"jYYYY/jMM/jDD").format("YYYY-MM-DDTHH:mm:ss")
              const fdateTo =  moment(this.dateTo,"jYYYY/jMM/jDD").format("YYYY-MM-DDTHH:mm:ss")
              const response = await axios.get(apiUrl+`/sellers/count?date_gte=${fdateFrom}&date_lt=${fdateTo}&seller_no=${this.seller_no}`)
              if(response.data == null){
                  alert("داده ای یافت نشد")
                  return
              }
              this.totalPages = Math.ceil(response.data / 100)
              if (!this.totalPages) {
                  alert("داده ای یافت نشد.")
                  this.loading = false
                  return
              }
              console.log('total pages: ', this.totalPages)
                this.resetCursor()
                this.where['date_gte'] = fdateFrom
                this.where['date_lt'] = fdateTo
                this.where['seller_no'] = this.seller_no
                console.log('where? ',this.where)
                console.log("Total Pages: ", this.totalPages)
                var targets = []
                for(var i = 0; i< this.totalPages; i++){
                    try{
                        const resp = await axios.get(apiUrl+
                            `/sellers?_start=${this.start}&date_gte=${this.where['date_gte']}&date_lt=${this.where['date_lt']}&seller_no=${this.where['seller_no']}`)
                        if(resp.data){
                            resp.data.forEach(c => targets.push(c.id))
                        }
                        else{
                            targets = []
                            continue
                        }
                        console.log("Targets: ",targets)
                    }
                    catch (e) {
                        console.log("TARGETS! ", e.message)
                        continue
                    }
                    try{
                        if(targets){
                            const re = await axios({
                                url:apiUrl+'/sellers/destroy',
                                method:'post',
                                data:{
                                    id:targets
                                },
                                // config: { headers: {'Content-Type': 'application/x-www-form-urlencoded' }}
                            })
                            console.log(re)
                            // const re = await strapi.deleteEntry(
                            // const re = await strapi.deleteEntry(
                            //     'sellers',targets)
                        }
                    } catch (err) {
                        console.log("DELETE! ",err)
                        continue
                    }
                    targets = []
                }
              alert("حذف با موفقیت انجام شد")
              this.reload()
            }
            catch (e) {
                console.log(e)
                this.loading = false
            }
        },
        async removeRangeGlobal(){
            try {
                this.loading = true
                const fdateFrom = moment(this.dateFromG, "jYYYY/jMM/jDD").format("YYYY-MM-DDTHH:mm:ss")
                const fdateTo = moment(this.dateToG, "jYYYY/jMM/jDD").format("YYYY-MM-DDTHH:mm:ss")
                const response = await axios.get(apiUrl +
                    `/sellers/count?date_gte=${fdateFrom}&date_lt=${fdateTo}`)
                if (response.data == null || !response.data) {
                    alert("داده ای یافت نشد")
                    this.loading = false
                    return
                }
                this.totalPages = Math.ceil(response.data / 100)
                if (!this.totalPages) {
                    alert("داده ای یافت نشد.")
                    this.loading = false
                    return
                }
                console.log('total pages: ', this.totalPages)
                this.resetCursor()
                this.where['date_gte'] = fdateFrom
                this.where['date_lt'] = fdateTo
                console.log('where? ',this.where)
                var targets = []
                console.log("Total Pages: ", this.totalPages)
                for(var i = 1; i <= this.totalPages; i++){
                    try{
                        const resp = await axios.get(apiUrl+`/sellers?_start=${this.start}&date_gte=${this.where['date_gte']}&date_lt=${this.where['date_lt']}`)
                        if(resp.data){
                            resp.data.forEach(c => targets.push(c.id))
                        }
                        else{
                            targets = []
                            continue
                        }
                        // await strapi.deleteEntry('sellers', targets)
                        // console.log("Targets: ",targets)
                    }
                    catch (e) {
                        console.log("DELETE! ", e.message)
                        continue
                    }
                    try{
                        if(targets){
                            const re = await axios({
                                url:apiUrl+'/sellers/destroy',
                                method:'post',
                                data:{
                                    id:targets
                                },
                                // config: { headers: {'Content-Type': 'application/x-www-form-urlencoded' }}
                            })
                            console.log(re)
                            // const re = await strapi.deleteEntry(
                            // const re = await strapi.deleteEntry(
                            //     'sellers',targets)
                        }
                    } catch (err) {
                        console.log("DELETE! ",err)
                        continue
                    }
                    targets = []
                    // for(var id of targets){
                    //     // console.log("ID ?", id.id)
                    //     try{
                    //         if(id){
                    //             await strapi.deleteEntry('sellers', id.id)
                    //             // console.log(re)
                    //         }
                    //         else{
                    //
                    //         }
                    //     }
                    //     catch(err){
                    //         console.log("DELETE! ",err)
                    //
                    //     }
                    // }
                }
                alert("حذف با موفقیت انجام شد.")
                this.reload()
            } catch (e) {
                console.log(e)
                this.loading = false
            }
        },
      showRemoveModal(id) {
        this.eid = id
        this.$bvModal.show('modal-remove-excel')
      },
      async removeExcel() {
        const entry = await strapi.deleteEntry('excels', this.eid)
        if (entry) {
          this.$store.commit('excels/remove', this.eid)
          alert('فایل با موفقیت حذف گردید.')
        }
        this.$bvModal.hide('modal-remove-excel')
      },
      editFile(id) {
        this.eid = id
        this.$bvModal.show('modal-edit-excel')
      },

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
            const range = [];

            for (let i = this.startPage;
                 i <= this.endPage;
                 i+= 1 ) {
                if(i<=0){
                    continue
                }
                range.push({
                    name: i,
                    isDisabled: i === this.currentPage
                });
            }

            return range;
        },
        isLoggedIn(){
            return this.$store.getters['auth/username']
        },
        // loading(){
        //     return this.$store.getters['sellers/loading']
        // },
      filteredList(){
        if(this.query === ""){
            return this.sellers
        }
        return this.sellers && this.sellers.filter(seller => {
          return (seller.seller_name && seller.seller_name.includes(this.query)) ||
            (seller.seller_no && seller.seller_no.toLowerCase().includes(this.query.toLowerCase())) ||
            (seller.record_no && seller.record_no.toLowerCase().includes(this.query.toLowerCase())) ||
            (seller.date && seller.date.toLowerCase().includes(this.query.toLowerCase())) ||
            (seller.expire_date && seller.expire_date.toLowerCase().includes(this.query.toLowerCase())) ||
            (seller.product && seller.product.includes(this.query)) ||
            (seller.product_no && seller.product_no.toLowerCase().includes(this.query.toLowerCase())) ||
            (seller.first_unit && seller.first_unit.toLowerCase().includes(this.query.toLowerCase())) ||
            (seller.description && seller.description.includes(this.query))
        })
      },
      // sellers(){
      //   return this.$store.getters['sellers/list']
      // }
    },
  }
</script>

<style>
  .label{
    font-weight: bold;
  }
  .card {
    margin: 15px;
    max-width: 20rem;
    text-align: center;
    box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.5);
  }

  .card:hover {
    box-shadow: 20px 20px 40px 0 rgba(0, 0, 0, 0.5);
  }

  .container {
    min-height: 100vh;
    display: flex;
    justify-content: center;
    align-items: center;
    text-align: center;
  }

  .title {
    font-family: "Quicksand", "Source Sans Pro", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif; /* 1 */
    display: block;
    font-weight: 300;
    font-size: 100px;
    color: #35495e;
    letter-spacing: 1px;
  }

  .subtitle {
    font-weight: 300;
    font-size: 42px;
    color: #526488;
    word-spacing: 5px;
    padding-bottom: 15px;
  }

  .subtitle-mini {
    font-weight: 400;
    font-size:23px;
    color: #526488;
    word-spacing: 5px;
    padding-bottom: 5px;
  }

  .subtitle-icon {
    font-weight: 400;
    font-size: 22px;
    color: #526488;
    word-spacing: 5px;
    padding-bottom: 5px;
  }

  .links {
    padding-top: 15px;
  }
</style>

