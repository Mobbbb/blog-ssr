import { deepClone, sortCallback } from 'umob'
import { axiosFetchHomeListData, axiosFetchScoreMap } from '@/utils/api/home.js'

/**
 * @description 新增筛选项步骤
 * 1、增加渲染筛选面板的state.filterConfig配置
 * 2、popover-filter.vue增加对应渲染节点
 * 3、增加选中数据集合state.selectedFilter的字段配置
 * 4、更新是否已选中当前选项getters.filterSelectedStatusConfig
 * 5、在action/filterDataByConfig中增加数据过滤方法
 */
const initSelectedFilter = {
    label: [],
    rateScore: [0, totalScore],
    hideScore: [],
    others: [],
}

const home = {
    namespaced: true,
    state() {
        return {
            selectedSortType: '',
            selectedYears: '',
            activeMonth: '',
            isLoading: false,
            animationList: [],
            availableDate: {
                years: [],
                months: {},
                yearMonths: {},
            },
            filterSearchTextData: [], // nav高级筛选结果
            filterConfig: { // 首页高级筛选面板的配置
                allLabelArr: [],
                rateScore: rateScoreConfig,
                hideScore: hideScoreConfig,
                others: othersCheckConfig,
            },
            selectedFilter: deepClone(initSelectedFilter), // 首页高级筛选的选中项
            innerPageFilterConfig: [terminationConfig, unratedConfig], // 首页页脚筛选的配置
            innerPageSelectedFilter: [], // 页内筛选的选中项
        }
    },
    getters: {
        showAnimationList(state, getters, rootState) {
            if (rootState.app.searchFlag) {
                return state.filterSearchTextData
            } else {
                return getters.innerPageFilterData
            }
        },
        innerPageFilterData(state) { // 常规展示的年-月数据项
            const currentTimeData = state.animationList.filter((item) => {
                return item.years === state.selectedYears && item.month === state.activeMonth
            })

            // 过滤页脚的筛选项
            return filterDataByOthersCheck(state.innerPageSelectedFilter, currentTimeData)
        },
        filterSelectedStatusConfig(state) { // nav筛选面板选中情况
            const hasSelectedRateScore = state.selectedFilter.rateScore[0] !== 0 
            || state.selectedFilter.rateScore[1] !== totalScore

            return {
                hasSelectedLabel: state.selectedFilter.label.length,
                hasSelectedRateScore,
                hasSelectedHideScore: state.selectedFilter.hideScore.length,
                hasSelectedOthers: state.selectedFilter.others.length,
            }
        },
        hasSelectedFilter(state, getters) { // nav筛选面板是否存在选中项
            return Object.keys(getters.filterSelectedStatusConfig)
                    .filter(key => getters.filterSelectedStatusConfig[key])
                    .length
        },
    },
    mutations: {
        setAvailableDate(state, date) {
            state.availableDate = date
        },
        setFilterSearchTextData(state, list) {
            state.filterSearchTextData = list
        },
        setAnimationList(state, list) {
            state.animationList = list
        },
        setLoadingStatus(state, status) {
            state.isLoading = status
        },
        setInnerPageSelectedFilter(state, data) {
            state.innerPageSelectedFilter = data
        },
        resetSelectedFilter(state) {
            state.selectedFilter = deepClone(initSelectedFilter)
        },
        updateSelectedSortType(state, value) {
            state.selectedSortType = value
        },
        updateYears(state, value) {
            state.selectedYears = value
        },
        updateActiveMonth(state, value) {
            state.activeMonth = value
        },
        updateAndSaveYears(state, value) {
            state.selectedYears = value
            localStorage.setItem('pick-years', value)
        },
        updateAndSaveActiveMonth(state, value) {
            state.activeMonth = value
            localStorage.setItem('pick-month', value)
        },
        sortFilterDataByScore(state, data = []) {
            if (data.length) {
                state.filterSearchTextData = sortDataByScoreHandle(data)
            } else {
                sortDataByScoreHandle(state.filterSearchTextData)
            }
        },
        sortFilterDataByDate(state, data = []) {
            let sortData = data.length ? data : state.filterSearchTextData
            state.filterSearchTextData = sortDataByDateHandle(sortData)
        },
        setAllLabelArr(state, data) {
            state.filterConfig.allLabelArr = data
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
        setSelectedHideScore(state, data) {
            state.selectedFilter.hideScore = data
        },
        setSelectedOthers(state, data) {
            state.selectedFilter.others = data
        },
    },
    actions: {
        initDefaultHomeHeader({ state, commit }) {
            const maxYear = state.availableDate.years[state.availableDate.years.length - 1]
            const monthArr = state.availableDate.yearMonths[maxYear] || []
            const maxMonth = [...monthArr].sort(sortCallback())[0]
            commit('updateYears', maxYear)
            commit('updateActiveMonth', maxMonth)
        },
        initHomeHeader({ state, commit }) {
            const localYears = localStorage.getItem('pick-years')
            const localMonth = localStorage.getItem('pick-month')
            if (!state.availableDate.months[`${localYears}-${localMonth}`]) {
                dispatch('initDefaultHomeHeader')
            } else {
                commit('updateAndSaveYears', localYears)
                commit('updateAndSaveActiveMonth', localMonth)
            }
            commit('updateSelectedSortType', sortListConfig[0].value)
        },
        changeYearsHandle({ state, commit }, direction) {
            let initMonthIndex = null
            months.forEach((item, index) => {
                if (item.value === state.activeMonth) initMonthIndex = index
            })
            if (initMonthIndex === null) return

            const { year, monthIndex } = calcNextDate(state.selectedYears, initMonthIndex, direction, state.availableDate)
            commit('updateAndSaveYears', year)
            commit('updateAndSaveActiveMonth', months[monthIndex].value)
        },
        async getAnimationHandle({ state, commit, dispatch }) { // 数据获取
            if (state.animationList.length) return

            commit('setLoadingStatus', true)
            // 列表数据
            let { data: listData = [] } = await axiosFetchHomeListData() || {}
            // 评分规则
            let { data: scoreMap = {} } = await axiosFetchScoreMap() || {}
            commit('setLoadingStatus', false)
            
            dispatch('setAnimationData', { listData, scoreMap })
        },
        setAnimationData({ commit }, { scoreMap, listData }) {
            const { data, allLabelArr, availableDate } = initHomeListData(scoreMap, listData)
            
            commit('setAllLabelArr', allLabelArr)
            commit('setAnimationList', data)
            commit('setAvailableDate', availableDate)
        },
        /**
         * @description 按筛选条件过滤数据
         * @param {*} store 
         * @param {*} text 输入框内容
         */
        filterDataByConfig({ state, getters, commit, dispatch, rootState }, text) {
            let filterData = [], rawMaterial = []
            const { navSearchMutualExclusion } = rootState.app.currentRoute.meta || {}
            if (navSearchMutualExclusion) {
                rawMaterial = state.animationList
            } else {
                rawMaterial = getters.innerPageFilterData
            }

            // 按输入框内容进行数据筛选
            if (text !== '') {
                filterData = filterDataByText(text, rawMaterial)
            } else {
                filterData = rawMaterial
            }

            // 过滤勾选的label
            if (getters.filterSelectedStatusConfig.hasSelectedLabel) {
                filterData = filterDataByLabel(state.selectedFilter.label, filterData)
            }

            // 过滤评分
            if (getters.filterSelectedStatusConfig.hasSelectedRateScore) {
                filterData = filterDataByRateScore(state.selectedFilter.rateScore, filterData)
            }

            // 过滤隐藏分
            if (getters.filterSelectedStatusConfig.hasSelectedHideScore) {
                filterData = filterDataByHideScore(state.selectedFilter.hideScore, filterData)
            }

            // 过滤其他筛选项
            if (getters.filterSelectedStatusConfig.hasSelectedOthers) {
                filterData = filterDataByOthersCheck(state.selectedFilter.others, filterData)
            }

            if (filterData.length) {
                // 存在需要输出的数据
                // 将当前数据按当前排序方式输出
                // 之后会对数据sort，使用扩展运算符生成新数组
                dispatch('sortDataBySortType', [...filterData])
            } else {
                // 不存在需要输出的数据
                // 直接输出为空
                commit('setFilterSearchTextData', filterData)
            }
        },
        /**
         * @description 若入参不为空，则按入参数据排序输出，否则对当前正在展示的数据进行重新排序
         * @param {*} store
         * @param {*} filterData
         */
        sortDataBySortType({ state, commit }, filterData = []) {
            let sortData = filterData
            
            if (state.selectedSortType === dateType.value) {
                commit('sortFilterDataByDate', sortData)
            } else if (state.selectedSortType === scoreType.value) {
                commit('sortFilterDataByScore', sortData)
            }
        },
    },
}

export default home
