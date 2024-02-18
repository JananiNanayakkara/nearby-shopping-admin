import { StyleSheet } from 'react-native';
import { COLORS, SIZES } from './theme';

const globalStyles = StyleSheet.create({
	containerWrapper: {
		flex: 1,
	},
	container: {
		flex: 1,
		padding: SIZES.lg,
		backgroundColor: 'white',
	},
	label: {
		fontSize: SIZES.md,
		marginBottom: SIZES.xs,
	},
	input: {
		flex: 1,
		borderWidth: 1,
		borderColor: COLORS.gray,
		padding: SIZES.xs,
		marginBottom: SIZES.md,
		height: 40,
	},
	inputTextArea: {
		borderWidth: 1,
		borderColor: COLORS.gray,
		padding: SIZES.xs,
		marginBottom: SIZES.md,
		height: 80,
	},
	button: {
		backgroundColor: COLORS.primary,
		padding: SIZES.xs,
		alignItems: 'center',
		marginBottom: SIZES.md,
		height: 60,
		justifyContent: 'center',
	},
	secondaryButton: {
		backgroundColor: COLORS.secondary,
		padding: SIZES.xs,
		alignItems: 'center',
		marginBottom: SIZES.md,
		height: 60,
		justifyContent: 'center',
	},
	deleteButton: {
		backgroundColor: COLORS.red,
		padding: SIZES.xs,
		alignItems: 'center',
		marginBottom: SIZES.md,
		height: 50,
		justifyContent: 'center',
	},
	buttonText: {
		color: COLORS.lightWhite,
		fontWeight: 'bold',
		fontSize: SIZES.md,
	},
	loader: {
		position: 'absolute',
		top: 0,
		left: 0,
		width: '100%',
		height: '100%',
		justifyContent: 'center',
		alignItems: 'center',
		backgroundColor: 'rgba(0,0,0,0.3)',
	},
	titleText: {
		fontSize: SIZES.xxl,
		fontWeight: 'bold',
		marginBottom: SIZES.md,
		textAlign: 'center',
	},
	footerButtonWrapper: {
		padding: 20,
		position: 'absolute',
		bottom: 0,
		left: 0,
		width: '100%',
	},
});

export default globalStyles;
