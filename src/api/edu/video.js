import request from '@/utils/request'
export default {
    //添加小节

    addVideo(video) {
        return request({

            url: `/eduservice/video/addVideo`,
            method: 'post',
            data: video
        })
    },
    //删除小节

    deleteVideo(id) {
        return request({
            url: `/eduservice/video/` + id,
            method: 'delete'
        })
    },

    //删除阿里云中的视频
    deleteAliVideo(id) {
        return request({
            url: `/eduvod/video/removeAliVideo/` + id,
            method: 'delete'
        })
    },
}