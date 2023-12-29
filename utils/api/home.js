import axios from '@/utils/api.request'

export const fetchHomeListData = async () => {
    const response = await useFetch('/resource/home-assets/home-data.json')
    return response.data.value || []
}

export const axiosFetchHomeListData = () => {
    return axios.request({
        url: '/resource/home-assets/home-data.json',
        method: 'get',
    })
}

export const fetchScoreMap = async () => {
    const response = await useFetch('/resource/home-assets/score-map.json')
    return response.data.value || {}
}

export const axiosFetchScoreMap = () => {
    return axios.request({
        url: '/resource/home-assets/score-map.json',
        method: 'get',
    })
}

export const insertLog = () => {
    return axios.request({
        url: '/api/blog/insertLog',
        method: 'post',
    })
}

export const axiosFetchHomeItemById = ({ id }) => {
    return axios.request({
        url: '/api/blog/home/getAnimationById',
        method: 'get',
        params: { id },
    })
}

export const fetchHomeItemById = async ({ id }) => {
    const { data: response, pending } = await useLazyFetch('/api/blog/home/getAnimationById', {
        query: { id },
        method: 'get',
        key: `home:${id}`,
    })
    return {
        response,
        pending,
    }
}
