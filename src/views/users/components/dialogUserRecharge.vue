<template>
	<div class="app-container">
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
				>
				<template slot-scope="{row}">
					<span>{{ row.id }}</span>
				</template>
			</el-table-column>
			<el-table-column label="类型" width="110px" align="center">
				<template slot-scope="{row}">
					<span>{{ row.type }}</span>
				</template>
			</el-table-column>
			<el-table-column label="金额" align="center">
				<template slot-scope="{row}">
					<span>{{ row.amount }}</span>
				</template>
			</el-table-column>
			<el-table-column label="时间" align="center">
				<template slot-scope="{row}">
					<span>{{ row.created_at }}</span>
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
	</div>
</template>

<script>
	import { getUserRechargeList } from '@/api/users';
	import Pagination from '@/components/Pagination';
	export default {
		name: 'DialogUserRecharge',
		components: {
			Pagination
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
				list: [],
				total: 0,
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
					getUserRechargeList(this.listQuery).then(response => {
						this.list = response.data.data;
						this.total = response.data.total;
						this.listLoading = false;
					});
				} catch (e) {
					console.log(e);
				}
			}
		}
	};
</script>

<style scoped>

</style>
