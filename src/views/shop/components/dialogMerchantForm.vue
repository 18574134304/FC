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

			<el-form-item label="用户头像">
				<pan-thumb :image="info.head_image_url" />
				<el-button type="primary" icon="el-icon-upload" style="position: absolute;bottom: 15px;margin-left: 40px;" @click="imagecropperShow=true">
					上传头像
				</el-button>
				<image-cropper
						v-show="imagecropperShow"
						field="files"
						:width="300"
						:height="300"
						:url="uploadApi"
						lang-type="zh"
						@close="close"
						@crop-upload-success="cropSuccess"
					/>
			</el-form-item>
			<el-form-item label="用户名">
				<el-input v-model="info.username" placeholder="请填写用户名" />
			</el-form-item>
			<el-form-item label="密码">
				<el-input v-model="info.password" placeholder="请输入密码6-16位，留空则不修改" />
			</el-form-item>
			<el-form-item label="昵称">
				<el-input v-model="info.nickname" placeholder="请填写昵称" />
			</el-form-item>
			<el-form-item label="手机号">
				<el-input v-model="info.phone_number" placeholder="请填写手机号码" />
			</el-form-item>
			<div v-if="!info.id">
				<el-form-item label="店铺名称">
					<el-input v-model="info.shop_info.shop_name" placeholder="请填写店铺名称" />
				</el-form-item>
				<el-form-item label="店铺类型">
					<el-select v-model="info.shop_info.type" placeholder="请选择店铺类型">
						<el-option
								v-for="item in typeOptions"
								:key="item.value"
								:label="item.label"
								:value="item.value"
							/>
					</el-select>
				</el-form-item>
			</div>
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
	import { createMerchant, updateMerchant } from '@/api/shop';
	import ImageCropper from '@/components/ImageCropper';
	import PanThumb from '@/components/PanThumb';

	export default {
		name: 'DialogMerchantForm',
		components: { ImageCropper, PanThumb },
		props: {
			// 接收
			data: {
				type: Object,
				default() {
					return {
						id: undefined,
						head_image_url: 'https://wpimg.wallstcn.com/577965b9-bb9e-4e02-9f0c-095b41417191',
						head_image: '',
						username: '',
						password: '',
						nickname: '',
						phone_number: '',
						shop_info: {
							shop_name: '',
							type: ''
						}
					};
				}
			}
		},
		data() {
			return {
				imagecropperShow: false,
				uploadApi: process.env.VUE_APP_IMAGE_BASE_API + '/upload/upload',
				info: this.data,
				typeOptions: [
					{
						label: '自营',
						value: 1
					},
					{
						label: '线上',
						value: 2
					},
					{
						label: '线下',
						value: 3
					},
					{
						label: '联盟',
						value: 4
					}
				],
				rules: {
					type: [{ required: true, message: 'type is required', trigger: 'change' }],
					timestamp: [{ type: 'date', required: true, message: 'timestamp is required', trigger: 'change' }],
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
							updateMerchant(tempData).then(response => {
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
							createMerchant(this.info).then(response => {
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
