<template>
    <div class="movie-header-wrap">
        <div class="movie-header" v-if="searchFlag">
            <span>搜索结果</span>
            <div class="search-tips">共找到<span>{{showMovieList.length}}</span>条记录</div>
        </div>
        <div class="movie-header" v-else>
            <span class="movie-header-title">电影 / 电视剧</span>
        </div>
        <SortPopover v-model="_selectedSortType" :data="sortListConfig" @on-select="selectSortType"></SortPopover>
    </div>
</template>

<script>
import { mapGetters, mapMutations, mapState } from 'vuex'

export default {
    name: 'movie-header',
    data() {
        return {
            months,
            sortListConfig,
        }
    },
    computed: {
        ...mapState('app', [
            'searchFlag',
        ]),
        ...mapState('movie', [
            'selectedSortType',
        ]),
        ...mapGetters('movie', [
            'showMovieList',
        ]),
        _selectedSortType: {
            get() {
                return this.selectedSortType
            },
            set(value) {
                this.updateSelectedSortType(value)
            }
        },
    },
    methods: {
        ...mapMutations('movie', [
            'updateSelectedSortType',
        ]),
        selectSortType(value) {
            this.$emit('sort-change', { oldValue: this.selectedSortType, newValue: value })
        },
    },
}
</script>

<style scoped>
.movie-header-wrap {
    display: flex;
    justify-content: space-between;
    align-items: center;
    height: 40px;
}
.movie-header > span{
    font-size: 20px;
    color: #222;
    line-height: 26px;
    margin-right: 20px;
}
.movie-header .search-tips {
    display: inline-block;
    color: #909399;
    font-size: 12px;
    margin-left: -8px;
}
.movie-header .search-tips span {
    color: #4c8fe8;
    margin: 0 4px;
    font-weight: 700;
}
.movie-header a {
    font-size: 12px;
    margin-right: 24px;
    line-height: 20px;
    cursor: pointer;
    position: relative;
    vertical-align: top;
    display: inline-block;
}
.movie-header a:last-of-type {
    margin-right: 0;
}
.movie-header a:hover {
    color: #00a1d6;
}
</style>
