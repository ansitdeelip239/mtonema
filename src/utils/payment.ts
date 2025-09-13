// Utility for verifying payment status with retries
export async function verifyPaymentStatus(
	checkSubscriptionStatus: (skipLoading?: boolean) => Promise<boolean>,
	userId: number | undefined,
	maxAttempts: number = 5
): Promise<boolean> {
	if (!userId) {
		return false;
	}

	for (let attempt = 1; attempt <= maxAttempts; attempt++) {
		try {
			// Call the subscription status API to check if payment is processed
			// Skip loading to prevent SubscriptionGuard from showing loading screen
			const hasActiveAccess = await checkSubscriptionStatus(true);

			// Check if user now has active access after payment using the returned value
			if (hasActiveAccess) {
				return true;
			}

			// If not the last attempt, wait before trying again
			if (attempt < maxAttempts) {
				await new Promise(resolve => setTimeout(() => resolve, 2000)); // Wait 2 seconds
			}
		} catch (error) {
			// If not the last attempt, wait before trying again
			if (attempt < maxAttempts) {
				await new Promise(resolve => setTimeout(() => resolve, 2000)); // Wait 2 seconds
			}
		}
	}
	return false; // Failed after all attempts
}
