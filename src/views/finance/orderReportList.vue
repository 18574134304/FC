<template>
	<div class="app-container">
		<el-card>
			<div class="filter-container">
				<el-date-picker
						v-model="query_time"
						type="daterange"
						align="right"
						unlink-panels
						range-separator="至"
						start-placeholder="开始日期"
						end-placeholder="结束日期"
						value-format="yyyy-MM-dd"
						:picker-options="pickerOptions"
					/>
				<el-button
						class="filter-item"
						type="primary"
						icon="el-icon-search"
						style="margin: 1px 0 0 10px;"
						size="small"
						@click="handleFilter"
					>
					查询
				</el-button>
				<el-button
						class="filter-item"
						type="primary"
						icon="el-icon-download"
						style="margin: 1px 0 0 10px;"
						size="small"
						@click="downloadReport"
					>
					下载报表
				</el-button>
			</div>

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
				<el-table-column label="UID/用户名/昵称" align="center" width="280">
					<template slot-scope="{row}">
						<span>{{ row.user_info.id }} / {{ row.user_info.username }} / {{ row.user_info.nickname }}</span>
					</template>
				</el-table-column>
				<el-table-column label="类型" align="center" width="100">
					<template slot-scope="{row}">
						<span v-if="row.group_id">抢购</span>
						<span v-else>正常</span>
					</template>
				</el-table-column>
				<el-table-column label="单号" align="center" width="280">
					<template slot-scope="{row}">
						<span>{{ row.trade_no }}</span>
					</template>
				</el-table-column>
				<el-table-column label="产品" align="center">
					<template slot-scope="{row}">
						<span>{{ row.order_info[0].goods_info.title }}</span>
					</template>
				</el-table-column>
				<el-table-column label="金额" align="center" width="100">
					<template slot-scope="{row}">
						<span>{{ row.amount }}</span>
					</template>
				</el-table-column>
				<el-table-column label="PV" align="center" width="100">
					<template slot-scope="{row}">
						<span>{{ row.order_info[0].goods_info.pv }}</span>
					</template>
				</el-table-column>
				<el-table-column label="支付时间" align="center" width="160">
					<template slot-scope="{row}">
						<span>{{ row.payment_time }}</span>
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
	import { getOrderReport, downloadReport } from '@/api/finance';
	import Pagination from '@/components/Pagination';
	export default {
		name: 'OrderReportList',
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
				pickerOptions: {
					shortcuts: [{
						text: '最近一周',
						onClick(picker) {
							const end = new Date();
							const start = new Date();
							start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
							picker.$emit('pick', [start, end]);
						}
					}, {
						text: '最近一个月',
						onClick(picker) {
							const end = new Date();
							const start = new Date();
							start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
							picker.$emit('pick', [start, end]);
						}
					}, {
						text: '最近三个月',
						onClick(picker) {
							const end = new Date();
							const start = new Date();
							start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
							picker.$emit('pick', [start, end]);
						}
					}]
				},
				query_time: '',
				list: [],
				total: 0,
				listQuery: {
					page: 1,
					limit: 10,
					start_time: '',
					end_time: ''
				}
			};
		},
		mounted() {
			this.getList();
		},
		methods: {
			getList() {
				this.listLoading = true;
				getOrderReport(this.listQuery).then(response => {
					this.list = response.data.data;
					this.total = response.data.total;
					this.listLoading = false;
				});
			},
			handleFilter() {
				if (this.query_time) {
					this.listQuery.start_time = this.query_time[0];
					this.listQuery.end_time = this.query_time[1];
				} else {
					this.listQuery.start_time = '';
					this.listQuery.end_time = '';
				}
				this.getList();
			},
			downloadReport() {
				if (this.query_time) {
					this.listQuery.type = '订单报表';
					this.listQuery.start_time = this.query_time[0];
					this.listQuery.end_time = this.query_time[1];
					downloadReport(this.listQuery).then(response => {
						const aTag = document.createElement('a');
						aTag.href = response.data.downloadUrl;
						aTag.click();
					});
				} else {
					this.$alert('请选择时间范围', '提示', {
						confirmButtonText: '确定'
					});
				}
			}
		}
	};
</script>

<style scoped>

</style>
