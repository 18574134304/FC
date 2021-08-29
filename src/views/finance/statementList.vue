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
				<el-table-column label="来源订单号" align="center" width="200">
					<template slot-scope="{row}">
						<span>{{ row.trade_no }}</span>
					</template>
				</el-table-column>
				<el-table-column label="UID/用户名/昵称" align="center" width="200">
					<template slot-scope="{row}">
						<span>{{ row.user_info.id }} / {{ row.user_info.username }} / {{ row.user_info.nickname }}</span>
					</template>
				</el-table-column>
				<el-table-column label="收支金额" align="center">
					<template slot-scope="{row}">
						<el-tag v-if="row.amount > 0" type="success">+{{ row.amount }}</el-tag>
						<el-tag v-if="row.amount < 0" type="danger">{{ row.amount }}</el-tag>
					</template>
				</el-table-column>
				<el-table-column label="余额" align="center">
					<template slot-scope="{row}">
						<span>{{ row.balance }}</span>
					</template>
				</el-table-column>
				<el-table-column label="收支类型" align="center">
					<template slot-scope="{row}">
						<el-tag type="info">
							{{ row.type_name }}
						</el-tag>
					</template>
				</el-table-column>
				<el-table-column label="备注" align="center">
					<template slot-scope="{row}">
						<el-tag type="info">
							{{ row.remake }}
						</el-tag>
					</template>
				</el-table-column>
				<el-table-column label="创建时间" align="center" width="180px">
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
		</el-card>

	</div>
</template>

<script>
	import { getStatementList } from '@/api/finance';
	import Pagination from '@/components/Pagination';
	export default {
		name: 'StatementList',
		components: {
			Pagination
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
					getStatementList(this.listQuery).then(response => {
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

<style lang="scss">

</style>
