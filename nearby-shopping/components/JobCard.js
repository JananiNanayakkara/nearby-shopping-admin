import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import React from 'react';
import { COLORS, SHADOWS, SIZES } from '../assets/theme';
import Icon from 'react-native-vector-icons/FontAwesome';
import { useNavigation } from '@react-navigation/core';
import globalStyles from '../assets/globalStyles';
import { PAGES } from '../assets/constants';

const JobCard = ({ service }) => {
	const navigation = useNavigation();

	const gotoDetails = (service) => {
		navigation.navigate(PAGES.PRODUCT_DETAILS, { service: service });
	};

	return (
		<TouchableOpacity
			style={{ margin: SIZES.xs }}
			onPress={() => gotoDetails(service)}
		>
			<View key={service.id} style={styles.serviceCard}>
				<Text style={styles.serviceTitle}>{service.productName}</Text>
				<Text style={styles.serviceDescription} numberOfLines={2}>
					{service.description}
				</Text>

				<View style={styles.serviceLocation}>
					<Text style={styles.servicePrice}>Rs: {service.price}</Text>
					<View style={{ flexDirection: 'row', alignItems: 'center' }}>
						<Text style={styles.serviceLocationText}>
							{service.nearestCity}
						</Text>
						<Icon
							style={styles.serviceIcon}
							name="map-marker"
							size={24}
							color={COLORS.primary}
						/>
					</View>
				</View>
			</View>
		</TouchableOpacity>
	);
};

export default JobCard;

const styles = StyleSheet.create({
	serviceCard: {
		backgroundColor: COLORS.white,
		borderRadius: 8,
		...SHADOWS.medium,
		padding: 15,
		gap: 8,
	},
	serviceTitle: {
		marginStart: 8,
		fontSize: SIZES.xl,
		fontWeight: 'bold',
	},
	serviceDescription: {
		marginStart: 8,
		fontSize: SIZES.md,
		color: COLORS.gray,
	},
	serviceLocation: {
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'space-between',
		marginTop: 8,
	},
	serviceIcon: {
		marginStart: 8,
	},
	servicePrice: {
		fontSize: SIZES.md,
		fontWeight: 'bold',
	},
	serviceLocationText: {
		fontSize: SIZES.md,
		color: COLORS.primary,
	},
});
