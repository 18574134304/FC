<template>
	<div class="app-container">
		<el-button type="primary" @click="handleCreateUserAddr">添加地址</el-button>
		<el-table
				v-loading="listLoading"
				:data="addressList"
				fit
				highlight-current-rowstyle="width: 100%;"
			>
			<el-table-column
					label="ID"
					prop="id"
					align="center"
					width="80"
				>
				<template slot-scope="{row}">
					<span>{{ row.id }}</span>
				</template>
			</el-table-column>
			<el-table-column label="姓名" width="110px" align="center">
				<template slot-scope="{row}">
					<span>{{ row.name }}</span>
				</template>
			</el-table-column>
			<el-table-column label="手机号" width="110px" align="center">
				<template slot-scope="{row}">
					<span>{{ row.phone_number }}</span>
				</template>
			</el-table-column>
			<el-table-column label="地址" align="center">
				<template slot-scope="{row}">
					<span>{{ row.province_code }}{{ row.city_code }}{{ row.county_code }}{{ row.address }}</span>
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
					<el-button v-if="row.is_default===0" type="success" size="mini" @click="handleDefault(row,$index)">
						设为默认
					</el-button>
				</template>
			</el-table-column>
		</el-table>
	</div>
</template>

<script>
	import { getUserAddrList, delUserAddr, restoreUserAddr, updateUserAddr } from '@/api/users';
	import dialogAddresEdit from '@/views/users/components/dialogAddresEdit';
	export default {
		name: 'DialogAddres',
		props: {
			// 接收
			id: {
				type: Number,
				default() {
					return 0;
				}
			}
		},
		data() {
			return {
				listLoading: false,
				addressList: [],
				listQuery: {
					id: this.id,
					page: 1,
					limit: 10
				}
			};
		},
		mounted() {
			this.getList();
		},
		methods: {
			getList() {
				try {
					this.listLoading = true;
					getUserAddrList(this.listQuery).then(response => {
						this.addressList = response.data.data;
						this.total = response.data.total;
						this.listLoading = false;
					});
				} catch (e) {
					console.log(e);
				}
			},
			handleCreateUserAddr() {
				this.temp = {
					id: undefined,
					user_id: this.id,
					name: '',
					phone_number: '',
					province_code: '',
					city_code: '',
					county_code: '',
					address: ''
				};
				console.log(this.temp);
				this.$dialog('添加地址', dialogAddresEdit, { data: this.temp }, { width: '600px', inBody: true }).$on('success', result => {
					this.addressList.unshift(result);
				});
			},
			handleEdit(data) {
				this.$dialog('编辑地址', dialogAddresEdit, { data }, { width: '600px', inBody: true }).$on('success', result => {
					console.log(result);
				});
			},
			handleDelete(row, index) {
				delUserAddr(row.id).then(response => {
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
				restoreUserAddr(row).then(response => {
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
			handleDefault(row, index) {
				const data = { id: row.id, is_default: 1 };
				updateUserAddr(data).then(response => {
					this.addressList = this.addressList.map(n => {
						return {
							...n,
							is_default: n.id === row.id ? 1 : 0
						};
					});
					this.$notify({
						title: 'Success',
						message: 'Delete Successfully',
						type: 'success',
						duration: 2000
					});
				});
			}
		}
	};
</script>

<style scoped>

</style>
