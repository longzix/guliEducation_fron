<template>
  <div class="app-container">
    <el-form label-width="120px">
      <el-form-item label="信息描述">
        <el-tag type="info">excel模版说明</el-tag>
        <el-tag>
          <i class="el-icon-download" />
          <a :href=" 'static/01.xlsx'">点击下载模版</a>
        </el-tag>
      </el-form-item>

      <el-form-item label="选择Excel">
        <el-upload
          ref="upload"
          :auto-upload="false"
          :on-success="fileUploadSuccess"
          :on-error="fileUploadError"
          :on-progress="fileUploading"
          :disabled="importBtnDisabled"
          :before-upload="check"
          :on-change="onChange"
          :limit="1"
          :file-list="fileList"
          :action="BASE_API+'/eduservice/subject/addSubject'"
          name="file"
          accept="application/vnd.ms-excel"
        >
          <el-button slot="trigger" size="small" type="primary">选取文件</el-button>
          <el-button
            :loading="loading"
            style="margin-left: 10px;"
            size="small"
            type="success"
            @click="submitUpload"
          >{{fileUploadBtnText}}</el-button>
        </el-upload>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
export default {
  data() {
    return {
      //是否选择了文件
      select: false,
      BASE_API: process.env.BASE_API, // 接口API地址
      // OSS_PATH: process.env.OSS_PATH, // 阿里云OSS地址
      fileUploadBtnText: "上传到服务器",
      importBtnDisabled: false, // 按钮是否禁用,
      loading: false,
    };
  },
  created() {},
  methods: {
    onChange(file, fileList) {
      if (fileList.length == 1) {
        this.select = true;
      }

      // console.log(file);
      //console.log(fileList);
    },
    //点击按钮上传文件到接口
    submitUpload() {
      this.fileUploadBtnText = "正在上传";
      this.importBtnDisabled = true;
      this.loading = true;
      //js : document.getElementById("upload").submit()
      //判断是否选择了文件
      if (this.select) {
        this.$refs.upload.submit();
      } else {
        this.$message({
          type: "error",
          message: "请选择上传文件",
        });
        this.fileUploadBtnText = "上传到服务器";
        this.importBtnDisabled = false;
        this.loading = false;
      }
    },

    //上传成功
    fileUploadSuccess(response, file) {
      this.fileUploadBtnText = "上传到服务器";
      if (response.success === true) {
        this.loading = false;
        this.$message({
          type: "success",
          message: "添加课程分类成功",
        });

        //路由跳转，跳转到分类列表
        this.$router.push({ path: "/subject/list" });
      }
    },
    //上传失败
    fileUploadError(response) {
      this.loading = false;
      this.$message({
        type: "error",
        message: "导入失败",
      });
    },
  },
};
</script>