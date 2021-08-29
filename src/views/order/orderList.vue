<template>
	<div class="app-container">
		<el-card>
			<div class="filter-container">
				订单号
				<el-input
						v-model="listQuery.trade_no"
						placeholder="订单号"
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

			<template>
				<el-tabs v-model="activeName" @tab-click="handleClick">
					<el-tab-pane label="全部" name="all" />
					<el-tab-pane :label="'未付款('+list_total[0]+')'" name="0" />
					<el-tab-pane :label="'已付款('+list_total[10]+')'" name="10" />
					<el-tab-pane :label="'待发货('+list_total[20]+')'" name="20" />
					<el-tab-pane :label="'已发货('+list_total[30]+')'" name="30" />
					<el-tab-pane :label="'已完成('+list_total[70]+')'" name="70" />
					<el-tab-pane :label="'已取消('+list_total[60]+')'" name="60" />
				</el-tabs>
			</template>
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
				<el-table-column label="订单" width="800">
					<template slot-scope="{row}">
						<div class="order-summary cs-mb-5">
							<i class="el-icon-monitor" />
							<span class="cs-mr">
								订单号：{{ row.trade_no }}
							</span>
							<span>
								创建日期：{{ row.created_at }}
							</span>
						</div>
						<div class="order-goods-list">
							<div class="goods-image">
								<!-- {{ row.order_info.goods_info.image[0] }} -->
								<img
										src="//aliyun.oss.careyshop.cn/uploads/files/20191230/97405ac5-3c64-4d48-b3da-238710c7272b.jpg"
										class="el-image__inner"
										style="object-fit: contain;"
									>
							</div>
							<div class="goods-info order-text">
								<p class="link">{{ row.order_info[0].goods_info.title }}</p>
								<p class="son">本店价：{{ row.order_info[0].price }} x {{ row.order_info[0].quantity }}</p>
							</div>
						</div>
					</template>
				</el-table-column>
				<el-table-column label="订单金额">
					<template slot-scope="{row}">
						<div class="order-text">
							<p class="shop-price">{{ row.total_amount }}</p>
							<p class="son">应付款：{{ row.total_amount }}</p>
							<p class="son">含运费：{{ row.post_charge }}</p>
							<el-button v-if="row.status==0" type="primary" size="mini" @click="handleUpdatePrice(row)">
								修改价格
							</el-button>
						</div>
					</template>
				</el-table-column>
				<el-table-column label="买家" align="center">
					<template slot-scope="{row}">
						<span>{{ row.user_info.username }}</span>
					</template>
				</el-table-column>
				<el-table-column label="订单来源" align="center">
					<template slot-scope="{row}">
						<span>{{ row.buy_user_info ? row.buy_user_info.nickname : '公司' }}</span>
					</template>
				</el-table-column>
				<el-table-column label="交易状态" class-name="status-col" width="100">
					<template slot-scope="{row, $index}">
						<div v-if="row.deleted_at">
							<el-tag type="danger">
								已删除
							</el-tag>
						</div>
						<div v-else>
							<el-tag v-if="row.status==0" :type="row.status | statusFilter">
								未付款
							</el-tag>
							<el-tag v-else-if="row.status==10" :type="row.status | statusFilter">
								已付款
							</el-tag>
							<el-tag v-else-if="row.status==20" :type="row.status | statusFilter">
								配货中
							</el-tag>
							<el-tag v-else-if="row.status==30" :type="row.status | statusFilter">
								已发货
							</el-tag>
							<el-tag v-else-if="row.status==40" :type="row.status | statusFilter">
								退款中
							</el-tag>
							<el-tag v-else-if="row.status==50" :type="row.status | statusFilter">
								已退款
							</el-tag>
							<el-tag v-else-if="row.status==60" :type="row.status | statusFilter">
								已取消
							</el-tag>
							<el-tag v-else-if="row.status==70" :type="row.status | statusFilter">
								已完成
							</el-tag>
						</div>
						<p>
							<a class="order-button el-link el-link--info" @click="handDetail(row)">
								<span>详情</span>
							</a>
						</p>
						<p v-if="row.status==10 || row.status==20 || row.status==30 || row.status==70 || row.status==100">
							<a class="order-button el-link el-link--info" style="color: red;" @click="handRefund(row, $index)">
								<span>退款</span>
							</a>
						</p>
					</template>
				</el-table-column>
				<!--				<el-table-column label="操作" align="center" width="200" class-name="small-padding fixed-width">-->
				<!--					<template slot-scope="{row,$index}">-->
				<!--						<el-button type="primary" size="mini">-->
				<!--							提单详情-->
				<!--						</el-button>-->
				<!--					</template>-->
				<!--				</el-table-column>-->
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
	import { getOrderList, RefundOrder } from '@/api/order';
	import Pagination from '@/components/Pagination';
	import DialogUpdatePrice from '@/views/order/components/dialogUpdatePrice';
	import DialogDetail from '@/views/order/components/dialogDetail';
	export default {
		name: 'OrderList',
		components: {
			Pagination
		},
		filters: {
			statusFilter(status) {
				const statusMap = {
					0: 'info',
					10: 'success',
					20: 'success',
					30: 'success',
					40: 'danger',
					50: 'info',
					60: 'info',
					70: 'success'
				};
				return statusMap[status];
			}
		},
		data() {
			return {
				listLoading: true,
				activeName: 'all',
				list: [],
				list_total: { 0: 0, 10: 0, 20: 0, 30: 0, 40: 0, 50: 0, 60: 0, 70: 0 },
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
					getOrderList(this.listQuery).then(response => {
						this.list = response.data.data;
						this.total = response.data.total;
						response.data.all_status.forEach((x) => {
							this.list_total[x.status] = x.total;
						});
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
			handleUpdatePrice(row) {
				this.$dialog('修改金额', DialogUpdatePrice, { data: row }, { width: '600px' }).$on('success', result => {
					console.log(result);
				});
			},
			handDetail(row) {
				this.$dialog('订单详情', DialogDetail, { data: row }, { width: '1100px' }).$on('success', result => {
					console.log(result);
				});
			},
			handRefund(row, index) {
				this.$confirm('确定要给此订单退款吗?', '提示', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					type: 'warning'
				}).then(() => {
					RefundOrder({ id: row.id }).then(res => {
						this.$notify({
							title: 'Success',
							message: 'Update Successfully',
							type: 'success',
							duration: 2000
						});
						row.status = 50;
						this.list.splice(index, 1, row);
					});
				}).catch(() => {});
			},
			handleClick(tab, event) {
				this.listQuery.status = tab.name;
				this.getList();
			}
		}
	};
</script>

<style lang="scss" scoped>
    .cs-mb-5 {
        margin-bottom: 5px!important;
    }
    .order-summary {
        color: #c0c4cc;
        font-size: 13px;
        .cs-mr {
            margin-right: 20px!important;
        }
    }
    .order-goods-list {
        float: left;
        .goods-image {
            float: left;
            width: 80px;
            height: 80px;
        }
        .goods-info {
            padding: 0 50px 0 100px;
            min-width: 405px;
            .link:hover {
                cursor: pointer;
                color: #409eff;
                text-decoration: underline;
            }
        }
    }
    .order-text {
        p {
            margin: 0;
        }
        .son {
            color: #909399;
            font-size: 13px;
        }
    }
    .shop-price {
        color: #f56c6c;
    }
</style>
