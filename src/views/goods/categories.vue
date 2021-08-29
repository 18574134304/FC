<template>
	<div v-loading="data.loading" class="app-container goods-categories-container">
		<el-card>
			<el-button type="primary" @click="edit()">添加商品分类</el-button>
			<el-table
					ref="table"
					:data="data.list"
					row-key="id"
					stripe
					border
					lazy
					:load="load"
					:tree-props="{hasChildren: 'has_children_count'}"
					height="calc(100vh - 222px)"
				>
				<el-table-column prop="name" label="分类名称" />
				<el-table-column prop="icon_path" label="图标" align="center">
					<template slot-scope="scope">
						<l-img
								v-if="scope.row.icon_url"
								:src="scope.row.icon_url"
								style="width: 60px;height: 60px; margin-right: 10px;"
							/>
					</template>
				</el-table-column>
				<el-table-column prop="status" label="是否显示" width="80" align="center">
					<template slot-scope="scope">
						<span v-html="$options.filters.isShow(scope.row.status)" />
					</template>
				</el-table-column>
				<el-table-column prop="sort" label="排序" width="80" align="center" />
				<el-table-column prop="op" label="操作" width="180" align="center">
					<template slot-scope="scope">
						<el-link type="primary" :underline="false" @click="edit(scope.row.id)">编辑</el-link>
						<el-popconfirm
								confirm-button-text="好的"
								cancel-button-text="不用了"
								icon="el-icon-info"
								icon-color="red"
								title="确定删除吗？删除后不能恢复哦！"
								@onConfirm="handleConfirmRemove(scope.row)"
							>
							<el-link slot="reference" type="danger" :underline="false">删除</el-link>
						</el-popconfirm>
					</template>
				</el-table-column>
			</el-table>
		</el-card>
	</div>
</template>
<script>
	import { getCategoriesList, removeCategories } from '../../api/goods';
	import EditCategories from './edit-categories';

	export default {
		name: 'GoodsCategories',
		data() {
			return {
				formData: {
					parent_id: ''
				},
				data: {
					loading: false,
					list: []
				}
			};
		},
		computed: {
			param() {
				return { parent_id: this.formData.parent_id };
			}
		},
		mounted() {
			this.fetch();
		},
		methods: {
			async fetch() {
				this.data.loading = true;
				try {
					let response = await getCategoriesList(this.param);
					if (response.code === 0) {
						this.data.list = response.data;
					}
				} catch (e) {
					console.log(e);
				}
				this.data.loading = false;
			},
			async load(tree, treeNode, resolve) {
				this.formData.parent_id = tree.id;
				try {
					let response = await getCategoriesList(this.param);
					if (response.code === 0) {
						resolve(response.data);
					}
				} catch (e) {
					console.log(e);
				}
			},
			edit(id = 0) {
				this.$dialog(['添加', '修改'][+!!id] + '商品分类', EditCategories, { id })
					.$on('success', _ => {
						this.fetch();
					});
			},
			async handleConfirmRemove(data) {
				this.data.loading = true;
				try {
					let response = await removeCategories(data.id);
					if (response.code === 0) {
						this.$message.success('删除成功');

						const store = this.$refs.table.store;
						if (data.parent_id) {
							let parentRow = store.states.data.find(child => child.id === data.parent_id);
							if (!parentRow) {
								const keys = Object.keys(store.states.lazyTreeNodeMap);
								for (let i = 0; i < keys.length; i++) {
									parentRow = store.states.lazyTreeNodeMap[keys[i]].find(child => child.id === data.parent_id);
									if (parentRow) {
										break;
									}
								}
							}
							parentRow.childrenCount--;
							const parent = store.states.lazyTreeNodeMap[data.parent_id];
							const index = parent.findIndex(child => child.id === data.id);
							parent.splice(index, 1);
						} else {
							let list = this.$refs.table.store.states.data;
							list.splice(list.findIndex(child => child.id === data.id), 1);
						}

						// let parent = this.$refs.table.store.states.data;
						// parent.splice(parent.findIndex(child => child.id === data.id), 1);
					}
				} catch (e) {
					console.log(e);
				}
				this.data.loading = false;
			}
		}
	};
</script>

<style lang="scss" scoped>
	.goods-categories-container {
		.el-table {
			margin-top: 20px;

			.el-link {
				margin: 0 5px;
			}
		}
	}
</style>
