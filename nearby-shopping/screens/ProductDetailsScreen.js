import React, { useEffect, useState } from 'react';
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
import { COLORS } from '../assets/theme';
import globalStyles from '../assets/globalStyles';
import useCartStore from '../stores/cartStore';
import { PAGES } from '../assets/constants';
import useAuthStore from '../stores/authStore';
import setupAxios from '../helpers/axiosConfig';

const ProductDetailsScreen = ({ route, navigation }) => {
	const { service } = route.params;
	const [feedback, setFeedback] = React.useState('');
	const [loading, setLoading] = useState(false);
	const [rating, setRating] = useState(0);
	const [reviews, setReviews] = useState([]);
	const [showReviews, setShowReviews] = useState(false);

	const [ratingSum, setRatingSum] = useState(0);

	const { id, token } = useAuthStore();
	const { addToCart } = useCartStore();

	const axios = setupAxios(token);

	useEffect(() => {
		navigation.setOptions({
			headerTitle: service.productName,
			headerRight: () =>
				id === service.userId && (
					<TouchableOpacity
						style={{ marginRight: 10 }}
						onPress={() => navigation.navigate(PAGES.ADD_PRODUCT, { service })}
					>
						<Icon name="edit" size={24} color="black" />
					</TouchableOpacity>
				),
		});

		setLoading(true);
		loadReviews();
	}, [navigation]);

	const loadReviews = () => {
		try {
			axios
				.get(`/reviews/product/${service.id}`)
				.then((response) => {
					const sum = response.data.reduce(
						(acc, review) => acc + review.rating,
						0
					);
					const ratingSum = sum / response.data.length;
					setRatingSum(ratingSum);
					setReviews(response.data);
				})
				.catch((error) => {
					console.log(error);
					alert('Error fetching reviews');
				})
				.finally(() => {
					setLoading(false);
				});
		} catch (error) {
			console.log('🚀 ~ loadReviews ~ error:', error);
		}
	};

	const handleRating = () => {
		setLoading(true);
		try {
			axios
				.post('/reviews', {
					productId: service.id,
					rating,
					feedback,
					userId: id,
				})
				.then(() => {
					loadReviews();
					setFeedback('');
					setRating(0);
				})
				.catch((error) => {
					console.log(error);
					alert('Error submitting review');
				})
				.finally(() => {
					setLoading(false);
				});
		} catch (error) {
			console.log('🚀 ~ handleRating ~ error:', error);
		}
	};

	const handleDelete = () => {
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

	const deleteProduct = () => {
		setLoading(true);
		try {
			axios
				.delete(`/products/${service.id}`)
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
		} catch (error) {
			console.log('🚀 ~ deleteProduct ~ error:', error);
		}
	};

	return (
		<KeyboardAvoidingView style={globalStyles.containerWrapper}>
			<ScrollView style={globalStyles.container}>
				<Text style={styles.title}>{service.productName}</Text>
				<Text style={styles.description}>
					Rating: {ratingSum?.toFixed(2) ?? 'No rating'}
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
										{!review.feedback ? '-- No feedback --' : review.feedback}
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

				{id !== service.userId && showReviews && (
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

				{id === service.userId && (
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
