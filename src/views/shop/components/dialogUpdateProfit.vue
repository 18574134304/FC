<template>
	<div class="app-container">
		<el-form
				ref="dataForm"
				:model="info"
				label-position="left"
				label-width="70px"
				style="width: 400px; margin-left:50px;"
			>
			<el-form-item label="服务费" label-width="80px">
				<el-input v-model="info.profit" placeholder="请输入比例">
					<template slot="append">%</template>
				</el-input>
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
	import { updateShopProfit } from '@/api/shop';

	export default {
		name: 'DialogUpdateProfit',
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
				info: this.data
			};
		},
		methods: {
			updateData() {
				const temp = {
					id: this.info.id,
					profit: this.info.profit
				};
				this.$refs['dataForm'].validate((valid) => {
					if (valid) {
						updateShopProfit(temp).then(response => {
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
