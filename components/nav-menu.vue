<template>
    <div class="nav-wrap">
        <div class="page-nav-wrap" :style="pageNavWrapStyle">
            <el-menu    background-color="transparent" 
                        class="el-menu-nav" 
                        mode="horizontal" 
                        :default-active="activeNavIndex" 
                        router>
                <template v-for="item in routeConfig">
                    <el-menu-item :index="item.path" v-if="item.meta.level === 0" :key="item.path">
                        {{item.meta.name}}
                    </el-menu-item>
                </template>
            </el-menu>
        
            <el-popover placement="bottom-end"
                        :width="320"
                        :offset="5"
                        :show-arrow="false"
                        :disabled="popOverDisabled"
                        trigger="click"
                        popper-class="search-input-popover"
                        v-model:visible="showFilterContent">
                <template #reference>
                    <div class="search-input-wrap">
                        <el-icon class="search-icon"><Search /></el-icon>
                        <input  placeholder="请输入剧名" 
                                @keydown.enter="onEnter"
                                type="text"
                                ref="searchInput"
                                class="search-input" 
                                v-model="searchText">
                    </div>
                </template>
                <PopoverFilter @on-reset="clickResetBtn" @on-search="clickSearchBtn"></PopoverFilter>
            </el-popover>
        </div>
    </div>
</template>

<script>
import { mapState, mapGetters, mapMutations, mapActions } from 'vuex'
import { Search } from '@element-plus/icons-vue'
import PopoverFilter from './popover-filter.vue'

export default {
  	name: 'nav-menu',
    components: {
        PopoverFilter,
        Search,
    },
    data() {
        return {
            showFilterContent: false,
            inputEl: null, // 搜索框
        }
    },
    computed: {
        ...mapState('app', [
            'activeNavIndex',
            'navHeight',
        ]),
        ...mapGetters('app', [
            'popoverFilterConfig',
            'mainStyle',
        ]),
        pageNavWrapStyle() {
            return { 
                width: this.mainStyle.width,
                minWidth: this.mainStyle.minWidth,
                height: `${this.navHeight}px`
            }
        },
        searchText: {
            get() {
                return this.$store.state.app.searchText
            },
            set(value) {
                this.updateInputValue(value)
            },
        },
        popOverDisabled() {
            return !Object.keys(this.popoverFilterConfig).length
        },
    },
    mounted() {
        this.inputEl = this.$refs.searchInput
    },
	methods: {
        ...mapMutations('app', [
            'updateInputValue',
        ]),
        ...mapActions('app', [
            'searchHandle',
            'dispatchCommit',
        ]),
        onEnter() {
            this.searchHandle()
            this.showFilterContent = false
            setTimeout(() => {
                this.inputEl.blur()
            })
        },
        clickResetBtn() {
            this.updateInputValue('')
            this.dispatchCommit({ commitName: 'resetSelectedFilter' })
            this.onEnter()
        },
        clickSearchBtn() {
            this.onEnter()
        },
	}
}
</script>

<style scoped>
.nav-wrap{
	position: fixed;
	left: 0;
	top: 0;
	width: 100%;
	z-index: 100;
	background: linear-gradient(to right, #3c384bda, #d7c8cbe5 9%, #e9dfd8dc 15%, #fbfbfb 30%, #fbfbfb 70%, #e9dfd8dc 85%, #d7c8cbe5 91.5%, #3c384baf);
    box-sizing: border-box;
}
.page-nav-wrap {
    position: relative;
    overflow: hidden;
	margin: 0 auto;
}
.search-input-wrap {
    position: absolute;
    display: inline-block;
    width: 120px;
    height: 28px;
    line-height: 28px;
    right: 16px;
    top: 16px;
}
.search-input-wrap input {
    background: rgba(256, 256, 256, 0.3);
    border-radius: 20px;
    border: 1px solid #DCDFE6;
    box-sizing: border-box;
    display: inline-block;
    height: 28px;
    line-height: 28px;
    outline: 0;
    padding: 0 30px 0 15px;
    transition: border-color .2s cubic-bezier(.645,.045,.355,1);
    width: 100%;
    font-size: 12px;
    color: #606266;
}
.search-input-wrap input:focus {
    border-color: #409EFF;
    outline: 0;
}
.search-input-wrap .search-icon {
    position: absolute;
    right: 12px;
    top: 8px;
    color: #C0C4CC;
    font-size: 12px;
}
.el-menu--horizontal {
    border-bottom: none;
}
.el-menu-nav {
    height: 60px;
}
.el-menu-nav > .el-menu-item {
    color: var(--el-text-color-secondary);
}
.el-menu--horizontal>.el-menu-item.is-active {
    border-bottom: 2px solid var(--el-color-primary);
    color: var(--el-text-color-primary) !important;
}
</style>

<style>
.el-menu-nav > .is-active{
    border-color: #a5d1ff !important;
    background-color: transparent !important;
}
.el-menu-nav > .el-menu-item:hover{
    background-color: transparent !important;
}
.search-input-popover {
    padding: 0!important;
}
</style>
