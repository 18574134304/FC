<template>
	<div class="app-container">
		<el-card>
			<el-button type="primary" @click="handleCreate">新增等级</el-button>
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
				<el-table-column label="名称" align="center">
					<template slot-scope="{row}">
						<span>{{ row.name }}</span>
					</template>
				</el-table-column>
				<el-table-column label="图标" align="center">
					<template slot-scope="{row}">
						<el-image :src="require('@/assets/'+row.icon)" fit="fill" />
					</template>
				</el-table-column>
				<el-table-column label="时间" align="center">
					<template slot-scope="{row}">
						<span>{{ row.created_at }}</span>
					</template>
				</el-table-column>
				<el-table-column label="操作" align="center" width="280" class-name="small-padding fixed-width">
					<template slot-scope="{row,$index}">
						<el-button type="primary" size="mini" @click="handleEdit(row)">
							编辑
						</el-button>
						<el-button type="danger" size="mini" @click="handleDelete(row,$index)">
							删除
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
	import { getUserLevelsList, delLevel } from '@/api/users';
	import Pagination from '@/components/Pagination';
	import DialogLevelForm from './components/dialogLevelForm';
	export default {
		name: 'UsersLevel',
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
				},
				temp: {
					id: undefined,
					name: '',
					icon_url: 'https://wpimg.wallstcn.com/577965b9-bb9e-4e02-9f0c-095b41417191',
					icon: ''
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
					getUserLevelsList(this.listQuery).then(response => {
						this.list = response.data.data;
						this.total = response.data.total;
						this.listLoading = false;
					});
				} catch (e) {
					console.log(e);
				}
			},
			handleCreate() {
				const temp = {
					id: undefined,
					name: '',
					icon_url: '',
					icon: ''
				};
				this.$dialog('新增等级', DialogLevelForm, temp).$on('success', result => {
					this.list.unshift(result);
				});
			},
			handleEdit(data) {
				this.$dialog('编辑等级', DialogLevelForm, { data }).$on('success', result => {
					console.log(result);
				});
			},
			handleDelete(row, index) {
				delLevel(row.id).then(response => {
					row.status = 0;
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
    .avatar {
        img {
            width: 100px;
            height: 100px;
            border-radius: 50%;
        }
    }
</style>
