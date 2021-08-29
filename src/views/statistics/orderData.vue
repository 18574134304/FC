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
			</div>
			<order-line-chart :chart-data="lineChartData" />
		</el-card>
	</div>
</template>

<script>
	import { getOrderData } from '@/api/statistics';
	import orderLineChart from './components/orderLineChart';

	export default {
		name: 'OrderData',
		components: {
			orderLineChart
		},
		data() {
			return {
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
				listQuery: {},
				lineChartData: {
					date: ['00', '01', '02', '03', '04', '05', '06', '07', '08', '09'],
					value: [0, 0, 0, 0, 0, 0, 0, 0, 0]
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
					getOrderData(this.listQuery).then(response => {
						this.lineChartData.date = response.data.date;
						this.lineChartData.value = response.data.value;
						this.listLoading = false;
					});
				} catch (e) {
					console.log(e);
				}
			},
			handleFilter() {
				this.listQuery.start_time = this.query_time[0];
				this.listQuery.end_time = this.query_time[1];
				this.getList();
			}
		}
	};
</script>

<style scoped>

</style>
