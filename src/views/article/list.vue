<template>
	<div class="app-container">
		<el-card>
			<div class="filter-container">
				标题
				<el-input
						v-model="listQuery.title"
						placeholder="文章标题"
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

			<router-link to="./edit/">
				<el-button type="primary">新增文章</el-button>
			</router-link>

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
				<el-table-column label="标题" align="center">
					<template slot-scope="{row}">
						<span>{{ row.title }}</span>
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
				<el-table-column label="发布时间" align="center" width="160px">
					<template slot-scope="{row}">
						<span>{{ row.created_at }}</span>
					</template>
				</el-table-column>
				<el-table-column label="操作" align="center" width="280" class-name="small-padding fixed-width">
					<template slot-scope="{row,$index}">
						<router-link :to="{name: 'ArticleEdit', params:{'id': row.id}}">
							<el-button type="primary" size="mini">
								编辑
							</el-button>
						</router-link>
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
	import { getArticleList, delArticle, restoreArticle } from '@/api/article';
	import Pagination from '@/components/Pagination';
	import DialogForm from './components/dialogForm';
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
					getArticleList(this.listQuery).then(response => {
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
			handleDelete(row, index) {
				delArticle(row.id).then(response => {
					row.status = 0;
					this.list.splice(index, 1, row);
				});
				this.$notify({
					title: 'Success',
					message: 'Delete Successfully',
					type: 'success',
					duration: 2000
				});
			},
			handleReverseDelete(row, index) {
				restoreArticle(row).then(response => {
					row.status = 1;
					this.list.splice(index, 1, row);
				});
				this.$notify({
					title: 'Success',
					message: 'Delete Successfully',
					type: 'success',
					duration: 2000
				});
			}
		}
	};
</script>

<style lang="scss">

</style>
