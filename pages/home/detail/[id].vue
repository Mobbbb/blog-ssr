<template>
    <div class="movie-detail" v-loading="isLoading">
        <MediaDetail :params="mediaInfo" :animationList="animationList"></MediaDetail>
        <div class="detail-bottom-wrap">
            <div ref="episodeWrap">
                <template v-if="endProgress.length">
                    <h4 class="comment-label">剧集</h4>
                    <div class="episode-wrap">
                        <div class="episode-line-wrap"
                            :style="{ justifyContent: episodeWrapWidth ? 'space-evenly' : 'space-around', }"
                            v-for="(line, indexLine) in endProgress" :key="indexLine">
                            <div v-for="(item, index) in line" :key="index">
                                <div :style="{ width: `${episodeWidth}px`, }" v-if="item.empty"></div>
                                <HomeEpisodeItem :index="item.index"
                                    :mediaInfo="mediaInfo" 
                                    :episodeWidth="episodeWidth"
                                    v-else>
                                </HomeEpisodeItem>
                            </div>
                        </div>
                    </div>
                </template>
            </div>
            <h4 class="comment-label">简介</h4>
            <div class="comment-content">{{mediaInfo.description || '暂无。'}}</div>
            <h4 class="comment-label">评论</h4>
            <div class="comment-content">{{mediaInfo.comment || '暂无评论。'}}</div>
            <div class="extra-wrap" v-if="movieVersions.length">
                <h4 class="comment-label">系列番外</h4>
                <CardItem   :data="item" 
                            :searchFlag="true"
                            :key="item._index"
                            :listData="movieVersions" 
                            class="detail-animation-item"
                            v-for="item in movieVersions">
                </CardItem>
            </div>
        </div>
    </div>
</template>

<script setup lang='ts'>
import { useStore } from 'vuex'
import { useRoute } from 'vue-router'
import { fetchHomeItemById } from '@/utils/api/home.js'

const store = useStore()
const route = useRoute()

const episodeWrapWidth = ref(0)
const episodeWidth = ref(88)
const episodeWrap = ref(null)

const animationList = computed(() => store.state.home.animationList)

const movieVersions = computed(() => {
    const { movieVersions = [] } = mediaInfo.value

    movieVersions.forEach((item, index) => {
        item._index = index
        item.waitToScore = true
        item.showName = item.name
    })

    return movieVersions
})

const mediaInfo = ref({
    type: animationConfig.value,
    cover: '/resource/home-assets/images/loading.gif',
})
const endProgress = computed(() => {
    const gap = 12
    const endProgressConfig = []
    let { endProgress = '', episodes = '' } = mediaInfo.value
    endProgress = parseInt(episodes) || parseInt(endProgress) || 0

    const numOfEachLine = parseInt(episodeWrapWidth.value / (episodeWidth.value + gap)) || endProgress // 每行个数
    const totalLineNum = Math.ceil(endProgress / numOfEachLine) // 行数
    const restNum = numOfEachLine * totalLineNum - endProgress // 最后一行剩余个数
    if (totalLineNum && numOfEachLine) {
        let lineNum = 0
        for (let i = 0; i < endProgress; i++) {
            if (!endProgressConfig[lineNum]) {
                endProgressConfig[lineNum] = []
            }
            endProgressConfig[lineNum].push({
                index: i + 1,
                empty: false,
            })
            if (endProgressConfig[lineNum].length >= numOfEachLine) {
                lineNum ++
            }
        }
        // 补全最后一行
        endProgressConfig[totalLineNum - 1] = endProgressConfig[totalLineNum - 1].concat(new Array(restNum).fill({
            empty: true,
        }))
    }
    return endProgressConfig
})

const requestParams = {
    id: route.params.id,
}
const isLoading = useLazyFetchHandle(
    await fetchHomeItemById(requestParams),
    mediaInfo,
    `home:${route.params.id}`,
)

useLazyHead(mediaInfo.value.name, route.query.name)

onMounted(() => {
    episodeWrapWidth.value = episodeWrap.value.clientWidth
})
</script>

<style scoped>
.movie-detail {
    height: 100%;
    overflow-y: auto;
}
.detail-bottom-wrap {
    margin: 0 20px;
}
.comment-label {
    font-size: 18px;
    font-weight: 700;
    margin: 12px 0;
}
.comment-content {
    margin: 12px 0;
    border-radius: 4px;
    background-color: #f4f5f7;
    padding: 10px 8px;
    overflow: hidden;
    color: #6d757a;
    font-size: 12px;
}
.extra-wrap {
    padding: 1px 0 12px 0;
}
.extra-wrap::after {
    content: '';
    display: block;
    width: 0;
    height: 0;
    clear: both;
}
.detail-animation-item >>> .image-wrap {
    margin-right: 12px;
}
.episode-wrap {
    border-radius: 2px;
    background-color: #f4f5f7;
    padding-bottom: 10px;
}
.episode-line-wrap {
    display: flex;
    flex-wrap: wrap;
}
</style>

<style scoped>
@import '@/components/media-detail/media.css';
</style>
