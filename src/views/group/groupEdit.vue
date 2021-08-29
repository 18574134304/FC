<template>
	<div class="app-container group-add-container">
		<el-form
				ref="formData"
				:rules="rules"
				:model="formData"
				label-position="left"
				label-width="100px"
			>
			<el-form-item label="商品">
				<el-autocomplete
						v-model="state"
						:fetch-suggestions="handleSearch"
						placeholder="请输入内容"
						value-key="title"
						@select="handleSelect"
					>
					<template slot-scope="{ item }">
						<div class="goods-item">
							<l-img
									v-if="item.image.length"
									:src="item.images_list[0]"
									style="width: 60px;height: 60px; margin-right: 10px;"
								/>
							{{ item.title }}
						</div>
					</template>
				</el-autocomplete>
			</el-form-item>
			<el-form-item label="价格" prop="goods_price">
				<el-input v-model="formData.goods_price" readonly disabled />
			</el-form-item>
			<el-form-item label="类型" prop="type">
				<el-select v-model="formData.type" placeholder="请选择类型">
					<el-option
							v-for="item in options"
							:key="item.value"
							:label="item.label"
							:value="item.value"
						/>
				</el-select>
			</el-form-item>
			<el-form-item label="成团人数" prop="complete">
				<el-input v-model="formData.complete" />
			</el-form-item>
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
			<el-form-item label="截止时间" prop="expire_time">
				<el-date-picker
						v-model="formData.expire_time"
						type="datetime"
						placeholder="请选择截止时间"
						value-format="yyyy-MM-dd HH:mm:ss"
						default-time="23:00:00"
					/>
			</el-form-item>
			<el-form-item>
				<el-button type="primary" @click="onSubmit">立即创建</el-button>
			</el-form-item>
		</el-form>
	</div>
</template>

<script>
	import { getGoodsList } from '../../api/goods';
	import { addGroup, getSearchUser } from '../../api/group';

	export default {
		name: 'GroupEdit',
		props: {
			formData: {
				type: Object,
				default() {
					return {
						id: undefined,
						goods_price: '',
						complete: ''
					};
				}
			}
		},
		data() {
			return {
				state: '',
				timeout: null,
				options: [{
					value: 0,
					label: '茯茶产品'
				}, {
					value: 1,
					label: '消费产品'
				}],
				loading: false,
				must_winner_options: [],
				rules: {
					goods_price: [{ required: true, message: '不能为空', trigger: 'blur' }],
					type: [{ required: true, message: '不能为空', trigger: 'blur' }],
					complete: [{ required: true, message: '不能为空', trigger: 'blur' }],
					expire_time: [{ required: true, message: '不能为空', trigger: 'blur' }]
				}
			};
		},
		mounted() {

		},
		methods: {
			onSubmit() {
				this.$refs['formData'].validate((valid) => {
					if (valid) {
						addGroup(this.formData);
						this.$emit('success');
						this.$emit('dialog-close');
					}
				});
			},
			handleSelect(item) {
				this.formData.goods_id = item.id;
				this.formData.goods_price = item.group_buy_price;
			},
			async search(queryString, cb) {
				try {
					let response = await getGoodsList({ title: queryString, is_group_buy: 1 });
					let results = response.data.data;

					clearTimeout(this.timeout);
					this.timeout = setTimeout(() => {
						cb(results);
					}, 3000 * Math.random());
				} catch (e) {
					console.log(e);
				}
			},
			handleSearch(queryString, cb) {
				if (queryString) {
					this.search(queryString, cb);
				}
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

<style lang="scss" scoped>
	.el-autocomplete {
		display: block;
	}
	.goods-item {
		display: flex;
		align-items: center;
	}
</style>
