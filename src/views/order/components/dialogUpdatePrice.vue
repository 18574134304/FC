<template>
	<div class="app-container">
		<el-form
				ref="dataForm"
				:model="info"
				label-position="left"
				label-width="70px"
				style="width: 400px; margin-left:50px;"
			>
			<el-form-item label="减少/增加" label-width="80px">
				<el-input-number v-model="num" :precision="2" @change="handleChange" />
				<span class="order-summary">正数增加，负数减少</span>
				<div>
					<span>应付款：</span>
					<span class="cs-pr-10">{{ original_num }}</span>
					<span>调整后：</span>
					<strong>{{ finally_num }}</strong>
				</div>
			</el-form-item>
		</el-form>
		<div slot="footer" class="dialog-footer">
			<el-button @click="$emit('dialog-close')">
				取消
			</el-button>
			<el-button type="primary" @click="updateData()">
				确定
			</el-button>
		</div>
	</div>
</template>

<script>
	import { updateOrderPrice } from '@/api/order';

	export default {
		name: 'DialogUpdatePrice',
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
				info: this.data,
				num: '0.00',
				original_num: this.data.total_amount,
				finally_num: 0
			};
		},
		created() {
			this.finally_num = this.original_num;
		},
		methods: {
			handleChange(value) {
				this.finally_num = (+this.original_num + value).toFixed(2);
				this.info.total_amount = this.finally_num;
			},
			updateData() {
				const temp = {
					id: this.info.id,
					total_amount: this.info.total_amount
				};
				this.$refs['dataForm'].validate((valid) => {
					if (valid) {
						updateOrderPrice(temp).then(response => {
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
			}
		}
	};
</script>

<style lang="scss" scoped>
.order-summary {
    color: #c0c4cc;
    font-size: 13px;
    padding-left: 10px!important;
}
.cs-pr-10 {
    padding-right: 10px!important;
}
</style>
