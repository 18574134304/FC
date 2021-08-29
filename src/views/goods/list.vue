<template>
	<div class="app-container goods-list-container">
		<el-card style="height:calc(100vh - 124px)">
			<el-form ref="form" :model="formData" :inline="true">
				<el-form-item label="商品名称" prop="title">
					<el-input v-model="formData.title" />
				</el-form-item>
				<el-form-item prop="btn">
					<el-button type="primary" @click="submitForm()">查询</el-button>
					<el-button @click="resetForm()">重置</el-button>
					<!--<el-button type="primary" @click="to({ name: 'AddGoods' })">添加商品</el-button>-->
				</el-form-item>
			</el-form>
			<el-table
					v-loading="loading"
					:data="list"
					stripe
					border
					height="calc(100vh - 350px)"
				>
				<el-table-column prop="id" label="ID" align="center" />
				<el-table-column prop="title, image" label="产品信息">
					<template slot-scope="scope">
						<div style="display: flex; justify-content: flex-start; align-items: center; align-content: center;">
							<el-tooltip class="item" effect="dark" content="点击查看大图" placement="top">
								<l-img
										v-if="scope.row.image.length"
										:src="scope.row.images_list[0]"
										:preview-src-list="scope.row.images_list"
										style="width: 60px;height: 60px; margin-right: 10px;"
									/>
							</el-tooltip>
							{{ scope.row.title }}
						</div>
					</template>
				</el-table-column>
				<el-table-column prop="category_info" label="分类">
					<template slot-scope="scope">
						<span v-for="(item, index) in scope.row.category_info" :key="index">{{ item.name }} <em v-if="index < scope.row.category_info.length - 1"> / </em> </span>
					</template>
				</el-table-column>
				<el-table-column label="价格" align="center">
					<el-table-column prop="post_charge" label="配送费" align="center" />
					<el-table-column prop="base_price" label="成本" align="center" />
					<el-table-column prop="market_price" label="市场价" align="center" />
					<el-table-column prop="sale_price" label="销售价" align="center" />
					<el-table-column prop="group_buy_price" label="团购价" align="center">
						<template slot-scope="scope">
							<div v-if="scope.row.is_group_buy === 1">{{ scope.row.group_buy_price }}</div>
							<div v-else style="color: #909399;">未参与拼团</div>
						</template>
					</el-table-column>
				</el-table-column>
				<el-table-column prop="stock" label="库存" width="80" align="center" />
				<el-table-column prop="created_at" label="创建时间" width="180" align="center" />
				<el-table-column prop="status" label="状态" width="100" align="center">
					<template slot-scope="{row}">
						<el-tag :type="row.status | statusFilter('type')">
							{{ row.status | statusFilter('name') }}
						</el-tag>
					</template>
				</el-table-column>
				<el-table-column prop="op" label="操作" width="180" align="center">
					<template slot-scope="scope">
						<el-link type="primary" :underline="false" @click="to({ name: 'EditGoods', query: { id: scope.row.id }})">编辑</el-link>
						<!--<el-popconfirm
								confirm-button-text="好的"
								cancel-button-text="不用了"
								icon="el-icon-info"
								icon-color="red"
								title="确定删除吗？删除后不能恢复哦！"
								@onConfirm="handleConfirmRemove(scope.row.id)"
							>
							<el-link slot="reference" type="danger" :underline="false">下架</el-link>
						</el-popconfirm>-->
					</template>
				</el-table-column>
			</el-table>
			<pagination
					v-show="total > 0"
					:total="total"
					:page.sync="formData.page"
					:limit.sync="formData.pageSize"
					:page-sizes="[15, 30, 50]"
					@pagination="fetch"
				/>
		</el-card>
	</div>
</template>

<script>
	import { editGoods, getGoodsList } from '../../api/goods';
	import Pagination from '../../components/Pagination';

	export default {
		name: 'GoodsList',
		components: { Pagination },
		filters: {
			statusFilter(status, filter) {
				const statusMap = [
					{ type: 'danger', name: '已下架' },
					{ type: 'success', name: '已上架' },
					{ type: 'info', name: '已隐藏' }
				];
				return statusMap[status][filter];
			}
		},
		data() {
			return {
				list: [],
				loading: false,
				total: 0,
				formData: {
					title: '',
					pageSize: 15,
					page: 1
				}
			};
		},
		mounted() {
			this.fetch();
		},
		methods: {
			async fetch() {
				this.loading = true;
				try {
					let response = await getGoodsList(this.formData);
					if (response.code === 0) {
						this.list = response.data.data;
						this.total = response.data.total;
					}
				} catch (e) {
					console.log(e);
				}
				this.loading = false;
			},
			async handleUpdateStatus(data) {
				try {
					await editGoods(data);
				} catch (e) {
					console.log(e);
				}
			},
			resetForm(formName = 'form') {
				this.$refs[formName].resetFields();
			},
			submitForm(formName = 'form') {
				this.$refs[formName].validate((valid) => {
					if (valid) {
						this.edit();
					} else {
						console.log('error submit!!');
						return false;
					}
				});
			},
			to(data) {
				this.$store.dispatch('tagsView/delView', this.$route);
				this.$router.push(data);
			}
		}
	};
</script>

<style lang="scss" scoped>
	.goods-list-container {
		.el-table {
			.el-link {
				margin: 0 5px;
			}
		}
	}
</style>
