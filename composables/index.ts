export const useLazyFetchHandle = (data: any, mediaInfo: any, key: string) => {
    const { response, pending } = data
    const { data: prevData } = useNuxtData(key)
    if (response.value) {
        // 服务端渲染的数据处理
        mediaInfo.value = Object.assign(mediaInfo.value, response.value.data || {})
        mediaInfo.value.hoverShowLabel = mediaInfo.value.label
    }

    const isLoading = computed(() => {
        if (prevData.value) {
            return !prevData.value.success && pending.value
        }
        return pending.value
    })
    
    watch(response, (newRes) => {
        // 监听路由跳转请求的数据处理
        mediaInfo.value = Object.assign(mediaInfo.value, newRes.data || {})
        mediaInfo.value.hoverShowLabel = mediaInfo.value.label
    })
    useHead({
        titleTemplate: () => {
            if (mediaInfo.value) {
                return `${mediaInfo.value.name} - ${shortName}`
            }
        }
    })

    return isLoading
}
