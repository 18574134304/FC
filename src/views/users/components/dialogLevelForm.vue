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
			<el-form-item label="名称">
				<el-input v-model="info.name" placeholder="请填写名称" />
			</el-form-item>
			<el-form-item label="图标">
				<el-input v-model="info.icon" placeholder="请输入图标" />
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
	import { createLevel, updateLevel } from '@/api/users';

	export default {
		name: 'DialogLevelForm',
		props: {
			// 接收
			data: {
				type: Object,
				default() {
					return {
						id: undefined,
						name: '',
						icon_url: 'https://wpimg.wallstcn.com/577965b9-bb9e-4e02-9f0c-095b41417191',
						icon: ''
					};
				}
			}
		},
		data() {
			return {
				textMap: {
					update: '编辑',
					create: '新增'
				},
				info: this.data,
				rules: {
					name: [{ required: true, message: '名称不能为空', trigger: 'change' }],
					icon: [{ required: true, message: '图标不能为空' }]
				}
			};
		},
		methods: {
			updateData(status) {
				if (status) {
					this.$refs['dataForm'].validate((valid) => {
						if (valid) {
							const tempData = Object.assign({}, this.info);
							updateLevel(tempData).then(response => {
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
							createLevel(this.info).then(response => {
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
