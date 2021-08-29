<template>
	<div class="app-container">
		<el-form
				ref="dataForm"
				v-loading="loading"
				:rules="rules"
				:model="info"
				label-position="left"
				label-width="70px"
				style="width: 400px; margin-left:50px;"
			>

			<!--			<el-form-item label="头像">-->
			<!--				<pan-thumb :image="info.head_image_url" />-->
			<!--				<el-button type="primary" icon="el-icon-upload" style="position: absolute;bottom: 15px;margin-left: 40px;" @click="imagecropperShow=true">-->
			<!--					上传头像-->
			<!--				</el-button>-->
			<!--				<image-cropper-->
			<!--						v-show="imagecropperShow"-->
			<!--						field="files"-->
			<!--						:width="300"-->
			<!--						:height="300"-->
			<!--						:url="uploadApi"-->
			<!--						lang-type="zh"-->
			<!--						@close="close"-->
			<!--						@crop-upload-success="cropSuccess"-->
			<!--					/>-->
			<!--			</el-form-item>-->
			<el-form-item label="用户名">
				<el-input v-model="info.username" placeholder="请填写用户名" />
			</el-form-item>
			<el-form-item label="等级">
				<el-select v-model="info.relations.level_id" placeholder="请选择">
					<el-option
							v-for="item in levels"
							:key="item.id"
							:label="item.name"
							:value="item.id"
						/>
				</el-select>
			</el-form-item>
			<el-form-item label="产品等级">
				<el-select v-model="info.relations.pro_level" placeholder="请选择">
					<el-option
							v-for="item in pro_level"
							:key="item.id"
							:label="item.name"
							:value="item.id"
						/>
				</el-select>
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
			<el-form-item label="真实姓名">
				<el-input v-model="info.name" placeholder="请填写真实姓名" />
			</el-form-item>
			<el-form-item label="身份证号">
				<el-input v-model="info.identity_number" placeholder="请填写身份证号" />
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
	import { createUser, updateUser } from '@/api/users';
	import ImageCropper from '@/components/ImageCropper';
	import PanThumb from '@/components/PanThumb';
	import { getUserLevelsList } from '@/api/users';

	export default {
		name: 'DialogUserForm',
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
						name: '',
						identity_number: '',
						relations: {
							level_id: 1,
							pro_level: 0
						}
					};
				}
			}
		},
		data() {
			return {
				loading: false,
				imagecropperShow: false,
				uploadApi: process.env.VUE_APP_IMAGE_BASE_API + '/upload/upload',
				info: this.data,
				levels: [],
				pro_level: [
					{
						id: 0,
						name: '未购买',
						value: 0
					},
					{
						id: 1,
						name: '178产品',
						value: 1
					},
					{
						id: 2,
						name: '3119产品',
						value: 2
					}
				],
				rules: {
					type: [{ required: true, message: 'type is required', trigger: 'change' }],
					timestamp: [{ type: 'date', required: true, message: 'timestamp is required', trigger: 'change' }],
					title: [{ required: true, message: 'title is required', trigger: 'blur' }]
				}
			};
		},
		mounted() {
			this.init();
		},
		methods: {
			async init() {
				this.loading = true;
				try {
					let response = await getUserLevelsList();
					this.levels = response.data.data;
				} catch (e) {
					console.log(e);
				}
				this.loading = false;
			},
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
							updateUser(tempData).then(response => {
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
							createUser(this.info).then(response => {
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
