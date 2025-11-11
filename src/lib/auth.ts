
'use client';

import { Auth, createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { Firestore, doc, writeBatch } from "firebase/firestore";

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

    // 3. Create a batch write to save all data to Firestore atomically
    const batch = writeBatch(firestore);

    // 3.1. User profile document
    const userDocRef = doc(firestore, "users", user.uid);
    const userProfileData = {
        name: data.name,
        email: data.email,
        dasDueDate: data.dasDueDate,
        streakDays: 0,
        xpTotal: 0,
    };
    batch.set(userDocRef, userProfileData);

    // 3.2. Initial institution document
    const institutionDocRef = doc(firestore, `users/${user.uid}/institutions`, doc(firestore, `users/${user.uid}/institutions`).id);
    const institutionData = {
        name: data.school.name,
        hourlyRate: data.school.hourlyRate,
        color: schoolColors[0] // Assign first color by default
    };
    batch.set(institutionDocRef, institutionData);

    // 3.3. Mandatory pots
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

    // 4. Commit the batch
    await batch.commit();

    // 5. Set auth token cookie
    const idToken = await user.getIdToken();
    document.cookie = `firebase-auth-token=${idToken}; path=/; max-age=86400`; // 24 hours

    return user;
}
