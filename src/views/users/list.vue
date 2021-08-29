<template>
	<div class="app-container">
		<el-card>
			<div class="filter-container">
				账号
				<el-input
						v-model="listQuery.username"
						placeholder="用户名"
						style="width: 200px;"
						class="filter-item"
						@keyup.enter.native="handleFilter"
					/>
				手机号
				<el-input
						v-model="listQuery.phone_number"
						placeholder="手机号"
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

			<el-button type="primary" @click="handleCreateUser">新增用户</el-button>
			<div style="float: right;">
				总会员人数: {{ total }}
			</div>

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
				<el-table-column label="用户名" align="center" width="110">
					<template slot-scope="{row}">
						<span>{{ row.username }}</span>
					</template>
				</el-table-column>
				<el-table-column label="手机号" align="center" width="110">
					<template slot-scope="{row}">
						<span>{{ row.phone_number }}</span>
					</template>
				</el-table-column>
				<el-table-column label="账号等级" align="center">
					<template slot-scope="{row}">
						<el-tooltip v-if="row.relations.level_info" class="item" effect="dark" :content="row.relations.level_info.name" placement="top">
							<el-image :src="require('@/assets/'+row.relations.level_info.icon)" fit="fill" />
						</el-tooltip>
					</template>
				</el-table-column>
				<el-table-column label="产品等级" align="center">
					<template slot-scope="{row}">
						<el-tag v-if="row.relations.pro_level==0" type="info">
							未购买
						</el-tag>
						<el-tag v-else-if="row.relations.pro_level==1" type="info">
							178产品
						</el-tag>
						<el-tag v-else-if="row.relations.pro_level==2" type="info">
							3119产品
						</el-tag>
					</template>
				</el-table-column>
				<el-table-column label="代理等级" align="center">
					<template slot-scope="{row}">
						<el-tag v-if="row.relations.agency_level==0" type="info">
							无
						</el-tag>
						<el-tag v-else-if="row.relations.agency_level==1" type="info">
							区级代理
						</el-tag>
						<el-tag v-else-if="row.relations.agency_level==2" type="info">
							市级代理
						</el-tag>
						<el-tag v-else type="info">
							省级代理
						</el-tag>
					</template>
				</el-table-column>
				<el-table-column label="推荐人手机号" align="center" width="110">
					<template slot-scope="{row}">
						{{ row.relations.user_info ? row.relations.user_info.phone_number:'' }}
					</template>
				</el-table-column>
				<el-table-column label="余额" align="center">
					<template slot-scope="{row}">
						<span v-if="row.account">{{ row.account.balance }}</span>
						<span v-else>0.00</span>
					</template>
				</el-table-column>
				<el-table-column label="金花" align="center">
					<template slot-scope="{row}">
						<span v-if="row.account">{{ row.account.income }}</span>
						<span v-else>0.00</span>
					</template>
				</el-table-column>
				<el-table-column label="茶籽" align="center">
					<template slot-scope="{row}">
						<span v-if="row.account">{{ row.account.integral }}</span>
						<span v-else>0.00</span>
					</template>
				</el-table-column>
				<el-table-column label="活跃值" align="center">
					<template slot-scope="{row}">
						<span v-if="row.account">{{ row.account.active_value }}</span>
						<span v-else>0</span>
					</template>
				</el-table-column>
				<el-table-column label="购物次数" align="center">
					<template slot-scope="{row}">
						<span v-if="row.order_list[0]">{{ row.order_list[0].total_count }}</span>
						<span v-else>0</span>
					</template>
				</el-table-column>
				<el-table-column label="购物金额" align="center">
					<template slot-scope="{row}">
						<span v-if="row.order_list[0]">{{ row.order_list[0].total_money }}</span>
						<span v-else>0</span>
					</template>
				</el-table-column>
				<el-table-column label="昨天抢购" align="center">
					<template slot-scope="{row}">
						<el-tag v-if="row.relations.is_reward == 1" type="success">是</el-tag>
						<el-tag v-else type="info">否</el-tag>
					</template>
				</el-table-column>
				<el-table-column label="是否购买" align="center">
					<template slot-scope="{row}">
						<el-tag v-if="row.relations.is_buy == 1" type="success">是</el-tag>
						<el-tag v-else type="info">否</el-tag>
					</template>
				</el-table-column>
				<el-table-column label="剩余额度" align="center">
					<template slot-scope="{row}">
						<span v-if="row.relations.is_quota">{{ row.relations.is_quota }}</span>
						<span v-else>0.00</span>
					</template>
				</el-table-column>
				<el-table-column label="注册时间" align="center" width="100px">
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
						<el-dropdown @command="handleMore">
							<el-button type="draft" size="mini" style="margin-left: 10px">
								更多操作
								<i class="el-icon-arrow-down el-icon--right" />
							</el-button>
							<el-dropdown-menu slot="dropdown">
								<el-dropdown-item :command="beforeHandleMore('account', row)">提现账户</el-dropdown-item>
								<el-dropdown-item :command="beforeHandleMore('address', row)">收货地址</el-dropdown-item>
								<el-dropdown-item divided />
								<el-dropdown-item :command="beforeHandleMore('flow', row)">资金流水</el-dropdown-item>
								<el-dropdown-item :command="beforeHandleMore('adjust_funds', row)">调整资金</el-dropdown-item>
								<el-dropdown-item :command="beforeHandleMore('agent_list', row)">查看下级</el-dropdown-item>
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
	import { getUserList, delUser, restoreUser } from '@/api/users';
	import Pagination from '@/components/Pagination';
	import DialogUserForm from './components/dialogUserForm';
	import DialogAddres from './components/dialogAddres';
	import DialogUserRecharge from './components/dialogUserRecharge';
	import DialogUserWithdrawAccount from './components/dialogUserWithdrawAccount';
	import DialogAgent from './components/dialogAgent';
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
					head_image_url: 'https://wpimg.wallstcn.com/577965b9-bb9e-4e02-9f0c-095b41417191',
					username: '',
					password: '',
					nickname: '',
					phone_number: ''
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
					getUserList(this.listQuery).then(response => {
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
					head_image_url: 'https://wpimg.wallstcn.com/577965b9-bb9e-4e02-9f0c-095b41417191',
					username: '',
					password: '',
					nickname: '',
					phone_number: ''
				};
				this.$dialog('新增用户', DialogUserForm, this.temp, { width: '600px' }).$on('success', result => {
					this.list.unshift(result);
				});
			},
			handleEdit(data) {
				this.$dialog('编辑用户', DialogUserForm, { data }, { width: '600px' }).$on('success', result => {
					console.log(result);
				});
			},
			handleDelete(row, index) {
				delUser(row.id).then(response => {
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
				restoreUser(row).then(response => {
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
				if (res.command == 'account') {
					this.$dialog('提现账户', DialogUserWithdrawAccount, { id })
						.$on('success', result => {

						});
				} else if (res.command == 'address') {
					this.$dialog('收货地址', DialogAddres, { id })
						.$on('success', result => {

						});
				} else if (res.command == 'flow') {
					this.$dialog('资金流水', DialogUserRecharge, { id })
						.$on('success', result => {

						});
				} else if (res.command == 'adjust_funds') {
					console.log(res.command);
				} else if (res.command == 'agent_list') {
					this.$dialog('查看下级', DialogAgent, { id }, { width: '1000px' })
						.$on('success', result => {

						});
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
    .avatar {
        img {
            width: 100px;
            height: 100px;
            border-radius: 50%;
        }
    }
</style>
