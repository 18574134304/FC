<template>
	<div class="app-container">
		<el-table
				v-loading="listLoading"
				:data="list"
				fit
				highlight-current-rowstyle="width: 100%;"
			>
			<el-table-column
					label="UID"
					prop="user_info.id"
					align="center"
					width="80"
				/>
			<el-table-column label="用户名" align="center">
				<template slot-scope="{row}">
					<span :style="{color: row.winner ? 'red' : ''}">{{ row.user_info.nickname }}</span>
				</template>
			</el-table-column>
			<el-table-column label="时间" align="center">
				<template slot-scope="{row}">
					<span>{{ row.created_at }}</span>
				</template>
			</el-table-column>
		</el-table>
	</div>
</template>

<script>
	import { getGroupMemberList } from '@/api/group';
	export default {
		name: 'DialogGroupMemberList',
		props: {
			data: {
				type: Object,
				default() {
					return {};
				}
			}
		},
		data() {
			return {
				listLoading: true,
				list: []
			};
		},
		mounted() {
			this.init();
		},
		methods: {
			init() {
				getGroupMemberList(this.data.id).then(response => {
					this.list = response.data;
					this.listLoading = false;
				});
			}
		}
	};
</script>

<style scoped>

</style>
