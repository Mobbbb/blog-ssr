import { useStore } from 'vuex'

export default defineNuxtRouteMiddleware((to, from) => {
	const store = new (useStore as any)()

	const updateActiveNavIndex = (path: string) => store.commit('app/updateActiveNavIndex', path)
	const updateInputValue = (val: string) => store.commit('app/updateInputValue', val)
	const updateSearchFlag = (flag: boolean) => store.commit('app/updateSearchFlag', flag)
	const updateHistoryRouters = (val: string) => store.commit('app/updateHistoryRouters', val)
	
	const { name: toName } = to
	const { name: fromName } = from
	if (typeof toName === 'string' && typeof fromName === 'string') {
		const toItem = routeMap[toName] || {}
		const fromItem = routeMap[fromName] || {}
		updateHistoryRouters(toItem.name)
		
		const { parent: toParentName } = toItem.meta || {}
		const { parent: fromParentName } = fromItem.meta || {}
		updateActiveNavIndex(to.path)
		// 重置搜索态，父子路由的切换无需重置
		if (store.state.app.searchFlag && fromName !== toParentName && toName !== fromParentName) {
			// 清空输入框，重置搜索状态
			updateInputValue('')
			updateSearchFlag(false)
		}
	}
})