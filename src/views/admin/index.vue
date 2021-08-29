<template>
	<div class="app-container">
		<el-card>
			<div class="filter-container">
				用户名
				<el-input
						v-model="listQuery.username"
						placeholder="用户名"
						style="width: 200px;"
						class="filter-item"
						@keyup.enter.native="handleFilter"
					/>
				昵称
				<el-input
						v-model="listQuery.nickname"
						placeholder="昵称"
						style="width: 200px;"
						class="filter-item"
						@keyup.enter.native="handleFilter"
					/>
				<el-button
						class="filter-item"
						type="primary"
						icon="el-icon-search"
						style="margin-left: 10px;"
						@click="handleFilter"
					>
					搜索
				</el-button>
			</div>

			<el-button type="primary" @click="handleCreateUser">新增管理员</el-button>

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
				<el-table-column label="用户名" align="center">
					<template slot-scope="{row}">
						<span>{{ row.username }}</span>
					</template>
				</el-table-column>
				<el-table-column label="昵称" align="center">
					<template slot-scope="{row}">
						<span>{{ row.nickname }}</span>
					</template>
				</el-table-column>
				<el-table-column label="注册时间" align="center" width="160px">
					<template slot-scope="{row}">
						<span>{{ row.created_at }}</span>
					</template>
				</el-table-column>
				<el-table-column label="状态" class-name="status-col" width="100">
					<template slot-scope="{row}">
						<el-tag v-if="row.status==0" :type="row.status | statusFilter">
							禁用
						</el-tag>
						<el-tag v-else-if="row.status==1" :type="row.status | statusFilter">
							正常
						</el-tag>
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
	import { getAdminList, delAdmin, restoreAdmin } from '@/api/admin';
	import Pagination from '@/components/Pagination';
	import DialogAdminForm from './components/dialogAdminForm';
	export default {
		name: 'List',
		components: {
			Pagination
		},
		filters: {
			statusFilter(status) {
				const statusMap = {
					0: 'danger',
					1: 'success',
					2: 'info'
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
				},
				temp: {
					id: undefined,
					username: '',
					password: '',
					nickname: ''
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
					getAdminList(this.listQuery).then(response => {
						this.list = response.data.data;
						this.total = response.data.total;
						this.listLoading = false;
					});
				} catch (e) {
					console.log(e);
				}
			},
			handleFilter() {
				this.listQuery.page = 1;
				this.getList();
			},
			handleCreateUser() {
				this.temp = {
					id: undefined,
					username: '',
					password: '',
					nickname: ''
				};
				this.$dialog('新增管理员', DialogAdminForm, this.temp, { width: '600px' }).$on('success', result => {
					this.list.unshift(result);
				});
			},
			handleEdit(data) {
				this.$dialog('编辑管理员', DialogAdminForm, { data }, { width: '600px' }).$on('success', result => {
					console.log(result);
				});
			},
			handleDelete(row, index) {
				delAdmin(row.id).then(response => {
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
				restoreAdmin(row).then(response => {
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

<style lang="scss">
.avatar {
    img {
        width: 100px;
        height: 100px;
        border-radius: 50%;
    }
}
</style>
