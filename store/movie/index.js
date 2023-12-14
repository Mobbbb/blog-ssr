import { 
    filterDataByRateScore, 
    filterDataByText,
    initMovieListData,
    filterDataByLabel,
    sortDataByDateHandle,
    sortDataByScoreHandle,
 } from '@/libs/data-processing'
import { axiosFetchMovieListData } from '@/libs/api/movie.js'
import { deepClone } from 'umob'

const initSelectedFilter = {
    label: [],
    rateScore: [0, totalScore],
}

const movie = {
    namespaced: true,
    state() {
        return {
            selectedSortType: '',
            isLoading: false,
            movieList: [],
            filterSearchTextData: [],
            filterConfig: {
                allLabelArr: [],
                rateScore: rateScoreConfig,
            },
            selectedFilter: deepClone(initSelectedFilter),
        }
    },
    getters: {
        showMovieList(state, getters, rootState) {
            let showData = []
            if (rootState.app.searchFlag) {
                showData = [...state.filterSearchTextData]
            } else {
                showData = [...getters.innerPageFilterData]
            }

            if (state.selectedSortType === dateType.value) {
                showData = sortDataByDateHandle(showData)
            } else if (state.selectedSortType === scoreType.value) {
                showData = sortDataByScoreHandle(showData)
            }

            return showData
        },
        innerPageFilterData(state) {
            return state.movieList
        },
        filterSelectedStatusConfig(state) { // nav筛选面板选中情况
            const hasSelectedRateScore = state.selectedFilter.rateScore[0] !== 0 
            || state.selectedFilter.rateScore[1] !== totalScore

            return {
                hasSelectedLabel: state.selectedFilter.label.length,
                hasSelectedRateScore,
            }
        },
        hasSelectedFilter(state, getters) { // nav筛选面板是否存在选中项
            return Object.keys(getters.filterSelectedStatusConfig)
                    .filter(key => getters.filterSelectedStatusConfig[key])
                    .length
        },
    },
    mutations: {
        setFilterSearchTextData(state, value) {
            state.filterSearchTextData = value
        },
        setMovieList(state, value) {
            state.movieList = value
        },
        setLoadingStatus(state, status) {
            state.isLoading = status
        },
        resetSelectedFilter(state) {
            state.selectedFilter = deepClone(initSelectedFilter)
        },
        setSelectedLabel(state, data) {
            if (!state.selectedFilter.label.includes(data)) {
                state.selectedFilter.label.push(data)
            } else {
                state.selectedFilter.label.remove(data)
            }
        },
        setSelectedRateScore(state, data) {
            state.selectedFilter.rateScore = data
        },
        setAllLabelArr(state, data) {
            state.filterConfig.allLabelArr = data
        },
        updateSelectedSortType(state, value) {
            state.selectedSortType = value
        },
    },
    actions: {
        async getMovieListHandle({ state, commit, dispatch }) { // 数据获取
            if (state.movieList.length) return

            commit('setLoadingStatus', true)
            const { data: listData = [] } = await axiosFetchMovieListData() || {}
            commit('setLoadingStatus', false)

            dispatch('setMovieData', listData)
        },
        async setMovieData({ commit }, params) {
            const { data, allLabelArr } = initMovieListData(params)
            
            commit('setAllLabelArr', allLabelArr)
            commit('setMovieList', data)
            commit('updateSelectedSortType', sortListConfig[0].value)
        },
        /**
         * @description 按筛选条件过滤数据
         * @param {*} store 
         * @param {*} text 输入框内容
         */
        filterDataByConfig({ state, getters, commit }, { text }) {
            let filterData = []

            // 按输入框内容进行数据筛选
            if (text !== '') {
                filterData = filterDataByText(text, state.movieList)
            } else {
                filterData = state.movieList
            }

            // 过滤勾选的label
            if (getters.filterSelectedStatusConfig.hasSelectedLabel) {
                filterData = filterDataByLabel(state.selectedFilter.label, filterData)
            }

            // 过滤评分
            if (getters.filterSelectedStatusConfig.hasSelectedRateScore) {
                filterData = filterDataByRateScore(state.selectedFilter.rateScore, filterData)
            }
            
            commit('setFilterSearchTextData', filterData)
        },
    },
}

export default movie
