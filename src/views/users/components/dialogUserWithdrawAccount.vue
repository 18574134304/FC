<template>
	<div class="app-container">
		<el-button type="primary" @click="handleCreateWithdrawAccount">添加账户</el-button>
		<el-table
				v-loading="listLoading"
				:data="addressList"
				fit
				highlight-current-rowstyle="width: 100%;"
			>
			<el-table-column
					label="ID"
					prop="id"
					align="center"
					width="80"
				>
				<template slot-scope="{row}">
					<span>{{ row.id }}</span>
				</template>
			</el-table-column>
			<el-table-column label="类型" width="110" align="center">
				<template slot-scope="{row}">
					<el-tag type="info">
						{{ row.type | statusFilter }}
					</el-tag>
				</template>
			</el-table-column>
			<el-table-column label="收款姓名" width="110" align="center">
				<template slot-scope="{row}">
					<span>{{ row.name }}</span>
				</template>
			</el-table-column>
			<el-table-column label="收款账号" align="center">
				<template slot-scope="{row}">
					<span>{{ row.account }}</span>
				</template>
			</el-table-column>
			<el-table-column label="操作" align="center" width="280" class-name="small-padding fixed-width">
				<template slot-scope="{row,$index}">
					<el-button type="primary" size="mini" @click="handleEdit(row)">
						编辑
					</el-button>
					<el-button v-if="row.status!==0" type="danger" size="mini" @click="handleDelete(row,$index)">
						删除
					</el-button>
					<el-button v-if="row.status===0" type="success" size="mini" @click="handleReverseDelete(row,$index)">
						恢复
					</el-button>
				</template>
			</el-table-column>
		</el-table>
	</div>
</template>

<script>
	import { getUserWithdrawAccountList, delUserUserWithdrawAccount, restoreUserWithdrawAccount } from '@/api/users';
	import DialogWithdrawAccountEdit from '@/views/users/components/dialogWithdrawAccountEdit';
	export default {
		name: 'DialogUserWithdrawAccount',
		filters: {
			statusFilter(status) {
				const statusMap = {
					1: '支付宝',
					2: '银行卡'
				};
				return statusMap[status];
			}
		},
		props: {
			// 接收
			id: {
				type: Number,
				default() {
					return 0;
				}
			}
		},
		data() {
			return {
				listLoading: false,
				addressList: [],
				listQuery: {
					id: this.id,
					page: 1,
					limit: 10
				}
			};
		},
		mounted() {
			this.getList();
		},
		methods: {
			getList() {
				try {
					this.listLoading = true;
					getUserWithdrawAccountList(this.listQuery).then(response => {
						this.addressList = response.data.data;
						this.total = response.data.total;
						this.listLoading = false;
					});
				} catch (e) {
					console.log(e);
				}
			},
			handleCreateWithdrawAccount() {
				this.temp = {
					id: undefined,
					user_id: this.id,
					type: 2,
					name: '',
					account: ''
				};
				console.log(this.temp);
				this.$dialog('添加账户', DialogWithdrawAccountEdit, { data: this.temp }, { width: '600px', inBody: true }).$on('success', result => {
					this.addressList.unshift(result);
				});
			},
			handleEdit(data) {
				this.$dialog('编辑账户', DialogWithdrawAccountEdit, { data }, { width: '600px', inBody: true }).$on('success', result => {
					console.log(result);
				});
			},
			handleDelete(row, index) {
				delUserUserWithdrawAccount(row.id).then(response => {
					row.status = 0;
					this.list.splice(index, 1, row);
				});
				this.$notify({
					title: 'Success',
					message: 'Delete Successfully',
					type: 'success',
					duration: 2000
				});
				// this.list.splice(index, 1);
			},
			handleReverseDelete(row, index) {
				restoreUserWithdrawAccount(row).then(response => {
					row.status = 1;
					this.list.splice(index, 1, row);
				});
				this.$notify({
					title: 'Success',
					message: 'Delete Successfully',
					type: 'success',
					duration: 2000
				});
				// this.list.splice(index, 1);
			}
		}
	};
</script>

<style scoped>

</style>
