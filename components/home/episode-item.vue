<template>
    <a class="episode-item"
        :style="episodeItemStyle"
        @click="episodeClickHandle"
        :target="canPlay ? '_blank' : ''"
        :href="canPlay ? `/video/${route.params.name}/${index}?season=${route.query.season}` : 'javascript:void(0);'">
        第{{index}}话
    </a>
</template>

<script setup lang='ts'>
import { useRoute } from 'vue-router'

const route = useRoute()

const props = defineProps({
    mediaInfo: {
        default: () => {
            return {}
        },
    },
    index: {
        default: 1,
    },
    episodeWidth: {
        default: 88,
    },
})

const canPlay = computed(() => {
    const source = props.mediaInfo.source || {}
    return source[props.index]
})
const episodeItemStyle = computed(() => {
    const disableStyle = {
        width: `${props.episodeWidth}px`,
    }
    if (!canPlay.value) {
        disableStyle.color = '#9e9e9e'
        disableStyle.background = '#fff'
        disableStyle.border = '1px solid #e5e9ef'
    }
    return disableStyle
})
const episodeClickHandle = () => {
    if (!canPlay.value) {
        ElMessage({
            message: '暂无片源！',
        })
    }
}
</script>

<style scoped>
.episode-item {
    line-height: 29px;
    height: 29px;
    white-space: nowrap;
    text-align: center;
    border: 1px solid #e5e9ef;
    background: #fff;
    font-size: 12px;
    cursor: pointer;
    color: #222;
    box-sizing: border-box;
    display: block;
    transition: all ease .3s;
}
.episode-item:visited {
    background: #ff9999;
    border: 1px solid #e0e0e0;
    color: white;
}
.episode-item:hover {
    border-color: #00a1d6;
}
</style>
