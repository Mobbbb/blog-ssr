<template>
    <div class="summary-detail-wrap mobile-wrap" v-loading="pending">
        <div class="detail-title">{{detailData.title}}</div>
        <SummaryBannerTag :params="detailData"></SummaryBannerTag>
        <SummaryContent :params="formatData"></SummaryContent>
    </div>
</template>

<script setup lang='ts'>
import Prism from 'prismjs'
import { useStore } from 'vuex'
import { useRoute } from 'vue-router'
import { formatSummaryContent } from '@/libs/data-processing'
import { fetchSummaryItemById } from '@/libs/api/summary.js'

const runtimeConfig = useRuntimeConfig()
const route = useRoute()

const detailData = ref({})

const splitLanguageList = computed(() => {
    let languages = []
    runtimeConfig.public.BabelConfigLanguages.forEach(item => {
        if (prismMap[item]) {
            languages = [...languages, ...prismMap[item]]
        } else {
            languages.push(`{${item}}`)
        }
    })
    return languages
})

const formatData = computed(() => {
    let formatDataList = []
    const { content = [] } = detailData.value

    content.forEach(item => {
        formatDataList = [...formatDataList, ...formatSummaryContent(item, splitLanguageList.value)]
    })
    return formatDataList
})

const { response, pending } = await fetchSummaryItemById(route.params.id)
if (response.value) {
    // 服务端渲染的数据处理
    detailData.value = response.value.data
}
watch(response, (newRes) => {
    // 监听路由跳转请求的数据处理
    detailData.value = newRes.data
    nextTick(() => {
        Prism.highlightAll()
    })
})

useHead({ titleTemplate: (productCategory) => `${detailData.value.title} - ${shortName}` })

onMounted(async () => {
    Prism.highlightAll()
})
</script>

<style scoped>
.summary-detail-wrap {
    padding: 12px 24px;
    font-size: 14px;
    line-height: 1.6;
    color: #404040;
    height: 100%;
    box-sizing: border-box;
    overflow-y: auto;
}
.detail-title {
    font-size: 28px;
    font-weight: 700;
    margin-bottom: 12px;
    line-height: 1.4;
}
</style>
