export default {
	computed: {
		userInfo() {
			return this.$store.state.user.userInfo;
		}
	}
};
