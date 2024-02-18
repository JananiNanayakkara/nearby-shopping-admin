import { Pressable, StyleSheet, Text } from 'react-native';
import React from 'react';
import { COLORS } from '../assets/theme';

const FAB = (props) => {
	return (
		<Pressable style={styles.container} onPress={props.onPress}>
			<Text style={styles.title}>{props.title}</Text>
		</Pressable>
	);
};

export default FAB;

const styles = StyleSheet.create({
	container: {
		justifyContent: 'center',
		alignItems: 'center',
		borderRadius: 80,
		position: 'absolute',
		bottom: 20,
		right: 20,
		backgroundColor: COLORS.primary,
		padding: 20,
		height: 80,
		width: 80,
	},
	title: {
		fontWeight: 'bold',
		fontSize: 32,
		color: '#fff',
	},
});
