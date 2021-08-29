<template>
	<div class="app-container">
		<table style="width: 100%;" :model="info">
			<caption>
				<p style="background-color: rgb(248, 248, 249);">
					提现单据
				</p>
			</caption>
			<tr>
				<td>
					<b>提现单号：</b>
					{{ info.trade_no }}
				</td>
				<td>
					<b>账号/昵称：</b>
					{{ info.user_info.username }} / {{ info.user_info.nickname }}
				</td>
			</tr>
			<tr>
				<td>创建日期：{{ info.created_at }}</td>
			</tr>
		</table>
		<table style="width: 100%">
			<colgroup>
				<col style="width: 20%">
				<col style="width: 75%">
			</colgroup>
			<caption>
				<p style="background-color: rgb(248, 248, 249)">收款明细</p>
			</caption>
			<tr>
				<td>收款人姓名：</td>
				<td>{{ info.name }}</td>
			</tr>
			<tr>
				<td>收款人手机：</td>
				<td>{{ info.phone_number }}</td>
			</tr>
			<tr>
				<td>收款账户：</td>
				<td>{{ info.type | typeFilter }}</td>
			</tr>
			<tr>
				<td>收款账号：</td>
				<td>{{ info.bank_account }}</td>
			</tr>
			<tr />
			<tr>
				<td><b>提现金额：</b></td>
				<td>{{ info.amount }}</td>
			</tr>
			<tr>
				<td>手续费：</td>
				<td>{{ info.charge }}</td>
			</tr>
			<tr>
				<td>合计金额：</td>
				<td>{{ info.payment }}</td>
			</tr>
		</table>

		<table style="width: 100%">
			<caption>
				<p style="background-color: rgb(248, 248, 249)">其他内容</p>
			</caption>
			<tbody>
				<tr>
					<td>
						<span>类型：</span>
						<el-tag v-if="info.amount_origin==1" type="info">
							余额
						</el-tag>
						<el-tag v-else-if="info.amount_origin==2" type="info">
							金花
						</el-tag>
					</td>
				</tr>
				<tr>
					<td>
						<span>状态：</span>
						<el-tag :type="info.status | statusFilter('type')">
							{{ info.status | statusFilter('name') }}
						</el-tag>
					</td>
				</tr>
				<tr>
					<td>备注：{{ info.remark }}</td>
				</tr>
			</tbody>
		</table>

		<div slot="footer" class="dialog-footer">
			<el-button v-if="info.status == 0" type="primary" @click="updateData(1)">
				处理提现
			</el-button>
			<el-button v-if="info.status == 1" type="success" @click="updateData(2)">
				完成提现
			</el-button>
			<el-button v-if="info.status == 1" type="danger" @click="updateData(5)">
				拒绝提现
			</el-button>
			<el-button @click="$emit('dialog-close')">
				取消
			</el-button>
		</div>
	</div>
</template>

<script>
	import { updateUserWithdraw } from '@/api/finance';

	export default {
		name: 'DialogwithdrawForm',
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
			},
			typeFilter(status) {
				const statusMap = {
					1: '银行卡',
					2: '支付宝',
					3: '微信'
				};
				return statusMap[status];
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
				info: this.data
			};
		},
		methods: {
			updateData(status) {
				if (status == 1) {
					this.$confirm('确定要执行该操作吗?', '提示', {
						confirmButtonText: '确定',
						cancelButtonText: '取消',
						type: 'warning'
					}).then(() => {
						this.info.status = status;
						updateUserWithdraw(this.info).then(response => {
							// this.$set(this.info, this.info);
						});
					}).catch(() => {});
				} else if (status == 2) {
					this.$confirm('确定要执行该操作吗?', '提示', {
						confirmButtonText: '确定',
						cancelButtonText: '取消',
						type: 'warning'
					}).then(() => {
						this.info.status = status;
						updateUserWithdraw(this.info).then(response => {
							// this.$set(this.info, this.info);
						});
					}).catch(() => {});
				} else if (status == 5) {
					this.$prompt('请填写拒绝原因', '拒绝', {
						confirmButtonText: '确定',
						cancelButtonText: '取消'
					}).then((value) => {
						this.info.status = status;
						this.info.remark = value.value;
						updateUserWithdraw(this.info).then(response => {
							// this.$set(this.info, this.info);
						});
					}).catch(() => {});
				}
			}
		}
	};
</script>

<style scoped>

</style>
