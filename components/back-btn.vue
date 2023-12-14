<template>
    <div class="navigation-btn" @click="backHandle">
        <el-icon><ArrowLeft /></el-icon>
        <span>返回</span>
    </div>
</template>

<script>
import { mapState } from 'vuex'
import { ArrowLeft } from '@element-plus/icons-vue'

export default {
    name: 'back-btn',
    components: {
        ArrowLeft,
    },
    computed: {
        ...mapState('app', [
            'currentRoute',
        ]),
    },
    methods: {
        backHandle() {
            const { meta = {} } = this.currentRoute
            if (meta.parent) {
                this.$router.push({
                    name: meta.parent,
                })
            } else {
                history.back()
            }
        },
    },
}
</script>

<style scoped>
.navigation-btn {
    width: 50px;
    position: relative;
    z-index: 101;
    padding: 12px 0 0 0;
    cursor: pointer;
    transition: .1s;
    font-size: 14px;
    display: flex;
    align-items: center;
    color: white;
}
.navigation-btn:hover {
    color: #fc5531;
}
</style>
