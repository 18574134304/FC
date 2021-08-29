<template>
	<div class="l-img-uploader" :style="{ width: wrapWidth, height: wrapHeight }">
		<el-upload
				v-if="fileList"
				ref="upload"
				:headers="headers"
				:action="uploadUrl"
				:limit="limit"
				:multiple="multiple"
				:file-list="fileList"
				:accept="accept"
				:show-file-list="showFileList"
				:list-type="listType"
				:on-success="handleSuccess"
				:before-upload="handleBeforeUpload"
				:on-preview="handlePictureCardPreview"
				:on-remove="handleRemove"
				name="files"
			>
			<i v-if="!$slots.main" class="el-icon-plus" />
			<slot name="main" />
		</el-upload>
		<el-dialog v-if="!$slots.main" :visible.sync="dialogVisible">
			<img width="100%" :src="dialogImageUrl" alt="">
		</el-dialog>
	</div>
</template>

<script>
	import api from '../../api/assets';

	export default {
		name: 'LImgUpload',
		props: {
			type: {
				type: String,
				default: 'single' // single,list
			},
			accept: {
				type: String,
				default: 'image/png,image/jpeg,image/jpg'
			},
			limit: {
				type: Number,
				default: 5
			},
			listType: {
				type: String,
				default: 'picture-card' // text,picture,picture-card
			},
			size: {
				type: Number,
				default: 5
			},
			beforeUpload: {
				type: Function,
				default() {
					return () => true;
				}
			},
			onSuccess: {
				type: Function,
				default: () => {}
			},
			showFileList: {
				type: Boolean,
				default: true
			},
			width: {
				type: Number,
				default: 150
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
				fileList: null
			};
		},
		computed: {
			multiple() {
				// return this.type === 'list';
				return false;
			},
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
				if (this.fileList === null) {
					this.initFileList();
				}
			}
		},
		created() {
			this.initFileList();
		},
		methods: {
			initFileList() {
				if (this.type === 'single') {
					if (!this.value) {
						this.fileList = [];
					}
					this.fileList = [this.getItemData(this.value)];
				} else {
					this.fileList = (this.value || []).map(n => {
						return this.getItemData(n);
					});
				}
			},
			handleSuccess(res, file, fileList) {
				if (res.code === 0) {
					this.$message.success('上传成功');
					this.saveValue(fileList);

					this.onSuccess(res, file, fileList);
				} else {
					this.$message.error('上传失败：' + res.message);
				}
			},
			saveValue(list) {
				list = list.map(n => {
					if (n.response) {
						return n.response.data.path;
					} else {
						return n.name;
					}
				});
				if (this.type === 'single') {
					this.$emit('input', list[0]);
				} else {
					this.$emit('input', [...list]);
				}
			},
			getItemData(path) {
				return {
					name: path,
					url: api.imageBaseUrl + path
				};
			},
			handleBeforeUpload(file) {
				const isImg = this.accept.indexOf(file.type) > -1;
				const isLeftSize = file.size / 1024 / 1024 < this.size;

				if (!isImg) {
					this.$message.error('上传头像图片只能是图片格式!');
				}
				if (!isLeftSize) {
					this.$message.error(`上传头像图片大小不能超过 ${this.size}MB`);
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
				return isImg && isLeftSize && isSize;
			},
			handleRemove(file, fileList) {
				this.saveValue(fileList);
			},
			handlePictureCardPreview(file) {
				if (!this.$slots.main) {
					this.dialogImageUrl = file.url;
					this.dialogVisible = true;
				}
			}
		}
	};
</script>

<style scoped>

</style>
