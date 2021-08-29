<template>
	<div class="app-container group-list-container">
		<el-card style="height:calc(100vh - 124px)">
			<el-button type="primary" @click="handleAdd">发起拼团</el-button>

			<div style="float: right;">
				当前排队长度: {{ autoSnapLength }} 位
			</div>

			<template>
				<el-tabs v-model="activeName" @tab-click="handleClick">
					<el-tab-pane label="全部" name="all" />
					<el-tab-pane label="茯茶类型" name="0" />
					<el-tab-pane label="消费类型" name="1" />
				</el-tabs>
			</template>

			<el-table
					v-loading="listLoading"
					:data="list"
					stripe
					border
					:header-cell-style="{'text-align':'center'}"
					:cell-style="{'text-align':'center'}"
					height="calc(100vh - 350px)"
					style="margin-top: 10px;"
				>
				<el-table-column prop="id" label="ID" width="80" />
				<el-table-column label="类型" width="100">
					<template slot-scope="{row}">
						<el-tag v-if="row.type==0" type="info">
							茯茶类型
						</el-tag>
						<el-tag v-else-if="row.type==1" type="info">
							消费类型
						</el-tag>
					</template>
				</el-table-column>
				<el-table-column prop="created_at" label="发起时间" width="160" />
				<el-table-column prop="expire_time" label="截止时间" width="160" />
				<el-table-column prop="user_id" label="发起人">
					<template slot-scope="scope">
						<span v-if="scope.row.user_info">{{ scope.row.user_info.nickname }}</span>
						<span v-if="!scope.row.user_info">平台</span>
					</template>
				</el-table-column>
				<el-table-column prop="goods_id" label="商品信息">
					<template slot-scope="scope">
						<div style="display: flex; justify-content: flex-start; align-items: center; align-content: center;">
							<el-tooltip class="item" effect="dark" content="点击查看大图" placement="top">
								<l-img
										v-if="scope.row.goods_info.image.length"
										:src="scope.row.goods_info.images_list[0]"
										:preview-src-list="scope.row.goods_info.images_list"
										style="width: 60px;height: 60px; margin-right: 10px;"
									/>
							</el-tooltip>
							{{ scope.row.goods_info.title }}
						</div>
					</template>
				</el-table-column>
				<el-table-column prop="goods_price" label="拼团价格" />
				<el-table-column prop="complete" label="成团人数" />
				<el-table-column prop="quantity" label="入团人数" />
				<el-table-column v-if="listQuery.type!=1" label="是否为主团" class-name="status-col" width="100">
					<template v-if="row.type==0 && row.user_id == 0" slot-scope="{row}">
						<el-switch
								v-model="row.master"
								class="shop_status_switch"
								:active-value="1"
								:inactive-value="0"
								active-color="#13ce66"
								inactive-color="#ff4949"
								active-text="是"
								inactive-text="否"
								@change="masterSwitch(row)"
							/>
					</template>
				</el-table-column>
				<el-table-column label="状态" class-name="status-col" width="100">
					<template slot-scope="{row}">
						<el-tag v-if="row.status==0" type="success">
							进行中
						</el-tag>
						<el-tag v-else-if="row.status==1" type="info">
							成功
						</el-tag>
						<el-tag v-else-if="row.status==2" type="info">
							失败
						</el-tag>
						</el-tag>
						<el-tag v-else-if="row.status==3" type="info">
							解散
						</el-tag>
					</template>
				</el-table-column>
				<el-table-column label="操作" width="270">
					<template slot-scope="{row}">
						<el-button v-if="row.status==0" type="danger" size="small" @click="dissolution(row)">
							解散
						</el-button>
						<el-button type="primary" size="small" @click="handleEdit(row)">
							编辑
						</el-button>
						<el-button type="primary" size="small" @click="group_member_list(row)">
							参团人员
						</el-button>
					</template>
				</el-table-column>
			</el-table>
			<pagination
					v-show="total > 0"
					:total="total"
					:page.sync="listQuery.page"
					:limit.sync="listQuery.limit"
					@pagination="getList"
				/>
		</el-card>
	</div>
</template>

<script>

	import { getGroupList, setMaster, autoSnapListLength, dissolutionGroup } from '../../api/group';
	import Pagination from '../../components/Pagination/index';
	import GroupEdit from './groupEdit';
	import DialogGroupMemberList from './components/dialogGroupMemberList';
	import dialogMustWinnerEdit from './components/dialogMustWinnerEdit';

	export default {
		name: 'GroupList',
		components: { Pagination },
		data() {
			return {
				list: [],
				listLoading: true,
				activeName: 'all',
				total: 0,
				autoSnapLength: 0,
				listQuery: {
					page: 1,
					limit: 10
				}
			};
		},
		mounted() {
			// this.timer = setInterval(this.getAutoSnapLength, 5000);
			this.getList();
			this.getAutoSnapLength();
		},
		methods: {
			getList() {
				this.listLoading = true;
				getGroupList(this.listQuery).then(response => {
					this.list = response.data.data;
					this.total = response.data.total;
				});
				this.listLoading = false;
			},
			handleClick(tab, event) {
				this.listQuery.type = tab.name;
				this.getList();
			},
			getAutoSnapLength() {
				autoSnapListLength().then(response => {
					this.autoSnapLength = response.data;
				});
			},
			handleAdd() {
				this.$dialog('发起拼团', GroupEdit, {}).$on('success', _ => {
					this.$notify({
						title: 'Success',
						message: 'Update Successfully',
						type: 'success',
						duration: 2000
					});
					this.getList();
				});
			},
			dissolution(row) {
				this.$confirm('解散团 资金会退回给用户，确定解散吗?', '提示', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					type: 'warning'
				}).then(() => {
					dissolutionGroup(row).then(response => {
						this.$notify({
							title: 'Success',
							message: 'Successfully',
							type: 'success',
							duration: 2000
						});
					});
				});
			},
			handleEdit(row) {
				this.$dialog('编辑必中人员', dialogMustWinnerEdit,
					{ formData: { id: row.id, must_winner_list: row.must_winner_list }},
					{ width: '500px' }
				).$on('success', _ => {
					this.$notify({
						title: 'Success',
						message: 'Update Successfully',
						type: 'success',
						duration: 2000
					});
					this.getList();
				});
			},
			masterSwitch(row) {
				setMaster(row.id).then(response => {
					this.list.forEach(function(item, index) {
						item.master = 0;
					});
					row.master = 1;
					this.$notify({
						title: 'Success',
						message: 'Successfully',
						type: 'success',
						duration: 2000
					});
				});
			},
			group_member_list(row) {
				this.$dialog('参团人员列表', DialogGroupMemberList, { data: row }).$on('success', _ => {

				});
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
