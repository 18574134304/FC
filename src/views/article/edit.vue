<template>
	<div class="app-container">
		<el-card>
			<el-form
					ref="dataForm"
					v-loading="dataLoading"
					:rules="rules"
					:model="info"
					label-position="left"
					label-width="70px"
					style="margin-right: 70px"
				>
				<el-form-item style="margin-bottom: 40px;" prop="title">
					<MDinput v-model="info.title" :maxlength="100" name="name" required>
						标题
					</MDinput>
				</el-form-item>

				<el-form-item style="margin-bottom: 40px;">
					<el-input
							v-model="info.summary"
							:rows="1"
							type="textarea"
							class="article-textarea"
							autosize
							placeholder="请输入描述"
						/>
				</el-form-item>

				<el-form-item>
					<l-img-upload
							class="avatar-uploader"
							:action="uploadApi"
							:show-file-list="false"
							list-type="text"
							accecp="image/png"
							:on-success="handleUploadSuccess"
							:before-upload="beforeUpload"
							:width="100"
						>
						<div slot="main" v-loading="uploadLoading">
							<el-tooltip v-if="info.cover_url" class="item" effect="dark" content="点击上传封面" placement="top">
								<img :src="info.cover_url" class="avatar">
							</el-tooltip>
							<i v-else class="el-icon-plus avatar-uploader-icon" />
						</div>
					</l-img-upload>
				</el-form-item>
				<el-form-item prop="content" style="margin-bottom: 30px;">
					<WEditor v-model="info.content" :upload-img-config="{url:uploadApi, fileName:'files'}" @change="WEditorChange" />
				</el-form-item>
				<el-form-item>
					<el-button type="primary" @click="updateData(info.id)">提交</el-button>
				</el-form-item>
			</el-form>
		</el-card>
	</div>
</template>

<script>
	import { getArticleDetail, createdArticle, updateArticle } from '@/api/article';
	import ImageCropper from '@/components/ImageCropper';
	import PanThumb from '@/components/PanThumb';
	import MDinput from '@/components/MDinput';
	import WEditor from '@/components/WangeEditor';

	export default {
		name: 'DialogForm',
		components: { ImageCropper, PanThumb, MDinput, WEditor },
		data() {
			return {
				uploadApi: process.env.VUE_APP_IMAGE_BASE_API + '/upload/upload',
				uploadLoading: false,
				dataLoading: true,
				info: {
					id: undefined,
					cover_url: '',
					title: '',
					summary: '',
					content: '',
					cover: ''
				},
				rules: {
					title: [{ required: true, message: '标题不能为空', trigger: 'blur' }]
				}
			};
		},
		mounted() {
			this.init();
		},
		methods: {
			init() {
				const id = this.$route.params.id;
				if (id) {
					getArticleDetail(id).then(response => {
						this.info = response.data;
					});
				}
				this.dataLoading = false;
			},
			WEditorChange(val) {
				// console.log(val);
			},
			handleUploadSuccess(res, file) {
				this.$set(this.info, 'cover_url', res.data.url);
				this.$set(this.info, 'cover', res.data.path);
				this.iconLoading = false;
			},
			beforeUpload(file) {
				const isLt1M = file.size / 1024 / 1024 < 1;
				if (!isLt1M) {
					this.$message.error('图标大小不能超过 1MB!');
				}
				return isLt1M;
			},
			updateData() {
				if (this.info.id) {
					this.$refs['dataForm'].validate((valid) => {
						if (valid) {
							const tempData = Object.assign({}, this.info);
							updateArticle(tempData).then(response => {
								this.$notify({
									title: 'Success',
									message: 'Update Successfully',
									type: 'success',
									duration: 2000
								});
								this.$emit('dialog-close');
							});
						}
					});
				} else {
					this.$refs['dataForm'].validate((valid) => {
						if (valid) {
							createdArticle(this.info).then(response => {
								this.info.id = response.data;
								this.info.status = 1;
								this.$emit('dialog-close');
								this.$emit('success', this.info);
								this.$notify({
									title: 'Success',
									message: 'Created Successfully',
									type: 'success',
									duration: 2000
								});
							});
						}
					});
				}
				// 调用全局挂载的方法
				this.$store.dispatch('tagsView/delView', this.$route);
				// 返回上一步路由
				this.$router.go(-1);
			}
		}
	};
</script>

<style lang="scss" scoped>
.article-textarea ::v-deep {
    textarea {
        padding-right: 40px;
        resize: none;
        border: none;
        border-radius: 0px;
        border-bottom: 1px solid #bfcbd9;
    }
}
.avatar-uploader {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;

    &:hover {
        border-color: #409EFF;
    }
}
.avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 100px;
    height: 100px;
    line-height: 100px;
    text-align: center;
}
.avatar {
    width: 100px;
    height: 100px;
    display: block;
}
</style>
