<template>
	<div class="app-container">
		<el-tree :load="loadNode" lazy :props="defaultProps" @check-change="handleCheckChange">
			<span slot-scope=" { node, data }" class="custom-tree-node">
				<span>
					UID: {{ data.user_id }} |
					等级: {{ data.level_info.name }} |
					手机号: {{ data.user_info_chiler.phone_number }} |
					自己参与数: {{ data.max_compute_task }}} |
					直推任务数: {{ data.direct_total_task }} |
					团队任务数: {{ data.team_total_task }} |
					购买人数: {{ data.subordinate_count > 0 ? data.subordinate_count - 1 : 0 }} |
					购买业绩: {{ data.pro_good }}
				</span>
			</span>
		</el-tree>
	</div>
</template>

<script>
	import { getUserAgentList } from '@/api/users';
	export default {
		name: 'DialogAgent',
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
				defaultProps: {
					children: 'children',
					label: 'user_id'
				}
			};
		},
		methods: {
			loadNode(node, resolve) {
				// console.log(node);
				if (node.level === 0) {
					getUserAgentList(this.id).then(response => {
						return resolve(response.data);
					});
				} else {
					getUserAgentList(node.data.user_id).then(response => {
						return resolve(response.data);
					});
				}
			},
			handleCheckChange(row) {
				console.log(row);
			}
		}
	};
</script>

<style scoped>

</style>
