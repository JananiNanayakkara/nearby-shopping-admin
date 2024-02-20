import React, { useState } from 'react';
import {
	StyleSheet,
	Text,
	View,
	TextInput,
	TouchableOpacity,
	KeyboardAvoidingView,
	ActivityIndicator,
	Alert,
	Button,
	ScrollView,
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { Rating } from 'react-native-ratings';
import { auth, db } from '../firebase-config';
import { COLORS } from '../assets/theme';
import globalStyles from '../assets/globalStyles';
import useCartStore from '../stores/cartStore';
import { PAGES } from '../assets/constants';

const ProductDetailsScreen = ({ route, navigation }) => {
	const { service } = route.params;
	const [feedback, setFeedback] = React.useState('');
	const [loading, setLoading] = useState(false);
	const [rating, setRating] = useState(0);
	const [reviews, setReviews] = useState([]);
	const [showReviews, setShowReviews] = useState(false);

	const { addToCart } = useCartStore();

	const axios = setupAxios(token);

	useEffect(() => {
		navigation.setOptions({
			headerTitle: service.productName,
			headerRight: () =>
				auth.currentUser.uid === service.uid && (
					<TouchableOpacity
						style={{ marginRight: 10 }}
						onPress={() => navigation.navigate(PAGES.ADD_PRODUCT, { service })}
					>
						<Icon name="edit" size={24} color="black" />
					</TouchableOpacity>
				),
		});

		setLoading(true);
		const reviewsRef = db.collection('rating');
		const subs = reviewsRef
			.where('productId', '==', service.key)
			.orderBy('createdAt', 'desc')
			.limit(5)
			.onSnapshot((snapshot) => {
				const reviews = [];
				snapshot.forEach((doc) => {
					reviews.push(doc.data());
				});
				setReviews(reviews);
				setLoading(false);
			});

		return () => subs();
	}, [navigation]);

	handleRating = () => {
		setLoading(true);
		const ratingRef = db.collection('rating');
		ratingRef
			.add({
				uid: auth.currentUser.uid,
				rating: rating,
				productId: service.key,
				feedback: feedback,
				createdAt: new Date(),
			})
			.then(() => {
				alert('Feedback added');
				setFeedback('');
			})
			.catch((error) => {
				console.log(error);
				alert('Error creating product');
			})
			.finally(() => {
				setLoading(false);
			});
	};

	handleDelete = () => {
		Alert.alert(
			'Delete Confirmation',
			'Are you sure you want to delete this item?',
			[
				{
					text: 'Cancel',
					style: 'cancel',
				},
				{ text: 'OK', onPress: () => deleteProduct() },
			],
			{ cancelable: false }
		);
	};

	deleteProduct = () => {
		setLoading(true);
		const serviceRef = db.collection('products').doc(service.key);
		serviceRef
			.delete()
			.then(() => {
				alert('Product deleted');
				navigation.goBack();
			})
			.catch((error) => {
				console.log(error);
				alert('Error deleting product');
			})
			.finally(() => {
				setLoading(false);
			});
	};

	return (
		<KeyboardAvoidingView style={globalStyles.containerWrapper}>
			<ScrollView style={globalStyles.container}>
				<Text style={styles.title}>{service.productName}</Text>
				<Text style={styles.description}>
					Rating: {service?.rating?.toFixed(2) ?? 'No rating'}
				</Text>
				<Text style={styles.description} numberOfLines={15}>
					{service.description}
				</Text>
				<View
					style={{
						flexDirection: 'row',
						justifyContent: 'space-between',
						alignItems: 'center',
					}}
				>
					<Text style={styles.price}>Rs: {service.price}</Text>
					<View style={styles.location}>
						<Icon name="map-marker" size={24} color={COLORS.primary} />
						<Text style={styles.locationText}>{service.nearestCity}</Text>
					</View>
				</View>

				<View style={styles.reviewWrapper}>
					<View
						style={{
							flexDirection: 'row',
							justifyContent: 'space-between',
							alignItems: 'center',
						}}
					>
						<Text style={styles.title}>Reviews</Text>
						<TouchableOpacity onPress={() => setShowReviews(!showReviews)}>
							<Text style={{ color: COLORS.primary }}>
								{showReviews ? 'Hide' : 'Show'} all reviews
							</Text>
						</TouchableOpacity>
					</View>

					{showReviews &&
						reviews.map((review, index) => (
							<View key={index}>
								<View style={styles.rateDetailsWrapper}>
									<Text style={styles.description}>
										{review.feedback === '' ? 'No feedback' : review.feedback}
									</Text>

									<Rating
										readonly
										startingValue={review.rating}
										style={{ paddingVertical: 10 }}
										imageSize={20}
										ratingBackgroundColor={COLORS.white}
									/>
								</View>
							</View>
						))}
				</View>

				{auth.currentUser.uid !== service.uid && showReviews && (
					<View>
						<Rating
							startingValue={4}
							onFinishRating={(rating) => setRating(rating)}
							style={{ paddingVertical: 10 }}
						/>
						<TextInput
							style={globalStyles.inputTextArea}
							value={feedback}
							onChangeText={setFeedback}
							placeholder="Feedback"
							multiline={true}
						/>
						<Button title="Submit review" onPress={handleRating} />
					</View>
				)}

				{auth.currentUser.uid === service.uid && (
					<View style={{ marginTop: 20 }}>
						<TouchableOpacity
							style={globalStyles.deleteButton}
							onPress={() => handleDelete()}
						>
							<Text style={globalStyles.buttonText}>Delete product</Text>
						</TouchableOpacity>
					</View>
				)}

				<View style={{ marginVertical: 50 }}>
					<TouchableOpacity
						style={globalStyles.button}
						onPress={() => {
							addToCart(service);
						}}
					>
						<Text style={globalStyles.buttonText}>Add to cart</Text>
					</TouchableOpacity>
				</View>
			</ScrollView>
			{loading && (
				<View style={globalStyles.loader}>
					<ActivityIndicator size="large" color={COLORS.primary} />
				</View>
			)}
		</KeyboardAvoidingView>
	);
};

const styles = StyleSheet.create({
	title: {
		fontSize: 24,
		fontWeight: 'bold',
		marginBottom: 10,
	},
	description: {
		fontSize: 16,
		marginBottom: 10,
	},
	price: {
		fontSize: 18,
		fontWeight: 'bold',
	},
	location: {
		flexDirection: 'row',
		alignItems: 'center',
		marginTop: 10,
	},
	locationText: {
		marginStart: 8,
		fontSize: 16,
		color: COLORS.primary,
	},
	reviewWrapper: {
		marginTop: 20,
	},
	rateDetailsWrapper: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
	},
});

export default ProductDetailsScreen;
