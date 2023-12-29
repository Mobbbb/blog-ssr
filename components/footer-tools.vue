<template>
    <div class="footer-tools-wrap">
        <el-popover trigger="click" placement="left-end" :width="125" popper-class="footer-filter-popover-wrap">
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
import { useStore } from 'vuex'

const store = useStore()

const innerPageFilterConfig = computed(() => store.getters['app/innerPageFilterConfig'])
const innerPageSelectedFilter = computed(() => store.getters['app/innerPageSelectedFilter'])
const searchFlag = computed(() => store.state.app.searchFlag)
const selectedFilter = computed({
    get() {
        return innerPageSelectedFilter.value
    },
    set(value) {
        dispatchCommit({
            commitName: 'setInnerPageSelectedFilter',
            data: value,
        })
        if (searchFlag.value) { // 处于搜索状态时，需要主动调用
            searchHandle()
        }
    },
})

const dispatchCommit = (params) => store.dispatch('app/dispatchCommit', params)
const searchHandle = () => store.dispatch('app/searchHandle')
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
