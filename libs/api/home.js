import axios from '@/libs/api.request'

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

export const axiosFetchHomeItemByName = ({ name, season }) => {
    return axios.request({
        url: '/api/blog/home/getAnimationByName',
        method: 'get',
        params: {
            name,
            season,
        },
    })
}

export const fetchHomeItemByName = async ({ name, season }) => {
    const { data: response, pending } = await useLazyFetch('/api/blog/home/getAnimationByName', {
        query: {
            name,
            season,
        },
        method: 'get',
    })
    return {
        response,
        pending,
    }
}
