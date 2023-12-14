<template>
    <div class="popover-content">
        <div class="el-popover__title">高级筛选</div>
        <div class="label-wrap" v-if="popoverFilterConfig.allLabelArr">
            <div class="filter-title"># 标签</div>
            <div class="label-item-wrap">
                <CardItemDescLabel  v-for="label in popoverFilterConfig.allLabelArr"
                                    :marginRight="4"
                                    :name="label"
                                    :key="label"
                                    @click="clickLabel(label)"
                                    :class="popoverSelectedFilter.label.includes(label) ? 'active-label' : ''">
                </CardItemDescLabel>
            </div>
        </div>
        <div class="padding12 paddingTop0 paddingBottom0" v-if="popoverFilterConfig.rateScore">
            <div class="filter-title paddingBottom0"># 评分</div>
            <div class="slider-bar-wrap">
                <el-slider  range
                            v-model="rateScore" 
                            :max="popoverFilterConfig.rateScore.max"
                            :step="popoverFilterConfig.rateScore.step" 
                            :format-tooltip="popoverFilterConfig.rateScore.formatTooltip">
                </el-slider>
            </div>
        </div>
        <div class="padding12 paddingTop0" v-if="popoverFilterConfig.hideScore">
            <div class="filter-title"># 隐藏分</div>
            <el-checkbox-group v-model="hideScore">
                <el-checkbox    v-for="item in popoverFilterConfig.hideScore" 
                                :key="item" 
                                :label="item.value">
                    <span class="checkbox-item">{{item.label}}</span>
                </el-checkbox>
            </el-checkbox-group>
        </div>
        <div class="padding12 paddingTop0" v-if="popoverFilterConfig.others">
            <div class="filter-title"># 其他</div>
            <el-checkbox-group v-model="others">
                <el-checkbox    v-for="item in popoverFilterConfig.others" 
                                :key="item" 
                                :label="item.value">
                    <span class="checkbox-item">{{item.label}}</span>
                </el-checkbox>
            </el-checkbox-group>
        </div>
        <div class="popover-footer-wrap">
            <el-button :icon="RefreshLeft" size="small" @click="clickResetBtn">重置</el-button>
            <el-button type="primary" size="small" :icon="Search" @click="clickSearchBtn">搜索</el-button>
        </div>
    </div>
</template>

<script setup lang='ts'>
import { useStore } from 'vuex'
import { RefreshLeft, Search } from '@element-plus/icons-vue'
import { useRoute } from 'vue-router'

const emit = defineEmits(['on-reset', 'on-search'])

const store = useStore()
const route = useRoute()

const routeName = computed(() => {
    const transRoute = routeMap[route.name] || {}
    return transRoute.name || ''
})

const popoverFilterConfig = computed(() => {
    if (!routeMap[route.name]) return {}
    if (store.state[routeMap[route.name].name]) {
        return store.state[routeMap[route.name].name].filterConfig || {}
    }
    return {}
})
const popoverSelectedFilter = computed(() => {
    if (!routeMap[route.name]) return {}
    if (store.state[routeMap[route.name].name]) {
        return store.state[routeMap[route.name].name].selectedFilter || {}
    }
    return {} 
})

const rateScore = computed({
    get() {
        return popoverSelectedFilter.value.rateScore
    },
    set(value) {
        dispatchCommit({
            commitName: `${routeName.value}/setSelectedRateScore`,
            data: value,
        })
    },
})
const hideScore = computed({
    get() {
        return popoverSelectedFilter.value.hideScore
    },
    set(value) {
        dispatchCommit({
            commitName: `${routeName.value}/setSelectedHideScore`,
            data: value,
        })
    },
})
const others = computed({
    get() {
        return popoverSelectedFilter.value.others
    },
    set(value) {
        dispatchCommit({
            commitName: `${routeName.value}/setSelectedOthers`,
            data: value,
        })
    },
})

const dispatchCommit = (params) => store.dispatch('app/dispatchCommit', params)
const setSelectedLabel = (name) => store.commit(`${routeName.value}/setSelectedLabel`, name)

const clickResetBtn = () => {
    emit('on-reset')
}
const clickSearchBtn = () => {
    emit('on-search')
}
const clickLabel = (name) => {
    setSelectedLabel(name)
}
</script>

<style scoped>
.popover-content {
    padding: 12px 0;
}
.label-wrap {
    padding-left: 12px;
}
.label-wrap .desc-label:hover {
    cursor: pointer;
    color: #409EFF;
    border-color: #c6e2ff;
    background-color: #ecf5ff
}
.label-wrap .active-label {
    background: #409EFF;
    border-color: #409EFF;
    color: #fff;
}
.label-wrap .active-label:hover {
    background: #66b1ff;
    border-color: #66b1ff;
    color: #fff;
}
.label-item-wrap {
    overflow: scroll;
    max-height: 135px;
    margin-top: 8px;
}
.filter-title {
    font-size: 12px;
    font-weight: 700;
    padding: 0 0 0 2px;
}
.slider-bar-wrap {
    padding: 0 4px;
}
.checkbox-item {
    font-size: 13px;
}
.popover-footer-wrap {
    text-align: right;
    padding: 0 12px;
}

.el-popover__title {
    padding: 0 12px;
}

.padding12 {
    padding: 8px 12px;
}
.paddingTop0 {
    padding-top: 0;
}
.paddingBottom0 {
    padding-bottom: 0;
}
</style>
