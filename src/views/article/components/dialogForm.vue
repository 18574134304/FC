<template>
	<div class="app-container">
		<el-form
				ref="dataForm"
				:rules="rules"
				:model="info"
				label-position="left"
				label-width="70px"
				style="width: 400px; margin-left:50px;"
			>

			<el-form-item label="封面图">
				<pan-thumb :image="info.cover_url" />
				<el-button type="primary" icon="el-icon-upload" style="position: absolute;bottom: 15px;margin-left: 40px;" @click="imagecropperShow=true">
					上传封面
				</el-button>
				<image-cropper
						v-show="imagecropperShow"
						field="files"
						:width="300"
						:height="300"
						url="//www.haoye.com/upload/upload"
						lang-type="zh"
						@close="close"
						@crop-upload-success="cropSuccess"
					/>
			</el-form-item>
			<el-form-item label="标题">
				<el-input v-model="info.title" placeholder="请输入" />
			</el-form-item>
			<el-form-item label="描述">
				<el-input v-model="info.summary" placeholder="请输入描述" />
			</el-form-item>
			<el-form-item label="内容">
				<el-input v-model="info.content" placeholder="请输入内容" />
			</el-form-item>
		</el-form>
		<div slot="footer" class="dialog-footer">
			<el-button @click="$emit('dialog-close')">
				取消
			</el-button>
			<el-button type="primary" @click="updateData(info.id)">
				保存
			</el-button>
		</div>
	</div>
</template>

<script>
	import { createdArticle, updateArticle } from '@/api/article';
	import ImageCropper from '@/components/ImageCropper';
	import PanThumb from '@/components/PanThumb';

	export default {
		name: 'DialogForm',
		components: { ImageCropper, PanThumb },
		props: {
			// 接收
			data: {
				type: Object,
				default() {
					return {};
				}
			}
		},
		data() {
			return {
				imagecropperShow: false,
				info: this.data,
				rules: {
					type: [{ required: true, message: 'type is required', trigger: 'change' }],
					title: [{ required: true, message: 'title is required', trigger: 'blur' }]
				}
			};
		},
		methods: {
			cropSuccess(resData) {
				this.imagecropperShow = false;
				this.info.head_image_url = resData.url;
				this.info.head_image = resData.path;
			},
			close() {
				this.imagecropperShow = false;
			},
			updateData(status) {
				if (status) {
					this.$refs['dataForm'].validate((valid) => {
						if (valid) {
							const tempData = Object.assign({}, this.info);
							updateArticle(tempData).then(response => {
								// const index = this.list.findIndex(v => v.id === this.info.id);
								// this.list.splice(index, 1, this.info);
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
			}
		}
	};
</script>

<style scoped>

</style>
