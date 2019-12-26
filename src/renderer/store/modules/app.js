import { fetchList } from '@/api'
// app状态管理
const app = {
  state: {
    list: []
  },
  mutations: {
    setList (state, arr) {
      state.list = arr
    }
  },
  actions: {
    fetchList ({ commit }) {
      fetchList().then(res => {
        console.log(res)
        if (res.data.categories) {
          commit('setList', res.data.categories)
        }
      })
    }
  }
}

export default app
