<template>
	<div class="app-main" :style="appMainStyle" @click="handleSelect" @touchmove.self.prevent>
		<NavMenu></NavMenu>
		<div class="main-wrap" :style="mainWrapStyle">
			<router-view></router-view>
			
			<FooterTools v-if="showFooterTools"></FooterTools>
		</div>
	</div>
</template>

<script setup lang='ts'>
import { computed, defineAsyncComponent, onMounted } from 'vue'
import { useStore } from 'vuex'
import { useRoute } from 'vue-router'
import { fetchScoreMap, fetchHomeListData } from '@/libs/api/home'
import { fetchMovieListData } from '@/libs/api/movie'
import { fetchSummaryListData } from '@/libs/api/summary'
import '@/libs/extends'

const store = useStore()
const route = useRoute()

const searchFlag = computed(() => store.state.app.searchFlag)
const showFooterTools = computed(() => {
	if (!routeMap[route.name]) return false

	if (routeMap[route.name].meta.navSearchMutualExclusion) {
		return !searchFlag.value
	}
	return routeMap[route.name].meta.navSearchMutualExclusion === false   
})
const mainWrapStyle = computed(() => store.getters['app/mainStyle'])
const appMainStyle = computed(() => ({
	paddingTop: `${store.state.app.navHeight}px`,
	backgroundImage: `url('/resource/home-assets/images/bg2.jpg')`,
	backgroundPosition: `0 ${store.state.app.navHeight}px`,
}))

const setAnimationData = (params) => store.dispatch('home/setAnimationData', params)
const setMovieData = (params) => store.dispatch('movie/setMovieData', params)
const setSummaryData = (params) => store.dispatch('summary/setSummaryData', params)

const routeName = routeMap[route.name] || {}
if (routeName.name === homeRoute.name) {
	const res = await Promise.all([fetchHomeListData(), fetchScoreMap()])
	setAnimationData({ listData: res[0], scoreMap: res[1] })
} else if (routeName.name === movieRoute.name) {
	setMovieData(await fetchMovieListData())
} else if (routeName.name === summaryRoute.name) {
	setSummaryData(await fetchSummaryListData())
}

onMounted(() => import('@/libs/weixinJSBridge'))
</script>

<style scoped>
.app-main{
	background-size: 100% auto;
	background-repeat: no-repeat;
	box-sizing: border-box;
	height: 100vh;
	width: 100%;
}
.main-wrap{
	height: calc(100% - 40px);
	margin: 0 auto;
	box-sizing: border-box;
	background: #fff;
	box-shadow: 0 2px 12px 0 rgb(0 0 0 / 10%);
	border-radius: 2px;
	position: relative;
}
</style>