<template>
    <div class="summary-wrap">
        <div class="summary-content" v-loading="isLoading">
            <template v-if="showArticleList.length">
                <SummaryArticleItem :params="item"
                                    :key="item._index"
                                    v-for="item in showArticleList"
                                    @click="clickHandle(item.id, item.title)">
                </SummaryArticleItem>
            </template>
            <el-empty :description="isLoading ? ' ' : '暂无数据'" v-else></el-empty>
        </div>
    </div>
</template>

<script>
import { mapState, mapGetters, mapActions } from 'vuex'

export default {
    name: 'summary-content',
    data() {
        return {
            
        }
    },
    computed: {
        ...mapState('summary', [
            'isLoading',
        ]),
        ...mapGetters('summary', [
            'showArticleList',
        ]),
    },
    mounted() {
        this.getSummaryHandle()
    },
    methods: {
        ...mapActions('summary', [
            'getSummaryHandle',
        ]),
        clickHandle(id, title) {
            this.$router.push({
                path: `/summary/detail/${id}`,
                query: {
                    title,
                },
            })
        },
    },
}
</script>

<style scoped>
.summary-wrap {
    background: #fff;
    position: relative;
    border-top: 8px solid #fff;
    height: 100%;
    box-sizing: border-box;
    overflow-y: auto;
}
</style>
