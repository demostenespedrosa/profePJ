
'use client';

import { Auth, createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { Firestore, doc, writeBatch, collection } from "firebase/firestore";
import { addDays } from "date-fns";

const schoolColors = ["#34D399", "#F87171", "#60A5FA", "#FBBF24", "#A78BFA"];

// This function handles the entire sign-up process
export async function signUpAndCreateProfile(auth: Auth, firestore: Firestore, data: any) {
    // 1. Create the user in Firebase Auth
    const userCredential = await createUserWithEmailAndPassword(auth, data.email, data.password);
    const user = userCredential.user;

    // 2. Update the user's display name
    await updateProfile(user, {
        displayName: data.name
    });

    // 3. Calculate trial end date (14 days from now)
    const now = new Date();
    const trialEndsAt = addDays(now, parseInt(process.env.NEXT_PUBLIC_TRIAL_DAYS || '14'));

    // 4. Create a batch write to save all data to Firestore atomically
    const batch = writeBatch(firestore);

    // 4.1. User profile document with subscription info
    const userDocRef = doc(firestore, "users", user.uid);
    const userProfileData = {
        name: data.name,
        email: data.email,
        dasDueDate: data.dasDueDate,
        streakDays: 0,
        xpTotal: 0,
        subscriptionStatus: 'trialing',
        trialEndsAt: trialEndsAt.toISOString(),
        createdAt: now.toISOString(),
    };
    batch.set(userDocRef, userProfileData);

    // 4.2. Initial subscription document
    const subscriptionDocRef = doc(firestore, `users/${user.uid}/subscription/current`);
    const subscriptionData = {
        status: 'trialing',
        trialEnd: trialEndsAt.toISOString(),
        cancelAtPeriodEnd: false,
    };
    batch.set(subscriptionDocRef, subscriptionData);

    // 4.3. Initial institution document
    const institutionCollectionRef = collection(firestore, `users/${user.uid}/institutions`);
    const institutionDocRef = doc(institutionCollectionRef); // Create a reference with a new auto-generated ID
    const institutionData = {
        name: data.school.name,
        hourlyRate: data.school.hourlyRate,
        color: schoolColors[0] // Assign first color by default
    };
    batch.set(institutionDocRef, institutionData);

    // 4.4. Mandatory pots
    const vacationPotRef = doc(firestore, `users/${user.uid}/pots/ferias`);
    const thirteenthPotRef = doc(firestore, `users/${user.uid}/pots/13salario`);

    batch.set(vacationPotRef, {
        name: "Férias 🏖️",
        type: "Mandatory",
        virtualBalance: 0,
        goal: 0, // Will be calculated later
        allocationPercentage: 10,
    });

    batch.set(thirteenthPotRef, {
        name: "Meu 13º 🎁",
        type: "Mandatory",
        virtualBalance: 0,
        goal: 1500, // Default goal
        allocationPercentage: 10,
    });

    // 5. Commit the batch
    await batch.commit();

    // 6. Set auth token cookie
    const idToken = await user.getIdToken();
    document.cookie = `firebase-auth-token=${idToken}; path=/; max-age=86400`; // 24 hours

    return user;
}
