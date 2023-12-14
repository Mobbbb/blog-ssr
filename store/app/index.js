const app = {
    namespaced: true,
    state() {
        return {
            navHeight: 60,
            mainGap: [32, 0, 8, 0],
            mainWidth: {
                width: 0.58,
                minWidth: 922,
            },

            installConfig: {
                appPromptEvent: null,
                showBtn: false,
            },

            searchText: '',
            searchFlag: false,
            activeNavIndex: '',

            debuggerText: '',
            showDebugger: false,
            historyRouters: {},
        }
    },
    getters: {
        mainStyle(state) {
            return {
                marginTop: `${state.mainGap[0]}px`,
                width: `${state.mainWidth.width * 100}%`,
                minWidth: `${state.mainWidth.minWidth}px`,
                height: `calc(100% - ${state.mainGap[0] + state.mainGap[2]}px)`,
            }
        },
    },
    mutations: {
        updateHistoryRouters(state, value) {
            state.historyRouters[value] = 1
        },
        updateInputValue(state, value) {
            state.searchText = value
        },
        updateSearchFlag(state, value) {
            state.searchFlag = value
        },
        updateActiveNavIndex(state, value) {
            state.activeNavIndex = value
        },
        updateDebuggerText(state, value) {
            state.debuggerText = value
        },
        updateDebuggerShowStatus(state, value) {
            state.showDebugger = value
        },
        setAppPromptEvent(state, event) {
            state.installConfig.appPromptEvent = event
        },
        setInstallBtnShowStatus(state, status) {
            state.installConfig.showBtn = status
        },
    },
    actions: {
        searchHandle({ state, rootGetters, commit, dispatch }, route) {
            const searchRouteList = [homeRoute.name, movieRoute.name, summaryRoute.name]

            if (!searchRouteList.includes(route.name)) return

            if (state.searchText === 'MOBBBB') {
                commit('updateDebuggerShowStatus', true)
            } else if (state.searchText.trim() === '' && !rootGetters[`${route.name}/hasSelectedFilter`]) {
                commit('updateSearchFlag', false)
            } else {
                commit('updateSearchFlag', true)
                dispatch(`${route.name}/filterDataByConfig`, {
                    text: state.searchText,
                    ...(route.meta || {}),
                }, { root: true })
            }
        },
        dispatchCommit({ commit }, { commitName, data = {} }) {
            commit(commitName, data, { root: true })
        },
        registerServiceWorker({ commit }) {
            window.addEventListener('load', function() {
				if ('serviceWorker' in navigator) {
                    navigator.serviceWorker.register('/sw.js')
				}
				window.addEventListener('beforeinstallprompt', (event) => { // 若当前未安装
					event.preventDefault()
					commit('setAppPromptEvent', event)
					commit('setInstallBtnShowStatus', true)
				})
				window.addEventListener('appinstalled', () => { // 已安装
					commit('setInstallBtnShowStatus', false)
				})
			})
        },
    },
}

export default app
