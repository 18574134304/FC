<template>
	<div class="app-container">
		<el-card>
			<div class="filter-container">
				店铺
				<el-input
						v-model="listQuery.shop_name"
						placeholder="店铺名称"
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

			<!--			<el-button type="primary" @click="handleCreateShop">新增商铺</el-button>-->
			<el-table
					v-loading="listLoading"
					:data="list"
					fit
					highlight-current-rowstyle="width: 100%;"
				>
				<el-table-column
						label="店铺ID"
						prop="id"
						align="center"
						width="80"
					/>
				<el-table-column label="商户ID" align="center">
					<template slot-scope="{row}">
						<span>{{ row.merchant_info.id }}</span>
					</template>
				</el-table-column>
				<el-table-column label="商户手机号" align="center">
					<template slot-scope="{row}">
						<span>{{ row.merchant_info.phone_number }}</span>
					</template>
				</el-table-column>
				<el-table-column label="店铺名称" align="center">
					<template slot-scope="{row}">
						<span>{{ row.shop_name }}</span>
					</template>
				</el-table-column>
				<el-table-column label="店铺LOGO" align="center">
					<template slot-scope="{row}">
						<l-img :src="row.logo_url" style="width: 60px;height: 60px;" />
					</template>
				</el-table-column>
				<el-table-column label="主营业务" align="center">
					<template slot-scope="{row}">
						<span>{{ row.business }}</span>
					</template>
				</el-table-column>
				<el-table-column label="服务费" align="center">
					<template slot-scope="{row}">
						<span class="son" style="display: block;">{{ row.profit }}</span>
						<el-button type="primary" size="mini" @click="handleUpdateProfit(row)">
							修改比例
						</el-button>
					</template>
				</el-table-column>
				<el-table-column label="店铺类型" align="center">
					<template slot-scope="{row}">
						<el-tag :type="row.type | typeFilter('filter')">
							{{ row.type | typeFilter('name') }}
						</el-tag>
					</template>
				</el-table-column>
				<el-table-column label="注册时间" align="center" width="160">
					<template slot-scope="{row}">
						<span>{{ row.created_at }}</span>
					</template>
				</el-table-column>
				<el-table-column label="店铺状态" class-name="status-col" width="100">
					<template slot-scope="{row}">
						<el-switch
								v-model="row.status"
								class="shop_status_switch"
								:active-value="1"
								:inactive-value="0"
								active-color="#13ce66"
								inactive-color="#ff4949"
								active-text="正常"
								inactive-text="关闭"
								@change="statusSwitch(row)"
							/>
						<!--						<el-tag v-if="row.status==0" type="danger">-->
						<!--							禁用-->
						<!--						</el-tag>-->
						<!--						<el-tag v-else-if="row.status==1" type="success">-->
						<!--							正常-->
						<!--						</el-tag>-->
					</template>
				</el-table-column>
				<el-table-column label="认证状态" class-name="status-col" width="100">
					<template slot-scope="{row}">
						<el-tag v-if="row.is_perfect==1" type="info">
							未认证
						</el-tag>
						<el-tag v-else-if="row.is_perfect==2" type="warning">
							待审核
						</el-tag>
						<el-tag v-else-if="row.is_perfect==3" type="success">
							已认证
						</el-tag>
					</template>
				</el-table-column>
				<el-table-column label="操作" align="center" width="280" class-name="small-padding fixed-width">
					<template slot-scope="{row,$index}">
						<el-button type="primary" size="mini" @click="handleEdit(row)">
							编辑
						</el-button>
						<el-dropdown @command="handleMore">
							<el-button type="draft" size="small" style="margin-left: 10px">
								更多操作
								<i class="el-icon-arrow-down el-icon--right" />
							</el-button>
							<el-dropdown-menu slot="dropdown">
								<el-dropdown-item :command="beforeHandleMore('certification', row)">认证资料</el-dropdown-item>
								<el-dropdown-item :command="beforeHandleMore('shopInfo', row)">店铺信息</el-dropdown-item>
							</el-dropdown-menu>
						</el-dropdown>
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
	import { getShopList, updateShop, delShop, restoreShop } from '@/api/shop';
	import Pagination from '@/components/Pagination';
	import DialogShopForm from './components/dialogShopForm';
	import DialogCertification from './components/dialogCertification';
	import DialogShopDetail from './components/dialogShopDetail';
	import DialogUpdateProfit from './components/dialogUpdateProfit';
	import DialogUpdatePrice from '@/views/order/components/dialogUpdatePrice';
	export default {
		name: 'ShopList',
		components: {
			Pagination
		},
		filters: {
			typeFilter(type, filter) {
				const statusMap = [
					{ type: 'info', name: '自营' },
					{ type: 'info', name: '线上' },
					{ type: 'info', name: '联盟' },
					{ type: 'info', name: '加盟' }
				];
				return statusMap[type - 1][filter];
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
					logo_url: 'https://wpimg.wallstcn.com/577965b9-bb9e-4e02-9f0c-095b41417191',
					logo: '',
					shop_name: '',
					business: '',
					province_code: '',
					city_code: '',
					county_code: '',
					address: '',
					tel_number: ''
				},
				rules: {
					type: [{ required: true, message: 'type is required', trigger: 'change' }],
					timestamp: [{ type: 'date', required: true, message: 'timestamp is required', trigger: 'change' }],
					title: [{ required: true, message: 'title is required', trigger: 'blur' }]
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
					getShopList(this.listQuery).then(response => {
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
			statusSwitch(row) {
				let status = row.status == 1 ? 1 : 0;
				console.log(status);
				const temp = {
					id: row.id,
					status: status
				};
				updateShop(temp).then(response => {
					row.status = status;
					this.$notify({
						title: 'Success',
						message: 'Delete Successfully',
						type: 'success',
						duration: 2000
					});
				});
			},
			handleUpdateProfit(data) {
				this.$dialog('修改服务费比例', DialogUpdateProfit, { data: data }, { width: '600px' }).$on('success', result => {
					console.log(result);
				});
			},
			handleCreateShop() {
				this.$dialog('新增商铺', DialogShopForm, { data: this.temp }, { width: '600px' }).$on('success', result => {
					this.list.unshift(result);
				});
			},
			handleEdit(data) {
				this.$dialog('编辑商铺', DialogShopForm, { data }, { width: '600px' }).$on('success', result => {
					console.log(result);
				});
			},
			handleDelete(row, index) {
				delShop(row.id).then(response => {
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
				restoreShop(row).then(response => {
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
			},
			handleMore(res) {
				const id = res.row.id;
				if (res.command == 'certification') {
					this.$dialog('认证信息', DialogCertification, { data: res.row }, { width: '550px' })
						.$on('success', result => {

						});
				} else if (res.command == 'shopInfo') {
					this.$dialog('店铺信息', DialogShopDetail, { id })
						.$on('success', result => {

						});
				} else if (res.command == 'flow') {
					console.log(1);
					// this.$dialog('资金流水', DialogShopRecharge, { id })
					// 	.$on('success', result => {
					//
					// 	});
				}
			},
			beforeHandleMore(command, row) {
				return {
					'command': command,
					'row': row
				};
			}
		}
	};
</script>

<style lang="scss">
    .shop_status_switch {
        .el-switch__label {
            position: absolute;
            display: none;
            color: #fff;
        }
        /*打开时文字位置设置*/
        .el-switch__label--right {
            z-index: 1;
            right: 19px;
        }
        /*关闭时文字位置设置*/
        .el-switch__label--left {
            z-index: 1;
            left: 19px;
        }
        /*显示文字*/
        .el-switch__label.is-active {
            display: block;
        }
        &.el-switch .el-switch__core, .el-switch .el-switch__label {
            width: 57px !important;
        }
    }
</style>
