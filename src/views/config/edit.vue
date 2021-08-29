<template>
	<div class="app-container edit-config-container">
		<el-form ref="form" v-loading="loading" :model="formData" label-width="120px" @keyup.enter.native="handleSubmit">
			<el-form-item
					:label="label['label' + category_id].name.label"
					prop="name"
					:rules="label['label' + category_id].name.rules"
				>
				<el-input v-model="formData.name" />
			</el-form-item>
			<el-form-item
					:label="label['label' + category_id].keywords.label"
					prop="keywords"
					:rules="label['label' + category_id].keywords.rules"
				>
				<el-input v-model="formData.keywords" />
			</el-form-item>
			<el-form-item
					v-if="label['label' + category_id].content"
					:label="label['label' + category_id].content.label"
					prop="content"
					:rules="label['label' + category_id].content.rules"
				>
				<el-input v-model="formData.content" />
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
	import { addConfig } from '../../api/config';

	export default {
		name: 'EditConfig',
		props: {
			category_id: {
				type: Number,
				required: true
			}
		},
		data() {
			return {
				loading: false,
				formData: {
					name: '',
					keywords: '',
					content: '',
					explain: '',
					extend: {},
					sort: 9
				}
			};
		},
		computed: {
			params() {
				return {
					category_id: this.category_id,
					...this.formData,
					content: this.formData.content || this.formData.keywords,
					extend: this.label['label' + this.category_id].extend || this.formData.extend
				};
			},
			label() {
				return {
					'label6': {
						name: {
							label: '快递公司名',
							rules: [
								{ required: true, message: '请输入快递公司名' }
							]
						},
						keywords: {
							label: '编码',
							rules: [
								{ required: true, message: '请输入快递公司编码' }
							]
						},
						content: {
							label: '快递费',
							rules: [
								{ required: true, message: '请输入快递费' }
							]
						},
						extend: { prepend: '¥' }
					},
					'label7': {
						name: {
							label: '银行名称',
							rules: [
								{ required: true, message: '请输入银行名称' }
							]
						},
						keywords: {
							label: '编码',
							rules: [
								{ required: true, message: '请输入银行名称编码' }
							]
						}
					}
				};
			}
		},
		methods: {
			handleSubmit() {
				this.$refs['form'].validate((valid) => {
					if (valid) {
						this.add();
					} else {
						console.log('error submit!!');
						return false;
					}
				});
			},
			async add() {
				this.loading = true;
				try {
					let response = await addConfig(this.params);
					if (response.code === 0) {
						this.$message.success('添加成功');
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
