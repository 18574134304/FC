<template>
	<div class="app-container">
		<el-row :gutter="20">
			<el-col :span="8">
				<p>许可证</p>
			</el-col>
			<el-col :span="15">
				<el-popover placement="bottom" trigger="click"> <!--trigger属性值：hover、click、focus 和 manual-->
					<a :href="info.license_url" target="_blank" title="查看最大化图片">
						<img :src="info.license_url">
					</a>
					<img slot="reference" :src="info.license_url" style="width: 100px; cursor:pointer">
				</el-popover>
			</el-col>
		</el-row>
		<el-row :gutter="20">
			<el-col :span="8">
				<p>身份证姓名</p>
			</el-col>
			<el-col :span="15">
				<p>{{ info.id_name }}</p>
			</el-col>
		</el-row>
		<el-row :gutter="20">
			<el-col :span="8">
				<p>身份证号</p>
			</el-col>
			<el-col :span="15">
				<p>{{ info.id_code }}</p>
			</el-col>
		</el-row>
		<el-row :gutter="20">
			<el-col :span="8">
				<p>身份证人像面</p>
			</el-col>
			<el-col :span="15">
				<el-popover placement="bottom" trigger="click"> <!--trigger属性值：hover、click、focus 和 manual-->
					<a :href="info.id_front_url" target="_blank" title="查看最大化图片">
						<img :src="info.id_front_url">
					</a>
					<img slot="reference" :src="info.id_front_url" style="width: 100px; cursor:pointer">
				</el-popover>
			</el-col>
		</el-row>
		<el-row :gutter="20">
			<el-col :span="8">
				<p>身份证国徽面</p>
			</el-col>
			<el-col :span="15">
				<el-popover placement="bottom" trigger="click"> <!--trigger属性值：hover、click、focus 和 manual-->
					<a :href="info.id_back_url" target="_blank" title="查看最大化图片">
						<img :src="info.id_back_url">
					</a>
					<img slot="reference" :src="info.id_back_url" style="width: 100px; cursor:pointer">
				</el-popover>
			</el-col>
		</el-row>
		<el-row :gutter="20">
			<el-col :span="8">
				<p>银行账号</p>
			</el-col>
			<el-col :span="15">
				<p>{{ info.bank_account }}</p>
			</el-col>
		</el-row>
		<el-row :gutter="20">
			<el-col :span="8">
				<p>银行卡图片</p>
			</el-col>
			<el-col :span="15">
				<el-popover placement="bottom" trigger="click"> <!--trigger属性值：hover、click、focus 和 manual-->
					<a :href="info.bank_card_image_url" target="_blank" title="查看最大化图片">
						<img :src="info.bank_card_image_url">
					</a>
					<img slot="reference" :src="info.bank_card_image_url" style="width: 100px; cursor:pointer">
				</el-popover>
			</el-col>
		</el-row>
		<el-button v-if="data.is_perfect != 3" type="success" size="small" @click="updateCertificationStatus()">
			通过认证
		</el-button>
	</div>
</template>

<script>
	import { getShopProfile, updateShop } from '@/api/shop';
	export default {
		name: 'DialogCertification',
		props: {
			// 接收
			data: {
				type: Object,
				default() {
					return {};
				}
			}
		},
		data() {
			return {
				info: {}
			};
		},
		mounted() {
			this.init();
		},
		methods: {
			init() {
				getShopProfile(this.data.id).then(response => {
					this.info = response.data;
				});
			},
			updateCertificationStatus() {
				this.$confirm('确定要执行该操作吗?', '提示', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					type: 'warning'
				}).then(() => {
					console.log('aaa')
					updateShop({ id: this.info.shop_id, is_perfect: 3 }).then(response => {
						this.data.is_perfect = 3;
						this.$notify({
							title: 'Success',
							message: 'Update Successfully',
							type: 'success',
							duration: 2000
						});
						this.$emit('dialog-close');
					});
				}).catch(() => {});
			}
		}
	};
</script>

<style scoped>

</style>
