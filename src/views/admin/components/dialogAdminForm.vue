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
			<el-form-item label="用户名">
				<el-input v-model="info.username" placeholder="请填写用户名" />
			</el-form-item>
			<el-form-item label="密码">
				<el-input v-model="info.password" placeholder="请输入密码6-16位，留空则不修改" />
			</el-form-item>
			<el-form-item label="昵称">
				<el-input v-model="info.nickname" placeholder="请填写昵称" />
			</el-form-item>
			<el-form-item label="部门">
				<el-select v-model="info.role_id" placeholder="请选择部门">
					<el-option
							v-for="item in departmentOptions"
							:key="item.id"
							:label="item.name"
							:value="item.id"
						/>
				</el-select>
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
	import { createAdmin, updateAdmin, getRoleList } from '@/api/admin';

	export default {
		name: 'DialogAdminForm',
		props: {
			// 接收
			data: {
				type: Object,
				default() {
					return {
						id: undefined,
						username: '',
						password: '',
						nickname: ''
					};
				}
			}
		},
		data() {
			return {
				loading: false,
				info: this.data,
				departmentOptions: 0,
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
			init() {
				getRoleList().then(response => {
					console.log(response.data);
					this.departmentOptions = response.data.data;
				});
			},
			updateData(status) {
				if (status) {
					this.$refs['dataForm'].validate((valid) => {
						if (valid) {
							const tempData = Object.assign({}, this.info);
							updateAdmin(tempData).then(response => {
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
							createAdmin(this.info).then(response => {
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
