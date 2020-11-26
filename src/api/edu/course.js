import request from '@/utils/request'
export default {
    //1 添加课程信息

    addCourseInfo(courseInfo) {
        return request({

            url: `/eduservice/course/addCourseInfo`,
            method: 'post',
            data: courseInfo

        })
    },

    //查询所有讲师
    getListTeacher() {
        return request({

            url: `/eduservice/teacher/findAll`,
            method: 'get',


        })
    },
    //根据课程id查询课程基本信息
    getCourseInfoById(courseid) {
        return request({

            url: `/eduservice/course/getCourseInfo/` + courseid,
            method: 'get',
        })
    },
    //修改课程信息
    updateCourseInfo(courseInfo) {
        return request({

            url: `/eduservice/course/updateCourseInfo`,
            method: 'post',
            data: courseInfo
        })
    },
    //课程确认信息显示
    getPublishCourseInfo(id) {
        return request({
            url: `/eduservice/course/getPublishCourseInfo/` + id,
            method: "get"
        })
    },

    //课程最终发布
    publishCourse(id) {
        return request({
            url: `/eduservice/course/publishCourse/` + id,
            method: "post"
        })
    },

    //TODO 课程列表
    getListCourse(id) {
        return request({
            url: `/eduservice/course`,
            method: "get"
        })
    },
    //1 讲师列表（条件查询分页）
    //current当前页 limit每页记录数 teacherQuery条件对象
    getCourseListPage(current, limit, courseQuery) {
        return request({
            //url: '/eduservice/teacher/pageTeacherCondition/'+current+"/"+limit,
            url: `/eduservice/course/pageCourseCondition/${current}/${limit}`,
            method: 'post',
            //teacherQuery条件对象，后端使用RequestBody获取数据
            //data表示把对象转换json进行传递到接口里面
            data: courseQuery
        })
    },
    //删除讲师
    deleteCourseById(courseId) {
        return request({
            url: `/eduservice/course/${courseId}`,
            method: 'delete'
        })
    },
}
