<template>
    <div class="footer-tools-wrap">
        <el-popover trigger="click" placement="left-end" :width="110" popper-class="footer-filter-popover-wrap">
            <el-checkbox-group v-model="selectedFilter">
                <div v-for="item in innerPageFilterConfig" :key="item" class="filter-item">
                    <el-checkbox :label="item.value">
                        <span class="filter-item-label">{{item.label}}</span>
                    </el-checkbox>
                </div>
            </el-checkbox-group>
            <template #reference>
                <Triangle :active="selectedFilter.length"></Triangle>
            </template>
        </el-popover>
    </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useStore } from 'vuex'
import { useRoute } from 'vue-router'

const store = useStore()
const route = useRoute()

const transRoute = computed(() => routeMap[route.name] || {})
const routeName = computed(() => transRoute.value.name || '')

const innerPageSelectedFilter = computed(() => {
    if (!routeMap[route.name]) return []
    if (store.state[routeMap[route.name].name]) {
        return store.state[routeMap[route.name].name].innerPageSelectedFilter || []
    }
    return []
})
const searchFlag = computed(() => store.state.app.searchFlag)
const innerPageFilterConfig = computed(() => {
    if (!routeMap[route.name]) return []
    return store.state[routeMap[route.name].name].innerPageFilterConfig
})
const selectedFilter = computed({
    get() {
        return innerPageSelectedFilter.value
    },
    set(value) {
        setInnerPageSelectedFilter(value)
        if (searchFlag.value) { // 处于搜索状态时，需要主动调用
            searchHandle(transRoute.value)
        }
    },
})

const searchHandle = (route) => store.dispatch('app/searchHandle', route)
const setInnerPageSelectedFilter = (value) => store.commit(`${routeName.value}/setInnerPageSelectedFilter`, value)

</script>

<style scoped>
.footer-tools-wrap {
    position: absolute;
    bottom: 0;
    left: 0;
    height: 16px;
    width: 100%;
    text-align: right;
    overflow: hidden;
}
.filter-item-label {
    font-size: 12px;
    line-height: 22px;
}
</style>

<style>
.footer-filter-popover-wrap {
    padding: 4px 8px!important;
    min-width: 50px!important;
}
</style>
