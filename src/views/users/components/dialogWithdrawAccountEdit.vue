<template>
	<div class="app-container">
		<el-form
				ref="dataForm"
				:rules="rules"
				:model="info"
				label-position="left"
				label-width="90px"
				style="width: 400px; margin-left:50px;"
			>
			<el-form-item label="类型">
				<el-select v-model="info.type" placeholder="请选择收款方式">
					<el-option
							v-for="item in options"
							:key="item.value"
							:label="item.label"
							:value="item.value"
						/>
				</el-select>
			</el-form-item>
			<el-form-item label="收款人姓名">
				<el-input v-model="info.name" placeholder="请输入收款人姓名" />
			</el-form-item>
			<el-form-item label="收款人账号">
				<el-input v-model="info.account" placeholder="请输入收款人账号" />
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
	import { createUserWithdrawAccount, updateUserWithdrawAccount } from '@/api/users';

	export default {
		name: 'DialogWithdrawAccountEdit',
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
				options: [{
					value: 1,
					label: '支付宝'
				}, {
					value: 2,
					label: '银行卡'
				}],
				info: this.data,
				rules: {
					type: [{ required: true, message: 'type is required', trigger: 'change' }],
					name: [{ required: true, message: 'title is required', trigger: 'blur' }]
				}
			};
		},
		methods: {
			updateData(status) {
				if (status) {
					this.$refs['dataForm'].validate((valid) => {
						if (valid) {
							const tempData = Object.assign({}, this.info);
							updateUserWithdrawAccount(tempData).then(response => {
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
							createUserWithdrawAccount(this.info).then(response => {
								this.info.id = response.data;
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
