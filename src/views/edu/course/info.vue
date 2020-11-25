<template>
  <div class="app-container">
    <h2 style="text-align: center">发布新课程</h2>
    <el-steps
      :active="1"
      process-status="wait"
      align-center
      style="margin-bottom: 40px"
    >
      <el-step title="填写课程基本信息" />
      <el-step title="创建课程大纲" />
      <el-step title="最终发布" />
    </el-steps>

    <el-form label-width="120px">
      <el-form-item label="课程标题">
        <el-input
          v-model="courseInfo.title"
          placeholder=" 示例：机器学习项目课：从基础到搭建项目视频课程。专业名称注意大小写"
        />
      </el-form-item>

      <!-- 所属分类 TODO -->

      <el-form-item label="课程分类">
        <el-select
          v-model="courseInfo.subjectParentId"
          placeholder="一级分类"
          @change="subjectLevelOneChanged"
        >
          <el-option
            v-for="subject in subjectOneList"
            :key="subject.id"
            :label="subject.title"
            :value="subject.id"
          />
        </el-select>

        <!-- 二级分类 -->
        <el-select v-model="courseInfo.subjectId" placeholder="二级分类">
          <el-option
            v-for="subject in subjectTwoList"
            :key="subject.id"
            :label="subject.title"
            :value="subject.id"
          />
        </el-select>
      </el-form-item>

      <!-- 课程讲师 -->
      <el-form-item label="课程讲师">
        <el-select v-model="courseInfo.teacherId" placeholder="请选择讲师">
          <el-option
            v-for="teacher in teacherList"
            :key="teacher.id"
            :label="teacher.name"
            :value="teacher.id"
          />
        </el-select>
      </el-form-item>

      <el-form-item label="总课时">
        <el-input-number
          :min="0"
          v-model="courseInfo.lessonNum"
          controls-position="right"
          placeholder="请填写课程的总课时数"
        />
      </el-form-item>

      <!-- 课程简介 TODO -->

      <el-form-item label="课程简介">
        <tinymce :height="300" v-model="courseInfo.description" />
      </el-form-item>
      <!-- 课程封面-->
      <el-form-item label="课程封面">
        <el-upload
          :show-file-list="false"
          :on-success="handleAvatarSuccess"
          :before-upload="beforeAvatarUpload"
          :action="BASE_API + '/eduoss/fileoss'"
          class="avatar-uploader"
        >
          <img :src="courseInfo.cover" width="300px" />
        </el-upload>
      </el-form-item>

      <el-form-item label="课程价格">
        <el-input-number
          :min="0"
          v-model="courseInfo.price"
          controls-position="right"
          placeholder="免费课程请设置为0元"
        />元
      </el-form-item>

      <el-form-item>
        <el-button
          :disabled="saveBtnDisabled"
          type="primary"
          @click="SaveOrUpdate"
          >保存并下一步</el-button
        >
      </el-form-item>
    </el-form>
  </div>
</template>
<script>
import course from "@/api/edu/course";
import subject from "@/api/edu/subject";
import Tinymce from "@/components/Tinymce"; //引入组件
export default {
  //声明组件
  components: { Tinymce },
  data() {
    return {
      saveBtnDisabled: false,
      courseInfo: {
        title: "",
        subjectId: "", //二级分类id
        teacherId: "",
        subjectParentId: "", //一级分类id
        lessonNum: 0,
        description: "",
        cover: "/static/01.jpg",
        price: 0,
      },
      courseId: "",
      teacherList: [], //封装所有讲师
      subjectOneList: [], //一级分类
      subjectTwoList: [], //二级分类
      BASE_API: process.env.BASE_API, // 接口API地址
    };
  },
  created() {
    //获取路由id值
    if (this.$route.params && this.$route.params.id) {
      this.courseId = this.$route.params.id;
      console.log(this.$route.params.id);
      this.getInfo();
    } else {
      this.getListTeacher();
      //初始化一级分类
      this.getOneSubject();
    }
  },

  methods: {
    //根据课程id获取课程信息
    getInfo() {
      course.getCourseInfoById(this.courseId).then((response) => {
        this.courseInfo = response.data.courseInfo;

        subject.getSbujectlist().then((response) => {
          this.subjectOneList = response.data.list;
          // console.log(this.subjectOneList.length);
          for (var i = 0; i < this.subjectOneList.length; i++) {
            if (this.subjectOneList[i].id === this.courseInfo.subjectParentId)
              this.subjectTwoList = this.subjectOneList[i].children;
          }
        });

        this.getListTeacher();
        // console.log(this.courseInfo.subjectParentId + "kkk");
      });
    },
    //上传方面chengg
    handleAvatarSuccess(res, file) {
      console.log(res.data.url); // 上传响应
      //console.log(URL.createObjectURL(file.raw)); // base64编码
      this.courseInfo.cover = res.data.url;
    },
    //上传封面之前
    beforeAvatarUpload(file) {
      const isJPG = file.type === "image/jpeg";
      const isLt2M = file.size / 1024 / 1024 < 2;

      if (!isJPG) {
        this.$message.error("上传头像图片只能是 JPG 格式!");
      }
      if (!isLt2M) {
        this.$message.error("上传头像图片大小不能超过 2MB!");
      }
      return isJPG && isLt2M;
    },
    //查询所有一级分类
    getOneSubject() {
      subject.getSbujectlist().then((response) => {
        this.subjectOneList = response.data.list;
        //console.log(this.subjectOneList.length);
      });
    },
    //二级分类
    subjectLevelOneChanged(value) {
      for (var i = 0; i < this.subjectOneList.length; i++) {
        if (this.subjectOneList[i].id === value)
          this.subjectTwoList = this.subjectOneList[i].children;
        this.courseInfo.subjectId = "";
      }
    },
    //查询所有讲师
    getListTeacher() {
      course.getListTeacher().then((response) => {
        this.teacherList = response.data.items;
      });
    },
    saveCourse() {
      course.addCourseInfo(this.courseInfo).then((response) => {
        //提示信息
        this.$message({
          type: "success",
          message: "添加课程信息成功",
        });
        //跳转到第二步
        this.$router.push({
          path: "/course/chapter/" + response.data.courseId,
        });
      });
    },
    updateCourse() {
      course.updateCourseInfo(this.courseInfo).then((response) => {
        //提示信息
        this.$message({
          type: "success",
          message: "修改课程信息成功",
        });
        //跳转到第二步
        this.$router.push({
          path: "/course/chapter/" + this.courseId,
        });
      });
    },
    SaveOrUpdate() {
      if (this.courseInfo.id) {
        //修改
        this.updateCourse();
      } else {
        //添加
        this.saveCourse();
      }
    },
  },
};
</script>
<style scoped>
.tinymce-container {
  line-height: 29px;
}
</style>