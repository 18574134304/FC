<template>
	<div class="app-container">
		<el-form
				ref="dataForm"

				:model="dataForm"
				:inline="true"
				size="small"
				:rules="rules"
			>
			<el-form-item
					label="快递公司"
					prop="express_type"
				>
				<el-select
						v-model="dataForm.express_type"
						placeholder="请选择"
						style="width: 280px;"
						clearable
					>
					<el-option
							v-for="item in express_list"
							:key="item.id"
							:label="item.name"
							:value="item.id"
						/>
				</el-select>
			</el-form-item>

			<el-form-item
					label="快递单号"
					prop="express_code"
				>
				<el-input
						v-model="dataForm.express_code"
						placeholder="请输入快递单号"
						:clearable="true"
					/>
			</el-form-item>
		</el-form>
		<div slot="footer" class="dialog-footer">
			<el-button
					size="small"
					@click="$emit('dialog-close')"
				>取消</el-button>
			<el-button
					type="primary"
					size="small"
					@click="updateData()"
				>确定</el-button>
		</div>
	</div>
</template>

<script>
	import { getConfig } from '@/api/config';
	import { updateOrder } from '@/api/order';
	export default {
		name: 'DialogShip',
		props: {
			id: {
				default() {
					return {};
				}
			}
		},
		data() {
			return {
				express_list: {},
				dataForm: {
					express_type: '',
					express_code: ''
				},
				rules: {
					express_type: [{ required: true, message: '至少选择一项', trigger: 'change' }],
					express_code: [{ required: true, message: '快递单号不能为空', trigger: 'change' }]
				}
			};
		},
		mounted() {
			this.init();
		},
		methods: {
			init() {
				getConfig({ category_id: 6 }).then(response => {
					this.express_list = response.data;
				});
			},
			updateData() {
				this.$refs['dataForm'].validate((valid) => {
					if (valid) {
						const temp = {
							id: this.id,
							express_type: this.dataForm.express_type,
							express_code: this.dataForm.express_code,
							status: 30
						};
						updateOrder(temp).then(response => {
							this.$notify({
								title: 'Success',
								message: 'Update Successfully',
								type: 'success',
								duration: 2000
							});
							this.$emit('success', temp);
							this.$emit('dialog-close');
						});
					}
				});
			}
		}
	};
</script>

<style scoped>

</style>
