<template>
	<div class="app-container">
		<el-card>
			<el-table
					v-loading="listLoading"
					:data="list"
					fit
					highlight-current-rowstyle="width: 100%;"
				>
				<el-table-column
						label="ID"
						prop="id"
						align="center"
						width="80"
					/>
				<el-table-column label="UID/用户名/昵称" align="center" width="200">
					<template slot-scope="{row}">
						<span>{{ row.user_info.id }} / {{ row.user_info.username }} / {{ row.user_info.nickname }}</span>
					</template>
				</el-table-column>
				<el-table-column label="订单号" align="center" width="200">
					<template slot-scope="{row}">
						<span>{{ row.trade_no }}</span>
					</template>
				</el-table-column>
				<el-table-column label="提现类型" align="center" width="200">
					<template slot-scope="{row}">
						<el-tag v-if="row.amount_origin==1" type="info">
							余额
						</el-tag>
						<el-tag v-else-if="row.amount_origin==2" type="info">
							金花
						</el-tag>
					</template>
				</el-table-column>
				<el-table-column label="提现金额" align="center">
					<template slot-scope="{row}">
						<span>{{ row.amount }}</span>
					</template>
				</el-table-column>
				<el-table-column label="手续费" align="center">
					<template slot-scope="{row}">
						<span>{{ row.charge }}</span>
					</template>
				</el-table-column>
				<el-table-column label="合计金额" align="center">
					<template slot-scope="{row}">
						<span>{{ row.payment }}</span>
					</template>
				</el-table-column>
				<el-table-column label="状态" class-name="status-col" width="100">
					<template slot-scope="{row}">
						<el-tag v-if="row.status==0" :type="row.status | statusFilter">
							待处理
						</el-tag>
						<el-tag v-else-if="row.status==1" :type="row.status | statusFilter">
							处理中
						</el-tag>
						<el-tag v-else-if="row.status==2" :type="row.status | statusFilter">
							已完成
						</el-tag>
						<el-tag v-else-if="row.status==3" :type="row.status | statusFilter">
							已失败
						</el-tag>
						<el-tag v-else-if="row.status==4" :type="row.status | statusFilter">
							已取消
						</el-tag>
						<el-tag v-else-if="row.status==5" :type="row.status | statusFilter">
							已拒绝
						</el-tag>
					</template>
				</el-table-column>
				<el-table-column label="创建时间" align="center" width="200">
					<template slot-scope="{row}">
						<span>{{ row.created_at }}</span>
					</template>
				</el-table-column>
				<el-table-column label="操作" align="center" width="200" class-name="small-padding fixed-width">
					<template slot-scope="{row,$index}">
						<el-button type="primary" size="mini" @click="handleEdit(row)">
							提单详情
						</el-button>
					</template>
				</el-table-column>
			</el-table>

			<pagination
					v-show="total>0"
					:total="total"
					:page.sync="listQuery.page"
					:limit.sync="listQuery.limit"
					@pagination="getList"
				/>
		</el-card>
	</div>
</template>

<script>
	import { getWithdrawList } from '@/api/finance';
	import Pagination from '@/components/Pagination';
	import DialogwithdrawForm from './components/dialogwithdrawForm';
	export default {
		name: 'WithdrawList',
		components: {
			Pagination
		},
		filters: {
			statusFilter(status) {
				const statusMap = {
					0: 'info',
					1: '',
					2: 'success',
					3: 'warning',
					4: 'warning',
					5: 'danger'
				};
				return statusMap[status];
			}
		},
		data() {
			return {
				listLoading: true,
				list: [],
				total: 0,
				listQuery: {
					page: 1,
					limit: 10
				}
			};
		},
		created() {

		},
		mounted() {
			this.getList();
		},
		methods: {
			getList() {
				try {
					this.listLoading = true;
					getWithdrawList(this.listQuery).then(response => {
						this.list = response.data.data;
						this.total = response.data.total;
						this.listLoading = false;
					});
				} catch (e) {
					console.log(e);
				}
			},
			handleEdit(data) {
				this.$dialog('提单详情', DialogwithdrawForm, { data }, { width: '600px' }).$on('success', result => {
					console.log(result);
				});
			}
		}
	};
</script>

<style lang="scss">
    .avatar {
        img {
            width: 100px;
            height: 100px;
            border-radius: 50%;
        }
    }
</style>
