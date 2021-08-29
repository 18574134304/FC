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
			<el-form-item label="收货人">
				<el-input v-model="info.name" placeholder="请填写收货人姓名" />
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
			<el-form-item label="手机号">
				<el-input v-model="info.phone_number" placeholder="请填写手机号码" />
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
	import { createUserAddr, updateUserAddr } from '@/api/users';
	import { regionData } from 'element-china-area-data';

	export default {
		name: 'DialogAddresEdit',
		props: {
			// 接收
			data: {
				type: Object,
				default() {
					return {
						id: undefined,
						user_id: '',
						name: '',
						phone_number: '',
						province_code: '',
						city_code: '',
						county_code: '',
						address: ''
					};
				}
			}
		},
		data() {
			return {
				options: regionData,
				selectedOptions: [String(this.data.province_code), String(this.data.city_code), String(this.data.county_code)],
				info: this.data,
				rules: {
					type: [{ required: true, message: 'type is required', trigger: 'change' }],
					timestamp: [{ type: 'date', required: true, message: 'timestamp is required', trigger: 'change' }],
					title: [{ required: true, message: 'title is required', trigger: 'blur' }]
				}
			};
		},
		methods: {
			handleChange(value) {
				this.info.province_code = value[0];
				this.info.city_code = value[1];
				this.info.county_code = value[2];
			},
			updateData(status) {
				if (status) {
					this.$refs['dataForm'].validate((valid) => {
						if (valid) {
							const tempData = Object.assign({}, this.info);
							updateUserAddr(tempData).then(response => {
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
							createUserAddr(this.info).then(response => {
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
