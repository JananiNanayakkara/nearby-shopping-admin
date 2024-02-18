import { StyleSheet, View } from 'react-native';
import React, { useState, useEffect } from 'react';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import { db } from '../firebase-config';
import { useNavigation } from '@react-navigation/core';

const initialRegion = {
	latitude: 6.9271,
	longitude: 79.8612,
	latitudeDelta: 0.0922,
	longitudeDelta: 0.0421,
};

const MapScreen = () => {
	const [serviceList, setServiceList] = useState([]);
	const navigation = useNavigation();
	useEffect(() => {
		(() => {
			const produtcsRef = db.collection('products');
			const subscriber = produtcsRef.onSnapshot((querySnapshot) => {
				const products = [];

				querySnapshot.forEach((documentSnapshot) => {
					products.push({
						...documentSnapshot.data(),
						key: documentSnapshot.id,
					});
				});

				setServiceList(products);
			});

			return () => subscriber();
		})();
	}, []);

	onMarkerPress = (service) => {
		navigation.navigate(PAGES.PRODUCT_DETAILS, { service: service });
	};

	return (
		<View style={styles.container}>
			<MapView
				style={StyleSheet.absoluteFill}
				initialRegion={initialRegion}
				provider={PROVIDER_GOOGLE}
				showsUserLocation={true}
				showsMyLocationButton={true}
			>
				{serviceList.map((service) => (
					<Marker
						key={service.key}
						coordinate={{
							latitude: Number(service.location.split(',')[0]),
							longitude: Number(service.location.split(',')[1]),
						}}
						title={service.productName}
						description={service.description}
						onMarkerPress={() => onMarkerPress(service)}
					/>
				))}
			</MapView>
		</View>
	);
};

export default MapScreen;

const styles = StyleSheet.create({
	container: {
		flex: 1,
	},
});
