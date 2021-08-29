<template>
	<div class="app-container">
		<el-form
				ref="dataForm"
				:model="info"
				label-position="left"
				label-width="85px"
				style="width: 400px; margin-left:50px;"
			>
			<el-form-item label="收货人姓名">
				<el-input v-model="info.name" placeholder="请填写收货人姓名" />
			</el-form-item>
			<el-form-item label="收货人手机">
				<el-input v-model="info.phone_number" placeholder="请填写收货人手机" />
			</el-form-item>
			<el-form-item label="收货区域">
				<el-cascader
						v-model="selectedOptions"
						size="large"
						:options="options"
						style="width: 100%"
						@change="handleChange"
					/>
			</el-form-item>
			<el-form-item label="详细地址">
				<el-input v-model="info.address" placeholder="请填写详细地址" />
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
	import { regionData } from 'element-china-area-data';

	export default {
		name: 'DialogUpdateDeliveryInfo',
		filters: {
			statusFilter(status, field) {
				const statusMap = [
					{ type: 'info', name: '待处理' },
					{ type: '', name: '处理中' },
					{ type: 'success', name: '已完成' },
					{ type: 'warning', name: '已失败' },
					{ type: 'warning', name: '已取消' },
					{ type: 'danger', name: '已拒绝' }
				];
				return statusMap[status][field];
			}
		},
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
				options: regionData,
				selectedOptions: [String(this.data.province_code), String(this.data.city_code), String(this.data.county_code)]
			};
		},
		methods: {
			handleChange(value) {
				this.info.province_code = value[0];
				this.info.city_code = value[1];
				this.info.county_code = value[2];
			},
			updateData() {
				console.log(this.info);
			}
		}
	};
</script>

<style scoped>

</style>
