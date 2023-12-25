<template>
    <div class="home-wrap mobile-wrap">
        <HomeHeader></HomeHeader>
        <div class="home-content" v-loading="isLoading">
            <template v-if="showAnimationList.length">
                <CardItem   :data="item" 
                            :key="item._index"
                            :searchFlag="searchFlag"
                            :listData="animationList" 
                            v-for="item in showAnimationList"
                            @click="clickHandle(item.id, item.name)">
                </CardItem>
            </template>
            <el-empty :description="isLoading ? ' ' : '暂无数据'" v-else></el-empty>
        </div>
    </div>
</template>

<script setup lang='ts'>
import { useStore } from 'vuex'

const store = useStore()

const searchFlag = computed(() => store.state.app.searchFlag)
const isLoading = computed(() => store.state.home.isLoading)
const animationList = computed(() => store.state.home.animationList)
const showAnimationList = computed(() => store.getters['home/showAnimationList'])
const getAnimationHandle = () => store.dispatch('home/getAnimationHandle')
const initHomeHeader = () => store.dispatch('home/initHomeHeader')

onMounted(async () => {
    await getAnimationHandle()
    initHomeHeader()
})

function clickHandle(id, name) {
    navigateTo({
        path: `/home/detail/${id}`,
        query: {
            name,
        },
    })
}
</script>

<style scoped>
.home-wrap {
    background: #fff;
    padding: 0 20px;
    position: relative;
    border-top: 8px solid #fff;
    height: 100%;
    box-sizing: border-box;
    overflow-y: auto;
}
.home-content {
    padding: 20px 0 0 20px;
    position: relative;
}
.home-content::after {
    content: '';
    display: block;
    width: 0;
    height: 0;
    clear: both;
}
</style>
