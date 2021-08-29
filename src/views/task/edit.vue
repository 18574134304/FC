<template>
	<div class="app-container edit-task-container">
		<el-form ref="form" :model="formData" label-width="80px">
			<el-form-item
					prop="name"
					label="任务名称"
					:rules="[
						{ required: true, message: '请输入任务名称' },
					]"
				>
				<el-input v-model="formData.name" />
			</el-form-item>
			<el-form-item
					prop="path"
					label="任务视频"
					:rules="[
						{ required: true, message: '请上传任务视频' },
					]"
				>
				<el-upload
						class="avatar-uploader"
						:action="uploadUrl"
						:on-progress="uploadVideoProcess"
						:on-success="handleVideoSuccess"
						:before-upload="beforeUploadVideo"
						:show-file-list="false"
						name="files"
					>
					<el-tooltip v-if="videoForm.path !== '' && !videoFlag" class="item" effect="dark" content="点击重新上传视频覆盖" placement="top">
						<video
								:src="videoForm.url"
								class="avatar video-avatar"
								controls="controls"
							>
							您的浏览器不支持视频播放
						</video>
					</el-tooltip>
					<i
							v-else-if="videoForm.path === '' && !videoFlag"
							class="el-icon-plus avatar-uploader-icon"
						/>
					<el-progress
							v-if="videoFlag"
							type="circle"
							:percentage="videoUploadPercent"
							style="margin-top:7px;"
						/>
				</el-upload>
			</el-form-item>
			<el-form-item prop="op">
				<el-button type="primary" @click="submitForm">提交</el-button>
			</el-form-item>
		</el-form>
	</div>
</template>

<script>
	import api from '../../api/assets';
	import { addTask } from '../../api/tesk';

	export default {
		name: 'TaskEdit',
		data() {
			return {
				uploadUrl: api.uploadUrl,
				videoFlag: false,
				// 是否显示进度条
				videoUploadPercent: '',
				// 进度条的进度，
				isShowUploadVideo: false,
				// 显示上传按钮
				videoForm: {
					path: '',
					url: ''
				},
				formData: {
					name: '',
					path: ''
				}
			};
		},
		methods: {
			// 上传前回调
			beforeUploadVideo(file) {
				var fileSize = file.size / 1024 / 1024 < 6;
				if (['video/mp4', 'video/ogg', 'video/flv', 'video/avi', 'video/wmv', 'video/rmvb', 'video/mov'].indexOf(file.type) === -1) {
					this.$message.error('请上传正确的视频格式');
					return false;
				}
				if (!fileSize) {
					this.$message.error('视频大小不能超过50MB');
					return false;
				}
				this.isShowUploadVideo = false;
			},
			// 进度条
			uploadVideoProcess(event, file, fileList) {
				this.videoFlag = true;
				this.videoUploadPercent = file.percentage.toFixed(0) * 1;
			},
			// 上传成功回调
			handleVideoSuccess(res, file) {
				console.log(res, file);
				this.isShowUploadVideo = true;
				this.videoFlag = false;
				this.videoUploadPercent = 0;

				// 前台上传地址
				// if (file.status == 'success' ) {
				//    this.videoForm.showVideoPath = file.url;
				// } else {
				//     layer.msg("上传失败，请重新上传");
				// }

				// 后台上传地址
				if (res.code === 0) {
					this.videoForm = res.data;
					this.formData.path = res.data.path;
				} else {
					this.$message.error('ss');
				}
			},
			async saveTask() {
				this.loading = true;
				try {
					let response = await addTask(this.formData);
					if (response.code === 0) {
						this.$emit('success', response.data);
						this.$emit('dialog-close');
					}
				} catch (e) {
					console.log(e);
				}
				this.loading = false;
			},
			submitForm() {
				this.$refs['form'].validate((valid) => {
					if (valid) {
						this.saveTask();
					} else {
						return false;
					}
				});
			}
		}
	};
</script>

<style lang="scss" scoped>
	.edit-task-container {
		.el-upload {
			.avatar-uploader-icon {
				width: 100px;
				height: 100px;
				line-height: 100px;
				border: 1px dashed #d9d9d9;
				border-radius: 4px;

				&:hover {
					border-color: #409EFF;
				}
			}

			.video-avatar {
				max-height: 300px;
				max-width: 100%;
			}
		}
	}
</style>
