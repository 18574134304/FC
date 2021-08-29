<template>
	<div class="app-container config-group-container">
		<el-form ref="form" v-loading="loading" :model="formData" label-width="120px" @keyup.enter.native="handleSubmit">
			<el-form-item
					label="配置组名"
					prop="name"
					:rules="[
						{ required: true, message: '请输入配置组名' }
					]"
				>
				<el-input v-model="formData.name" />
				<!--<div class="form-item-tip">s</div>-->
			</el-form-item>
			<el-form-item
					label="配置组唯一标示"
					prop="keywords"
					:rules="[
						{ required: true, message: '请输入配置组唯一标示, 必须为英文字符串' }
					]"
				>
				<el-input v-model="formData.keywords" />
			</el-form-item>
			<el-form-item label="排序" prop="sort">
				<el-input v-model="formData.sort" />
			</el-form-item>
			<el-form-item prop="op">
				<el-button type="primary" @click="handleSubmit">提交</el-button>
			</el-form-item>
		</el-form>
	</div>
</template>

<script>
	import { addConfigCategories, editConfigCategories } from '../../api/config';

	export default {
		name: 'EditConfigGroup',
		props: {
			info: {
				type: Object,
				default() {
					return {};
				}
			}
		},
		data() {
			return {
				loading: false,
				formData: {
					name: '',
					keywords: '',
					sort: 9
				}
			};
		},
		computed: {
			params() {
				return {
					...this.info,
					...this.formData
				};
			}
		},
		methods: {
			handleSubmit() {
				this.$refs['form'].validate((valid) => {
					if (valid) {
						this.edit();
					} else {
						console.log('error submit!!');
						return false;
					}
				});
			},
			async edit() {
				this.loading = true;
				try {
					let response = this.info.id
						? await editConfigCategories(this.params)
						: await addConfigCategories(this.params);
					if (response.code === 0) {
						this.$message.success(this.info.id ? '修改成功' : '添加成功');
						this.$emit('success', response.data);
						this.$emit('dialog-close');
					}
				} catch (e) {
					console.log(e);
				}
				this.loading = false;
			}
		}
	};
</script>

<style scoped>

</style>
