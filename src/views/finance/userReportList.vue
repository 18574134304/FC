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
						<span>{{ row.id }} / {{ row.username }} / {{ row.nickname }}</span>
					</template>
				</el-table-column>
				<el-table-column label="推荐奖金" align="center" width="280">
					<template slot-scope="{row}">
						<span>{{ row.recommend }}</span>
					</template>
				</el-table-column>
				<el-table-column label="级差奖金" align="center">
					<template slot-scope="{row}">
						<span>{{ row.difference }}</span>
					</template>
				</el-table-column>
				<el-table-column label="活跃值奖金" align="center" width="160">
					<template slot-scope="{row}">
						<span>{{ row.active_value }}</span>
					</template>
				</el-table-column>
			</el-table>
		</el-card>
	</div>
</template>

<script>
	import { getUserReport, downloadReport } from '@/api/finance';
	export default {
		name: 'UserReportList',
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
				listQuery: {
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
				getUserReport(this.listQuery).then(response => {
					this.list = response.data;
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
					this.listQuery.type = '用户报表';
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
