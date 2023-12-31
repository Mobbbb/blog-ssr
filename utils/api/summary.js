import axios from '@/utils/api.request'

export const fetchSummaryListData = async () => {
    const response = await useFetch('/resource/summary-assets/summary-assets.json')
    return response.data.value || []
}

export const axiosFetchSummaryListData = () => {
    return axios.request({
        url: '/resource/summary-assets/summary-assets.json',
        method: 'get',
    })
}

export const fetchSummaryItemById = async (id) => {
    const { data: response, pending } = await useLazyFetch('/api/blog/summary/getSummaryById', {
        query: {
            id,
        },
        method: 'get',
        key: `summary:${id}`,
    })
    return {
        response,
        pending,
    }
}
