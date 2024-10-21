import React from "react";
import { loadStripe, StripeError } from "@stripe/stripe-js";

// Directly use the Stripe public key here
const STRIPE_PUBLISHABLE_KEY = "pk_test_51Oqsq6JNEF1WwaBOw9gx2DLVDEdqSjNtzU6bMjtjzZvg2YmbQGvbh5InMOv3N6DGlpbs9eXr11QPpJ4FoeYMexLE0022sfirEk";
const stripePromise = loadStripe(STRIPE_PUBLISHABLE_KEY);

const PremiumPage: React.FC = () => {
    const handlePurchase = async () => {
        const response = await fetch("http://localhost:8080/create-checkout", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
        });

        const session = await response.json();

        const stripe = await stripePromise;

        // Check if stripe is loaded
        if (!stripe) {
            console.error("Stripe.js has not yet loaded.");
            return;
        }

        const { error } = await stripe.redirectToCheckout({
            sessionId: session.id,
        }) as { error?: StripeError };

        if (error) {
            console.error("Error redirecting to Stripe checkout:", error.message);
        }
    };

    return (
        <div>
            <h2>Premium Membership</h2>
            <p>You are going to purchase a Premium Membership.</p>
            <p>It will cost 199 SEK.</p>
            <button onClick={handlePurchase}>Buy Premium</button>
        </div>
    );
};

export default PremiumPage;
