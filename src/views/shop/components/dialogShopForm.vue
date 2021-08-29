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

			<el-form-item label="店铺LOGO">
				<pan-thumb :image="info.logo_url" />
				<el-button type="primary" icon="el-icon-upload" style="position: absolute;bottom: 15px;margin-left: 40px;" @click="imagecropperShow=true">
					上传LOGO
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
			<el-form-item label="店铺名称">
				<el-input v-model="info.shop_name" placeholder="请输入店铺名称" />
			</el-form-item>
			<el-form-item label="店铺类型">
				<el-select v-model="info.type" placeholder="请选择店铺类型">
					<el-option
							v-for="item in typeOptions"
							:key="item.value"
							:label="item.label"
							:value="item.value"
						/>
				</el-select>
			</el-form-item>
			<el-form-item label="主营业务">
				<el-input v-model="info.business" placeholder="请输入主营业务" />
			</el-form-item>
			<el-form-item label="省/市/区">
				<el-cascader
						v-model="selectedOptions"
						size="large"
						:options="options"
						style="width: 100%"
						@change="handleChange"
					/>
			</el-form-item>
			<el-form-item label="详细地址">
				<el-input v-model="info.address" placeholder="请输入详细地址" />
			</el-form-item>
			<el-form-item label="电话号码">
				<el-input v-model="info.tel_number" placeholder="请输入电话号码" />
			</el-form-item>
			<el-form-item prop="contact_qrcode" label="微信二维码">
				<l-image-upload
						v-model="info.contact_qrcode"
						:file-url="info.contact_qrcode_url"
						:show-file-list="false"
						:width="100"
					/>
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
	import { createShop, updateShop } from '@/api/shop';
	import ImageCropper from '@/components/ImageCropper';
	import { regionData } from 'element-china-area-data';
	import PanThumb from '@/components/PanThumb';

	export default {
		name: 'DialogShopForm',
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
				uploadApi: process.env.VUE_APP_IMAGE_BASE_API + '/upload/upload',
				imagecropperShow: false,
				info: this.data,
				options: regionData,
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
						label: '联盟',
						value: 3
					},
					{
						label: '加盟',
						value: 4
					}
				],
				selectedOptions: [String(this.data.province_code), String(this.data.city_code), String(this.data.county_code)],
				rules: {
					shop_name: [{ required: true, message: 'title is required', trigger: 'blur' }],
					business: [{ required: true, message: 'type is required', trigger: 'change' }]
				}
			};
		},
		methods: {
			handleChange(value) {
				this.info.province_code = value[0];
				this.info.city_code = value[1];
				this.info.county_code = value[2];
			},
			cropSuccess(resData) {
				this.imagecropperShow = false;
				this.info.logo_url = resData.url;
				this.info.logo = resData.path;
			},
			close() {
				this.imagecropperShow = false;
			},
			updateData(status) {
				if (status) {
					this.$refs['dataForm'].validate((valid) => {
						if (valid) {
							const tempData = Object.assign({}, this.info);
							updateShop(tempData).then(response => {
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
							createShop(this.info).then(response => {
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
