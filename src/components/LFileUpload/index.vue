<template>
	<div class="l-file-uploader" :style="{ width: wrapWidth, height: wrapHeight }">
		<el-upload
				:class="['l-file-uploader--' + type]"
				:action="uploadUrl"
				:headers="headers"
				:accept="accept"
				:show-file-list="showFileList"
				:list-type="type === 'single' ? 'text' : listType"
				:file-list="fileList"
				:limit="limit"
				name="files"
				:on-preview="handlePictureCardPreview"
				:on-success="handleSuccess"
				:before-upload="handleBeforeUpload"
				:on-remove="handleRemove"
			>
			<i v-if="type !== 'single'" class="el-icon-plus" />
			<div v-else v-loading="loading" class="single-image">
				<el-tooltip v-if="file" class="item" effect="dark" content="点击上传覆盖" placement="top">
					<img :src="file" class="image-file" :style="{ width: wrapWidth, height: wrapHeight }">
				</el-tooltip>
				<i v-else class="el-icon-plus avatar-uploader-icon" :style="{ width: wrapWidth, lineHeight: wrapHeight }" />
			</div>
		</el-upload>
		<el-dialog v-if="type !== 'single'" :visible.sync="dialogVisible" top="5vh">
			<el-image
					width="100%"
					:src="dialogImageUrl"
					fit="contain"
				/>
		</el-dialog>
	</div>
</template>

<script>
	import api from '../../api/assets';

	export default {
		name: 'LFileUpload',
		props: {
			type: {
				type: String,
				default: 'single' // single: 单张/list: 列表
			},
			listType: {
				type: String,
				default: 'picture-card' // text/picture/picture-card
			},
			accept: {
				type: String,
				default: 'image/png,image/jpeg,image/jpg'
			},
			size: {
				type: Number,
				default: 5
			},
			limit: {
				type: Number,
				default: 5
			},
			fileUrl: {
				type: [String, Array],
				default: null
			},
			showFileList: {
				type: Boolean,
				default: true
			},
			width: {
				type: Number,
				default: 150
			},
			limitWidth: {
				type: Number,
				default: 0
			},
			limitHeight: {
				type: Number,
				default: 0
			},
			onSuccess: {
				type: Function,
				default: null
			},
			beforeUpload: {
				type: Function,
				default: () => { return true; }
			},
			value: {
				type: [String, Array, Object],
				default: ''
			}
		},
		data() {
			return {
				uploadUrl: api.uploadUrl,
				dialogImageUrl: '',
				dialogVisible: false,
				fileList: [],
				file: '',
				loading: false,
				showFileUrl: ''
			};
		},
		computed: {
			wrapWidth() {
				if (this.type === 'single') {
					return (this.width) + 'px';
				}
				return 'auto';
			},
			wrapHeight() {
				if (this.type === 'single') {
					return (this.width) + 'px';
				}
				return 'auto';
			},
			headers() {
				return {
					Authorization: api.token()
				};
			}
		},
		watch: {
			value() {
				this.initFileList();
			}
		},
		mounted() {
			this.initFileList();
		},
		methods: {
			initFileList() {
				this.showFileUrl = this.showFileUrl || this.fileUrl;
				if (this.type === 'single') {
					this.file = this.showFileUrl;
				} else {
					this.fileList = [];
					(this.showFileUrl || []).forEach((n, index) => {
						this.fileList.push({
							url: n,
							path: this.value[index]
						});
					});
				}
			},
			handleSuccess(res, file, fileList) {
				if (res.code === 0) {
					this.$message.success('上传成功');
					this.saveValue(fileList);

					if (typeof this.onSuccess === 'function') {
						this.onSuccess(res, file, fileList);
					} else {
						this.onSuccessDefault(res, file, fileList);
					}
				} else {
					this.$message.error('上传失败：' + res.message);
				}
				this.loading = false;
			},
			onSuccessDefault(res, file, fileList) {
				if (this.type === 'single') {
					this.file = URL.createObjectURL(file.raw);
				} else {
					this.fileList.push({ name: file.name, url: res.data.url, path: res.data.path });
				}
			},
			saveValue(fileList) {
				// let list = [];
				// this.showFileUrl = [];
				// fileList.forEach(n => {
				// 	if (n.response) {
				// 		list.push(n.response.data.path);
				// 		this.showFileUrl.push(n.response.data.url);
				// 	} else {
				// 		list.push(n.path);
				// 		this.showFileUrl.push(n.url);
				// 	}
				// });
				// if (this.type === 'single') {
				// 	this.$emit('input', list[0]);
				// } else {
				// 	this.$emit('input', [...list]);
				// }

				let list = [];
				this.showFileUrl = fileList.map(n => {
					if (n.response) {
						list.push(n.response.data.path);
						return n.response.data.url;
					} else {
						list.push(n.path);
						return n.url;
					}
				});
				if (this.type === 'single') {
					this.$emit('input', list[0]);
				} else {
					this.$emit('input', [...list]);
				}
			},
			handlePictureCardPreview(file) {
				this.dialogImageUrl = file.url;
				this.dialogVisible = true;
			},
			handleBeforeUpload(file) {
				this.loading = true;
				const isAccept = this.accept.indexOf(file.type) > -1;
				const isLeftSize = file.size / 1024 / 1024 < this.size;

				if (!isAccept) {
					this.$message.error('上传文件格式不对!');
				}
				if (!isLeftSize) {
					this.$message.error(`上传大小不能超过 ${this.size}MB`);
				}

				const isSize = new Promise((resolve, reject) => {
					let _URL = window.URL || window.webkitURL;
					let img = new Image();
					img.onload = () => {
						let valid = this.beforeUpload(file, img);
						valid ? resolve() : reject();
					};
					img.src = _URL.createObjectURL(file);
				}).then(() => {
					return file;
				}, () => {
					return Promise.reject();
				});
				return isAccept && isLeftSize && isSize;
			},
			handleRemove(file, fileList) {
				this.saveValue(fileList);
			}
		}
	};
</script>

<style lang="scss">
	.l-file-uploader {
		.el-upload-list__item-thumbnail {
			object-fit: contain;
		}

		.l-file-uploader--single {
			.el-upload {
				border: 1px dashed #d9d9d9;
				border-radius: 6px;
				cursor: pointer;
				position: relative;
				overflow: hidden;

				&:hover {
					border-color: #409EFF;
				}

				.single-image {
					.avatar-uploader-icon {
						font-size: 28px;
						color: #8c939d;
						text-align: center;
					}
					.image-file {
						display: block;
						object-fit: contain;
					}
				}
			}
		}
	}
</style>
