export const state = () => ({
  list: [],
  loading:true,
})

export const mutations = {
  add(state, excel) {
    state.list.push(excel)
  },
  emptyList(state) {
    state.list = []
  },
  /*TODO test*/
  remove(state, id) {
    state.list.splice(state.list.findIndex(item => item.id === id), 1)
  },
  /*TODO test*/
  update(state, excel) {
    const idx = state.list.findIndex(item => item.id === excel.id)
    state.list.splice(idx, 1, excel)
  },
  loading(state, loading){
    state.loading = loading
  }


}

export const getters = {
  list: state => state.list,
  byId: state => id => {
    return state.list.find(item => item.id === id)
  },
  loading: state => state.loading
}
