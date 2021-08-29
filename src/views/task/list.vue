<template>
	<div class="app-container">
		<l-card>
			<el-button type="primary" @click="handleCreate">立即创建</el-button>
		</l-card>
		<l-card>
			<el-table v-loading="loading" :data="list" stripe border>
				<el-table-column prop="id" label="ID" />
				<el-table-column prop="created_at" label="日期" />
				<el-table-column prop="name" label="名称" />
				<el-table-column prop="path" label="视频">
					<template slot-scope="scope">
						<el-tooltip class="item" effect="dark" content="点击播放" placement="top">
							<i class="el-icon-video-play" :style="{ fontSize: '20px', cursor: 'pointer' }" @click="handlePlay(scope.row)" />
						</el-tooltip>
					</template>
				</el-table-column>
				<el-table-column prop="play_quantity" label="播放数" />
			</el-table>
		</l-card>
		<el-dialog v-if="dialogVisible" :visible.sync="dialogVisible" top="5vh">
			<div style="margin: 0 auto; text-align: center">
				<video
						:src="dialogUrl"
						controls="controls"
						autoplay
						style="max-height: 80vh;"
					>
					您的浏览器不支持视频播放
				</video>
			</div>
		</el-dialog>
	</div>
</template>

<script>
	import { getTaskList } from '../../api/tesk';
	import TaskEdit from './edit';

	export default {
		name: 'TaskList',
		data() {
			return {
				loading: false,
				list: [],
				dialogVisible: false,
				dialogUrl: '',
				formData: {
					page: 1,
					pageSize: 10
				}
			};
		},
		computed: {
			params() {
				return this.formData;
			}
		},
		mounted() {
			this.fetch();
		},
		methods: {
			async fetch() {
				this.loading = true;
				try {
					let response = await getTaskList(this.params);
					if (response.code === 0) {
						this.list = response.data.data;
					}
				} catch (e) {
					console.log(e);
				}
				this.loading = false;
			},
			handleCreate() {
				this.$dialog('添加任务', TaskEdit, {}).$on('success', _ => {
					this.fetch();
				});
			},
			handlePlay(data) {
				this.dialogVisible = true;
				this.dialogUrl = data.url;
			}
		}
	};
</script>

<style scoped>

</style>
