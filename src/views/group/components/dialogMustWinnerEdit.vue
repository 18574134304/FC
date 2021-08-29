<template>
	<div class="app-container">
		<el-form
				ref="dataForm"
				:model="formData"
				label-position="left"
				label-width="70px"
				style="width: 400px; margin-left:50px;"
			>
			<el-form-item label="必中人员">
				<el-select
						v-model="formData.must_winner_list"
						multiple
						filterable
						remote
						reserve-keyword
						placeholder="请输入手机号"
						:remote-method="remoteMethod"
						:loading="loading"
					>
					<el-option
							v-for="item in must_winner_options"
							:key="item.value"
							:label="item.label"
							:value="item.value"
						/>
				</el-select>
			</el-form-item>
			<el-form-item>
				<el-button type="primary" @click="updateData">
					保存
				</el-button>
			</el-form-item>
		</el-form>
	</div>
</template>

<script>
	import { getSearchUser, updateGroup } from '@/api/group';

	export default {
		name: 'DialogMustWinnerEdit',
		props: {
			formData: {
				type: Object,
				default() {
					return {
						id: undefined,
						must_winner_list: ''
					};
				}
			}
		},
		data() {
			return {
				loading: false,
				must_winner_list_res: [
					{ value: '1', label: `关关` }
				],
				must_winner_options: []
			};
		},
		mounted() {
			// this.must_winner_list_res = this.formData.must_winner_list.map(item => {
			// 	console.log(item);
			// 	return { value: item, label: `关关` };
			// });
			// console.log(this.must_winner_list_res);
		},
		methods: {
			updateData() {
				updateGroup(this.formData).then(response => {
					this.$emit('success');
					this.$emit('dialog-close');
				});
			},
			remoteMethod(query) {
				if (query !== '') {
					this.loading = true;
					getSearchUser(query).then(response => {
						this.must_winner_options = response.data.map(item => {
							return {
								value: item.id,
								label: item.nickname
							};
						});
					});
					this.loading = false;
				} else {
					this.must_winner_options = [];
				}
			}
		}
	};
</script>

<style scoped>

</style>
