export default defineNuxtPlugin((nuxtApp) => {
    nuxtApp.vueApp.config.errorHandler = (error, instance, info) => {
        console.log(error)
        // 错误上报
    }

    nuxtApp.hook('vue:error', (error, instance, info) => {
        console.log(error)
        // 错误上报
    })
})
