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
				<el-form-item label="发布分类">
					<el-select v-model="info.category_id" placeholder="请选择">
						<el-option
								v-for="item in categoryOptions"
								:key="item.id"
								:label="item.name"
								:value="item.id"
							/>
					</el-select>
				</el-form-item>
				<el-form-item label="分享封面">
					<l-image-upload
							v-model="info.cover"
							type="single"
							:file-url="info.cover_url"
						/>
				</el-form-item>
				<el-form-item label="图片列表">
					<l-image-upload
							v-model="info.images"
							type="list"
							:file-url="info.images_list"
						/>
				</el-form-item>

				<el-form-item label="内容" prop="content" style="margin-bottom: 30px;">
					<el-input v-model="info.content" type="textarea" :rows="3" />
				</el-form-item>

				<el-form-item>
					<el-button type="primary" @click="updateData(info.id)">提交</el-button>
				</el-form-item>
			</el-form>
		</el-card>
	</div>
</template>

<script>
	import { getDetectionDetail, createdDetection, updateDetection, getDetectionCategoryList } from '@/api/detection';
	import ImageCropper from '@/components/ImageCropper';
	import PanThumb from '@/components/PanThumb';

	export default {
		name: 'DialogForm',
		components: { ImageCropper, PanThumb },
		data() {
			return {
				uploadApi: process.env.VUE_APP_IMAGE_BASE_API + '/upload/upload',
				uploadLoading: false,
				dataLoading: true,
				categoryOptions: [],
				info: {
					id: undefined,
					cover: '',
					cover_url: '',
					images: [],
					images_list: '',
					content: ''
				},
				rules: {
					title: [{ required: true, message: '标题不能为空', trigger: 'blur' }]
				}
			};
		},
		mounted() {
			this.getCategoryList();
			this.init();
		},
		methods: {
			init() {
				const id = this.$route.params.id;
				if (id) {
					getDetectionDetail(id).then(response => {
						this.info = response.data;
					});
				}
				this.dataLoading = false;
			},
			getCategoryList() {
				getDetectionCategoryList().then(response => {
					this.categoryOptions = response.data.data;
				});
			},
			handleUploadSuccess(res, file) {
				this.$set(this.info, 'cover_url', res.data.url);
				this.$set(this.info, 'cover', res.data.path);
				this.iconLoading = false;
			},
			beforeUpload(file) {
				const isLt1M = file.size / 1024 / 1024 < 1;
				if (!isLt1M) {
					this.$message.error('大小不能超过 1MB!');
				}
				return isLt1M;
			},
			updateData() {
				if (this.info.id) {
					this.$refs['dataForm'].validate((valid) => {
						if (valid) {
							const tempData = Object.assign({}, this.info);
							updateDetection(tempData).then(response => {
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
							createdDetection(this.info).then(response => {
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
