<template>
    <div class="movie-detail" v-loading="isLoading">
        <MediaDetail :params="movieInfo"></MediaDetail>
        <div class="detail-bottom-wrap">
            <h4 class="comment-label">剧集</h4>
            <div class="block-content">
                <div class="episode-item" @click="episodeClickHandle">
                    {{movieInfo.name}}
                </div>
            </div>
            <h4 class="comment-label">评论</h4>
            <div class="block-content">{{movieInfo.comment || '暂无评论。'}}</div>
        </div>
    </div>
</template>

<script setup lang='ts'>
import { useStore } from 'vuex'
import { useRoute } from 'vue-router'
import { fetchMovieItemById } from '@/utils/api/movie.js'

const store = useStore()
const route = useRoute()

const movieInfo = ref({
    type: movieConfig.value,
    cover: '/resource/home-assets/images/loading.gif',
})
const isLoading = useLazyFetchHandle(
    await fetchMovieItemById(route.params.id),
    movieInfo,
    `movie:${route.params.id}`,
)

useLazyHead(movieInfo.value.name, route.query.name)

const episodeClickHandle = () => {
    ElMessage({
        message: '暂无片源！',
    })
}
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
.block-content {
    margin: 12px 0;
    border-radius: 4px;
    background-color: #f4f5f7;
    padding: 10px 8px;
    overflow: hidden;
    color: #6d757a;
    font-size: 12px;
}
.episode-wrap {
    border-radius: 2px;
    background-color: #f4f5f7;
    padding: 10px 8px;
}
.episode-item {
    display: inline-block;
    line-height: 29px;
    min-width: 88px;
    padding: 0 8px;
    height: 29px;
    white-space: nowrap;
    text-align: center;
    border: 1px solid #e5e9ef;
    background: #fff;
    font-size: 12px;
    cursor: pointer;
    color: #222;
}
.episode-item:hover {
    border-color: #00a1d6;
}
</style>

<style scoped>
@import '@/components/media-detail/media.css';
</style>
