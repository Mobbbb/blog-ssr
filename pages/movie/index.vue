<template>
    <div class="movie-wrap mobile-wrap" v-infinite-scroll="loadMovieList" ref="movieWrap"
            :infinite-scroll-immediate="false"
            :infinite-scroll-disabled="isLoadAll"
            :infinite-scroll-distance="5">
        <MovieHeader @sort-change="sortChange"></MovieHeader>
        <div class="movie-content" v-loading="isLoading">
            <template v-if="formatMovieListByPage.length">
                <CardItem  type="movie"
                                :data="item" 
                                :key="item._index"
                                :searchFlag="searchFlag"
                                :listData="movieList" 
                                v-for="item in formatMovieListByPage"
                                @click="clickHandle(item.name)">
                </CardItem>
            </template>
            <el-empty :description="isLoading ? ' ' : '暂无数据'" v-else></el-empty>
        </div>
    </div>
</template>

<script>
import { mapActions, mapGetters, mapState } from 'vuex'

export default {
    name: 'movie',
    data() {
        return {
            currentPage: 1,
            pageSize: 9,
            movieWrapHeight: 0,
        }
    },
    computed: {
        ...mapState('movie', [
            'movieList',
            'isLoading',
        ]),
        ...mapState('app', [
            'searchFlag',
        ]),
        ...mapGetters('movie', [
            'showMovieList',
        ]),
        formatMovieListByPage() {
            return this.showMovieList.slice(0, this.pageSize * this.currentPage)
        },
        isLoadAll() {
            return this.showMovieList.length <= this.pageSize * this.currentPage
        },
    },
    async mounted() {
        await this.getMovieListHandle()
        this.$nextTick(() => {
            this.movieWrapHeight = this.$refs.movieWrap.clientHeight
        })
        this.loadMovieListImmediately()
    },
    methods: {
        ...mapActions('movie', [
            'getMovieListHandle',
        ]),
        clickHandle(name) {
            this.$router.push({
                path: `/movie/detail/${name}`,
            })
        },
        loadMovieListImmediately() {
            this.$nextTick(() => {
                if (this.movieWrapHeight >= this.$refs.movieWrap.scrollHeight && !this.isLoadAll) {
                    this.currentPage ++
                    this.loadMovieListImmediately()
                }
            })
        },
        loadMovieList() {
            if (!this.isLoadAll) {
                this.currentPage ++
            }
        },
        sortChange({ oldValue, newValue }) {
            if (oldValue !== newValue) {
                this.currentPage = 1
                this.$nextTick(() => {
                    this.loadMovieListImmediately()
                })
            }
        },
    },
}
</script>

<style scoped>
.movie-wrap {
    background: #fff;
    padding: 0 20px;
    position: relative;
    border-top: 8px solid #fff;
    height: 100%;
    box-sizing: border-box;
    overflow-y: auto;
}
.movie-content {
    padding: 20px 0 0 20px;
    position: relative;
}
.movie-content::after {
    content: '';
    display: block;
    width: 0;
    height: 0;
    clear: both;
}
</style>
