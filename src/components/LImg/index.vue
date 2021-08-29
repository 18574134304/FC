<template>
	<el-image :src="url" :fit="fit" :alt="alt" :preview-src-list="previewList" />
</template>

<script>
	export default {
		name: 'LImg',
		props: {
			src: {
				type: String,
				default() {
					return '';
				}
			},
			fit: {
				type: String,
				default() {
					return 'contain';
				}
			},
			alt: {
				type: String,
				default() {
					return '';
				}
			},
			previewSrcList: {
				type: Array,
				default() {
					return [];
				}
			}
		},
		computed: {
			url() {
				return this.src;
			},
			previewList() {
				return [...this.previewSrcList.map(n => {
					return n;
				})];
			}
		}
	};
</script>

<style scoped>
</style>
