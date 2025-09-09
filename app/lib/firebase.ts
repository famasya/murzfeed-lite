import { initializeApp } from "@firebase/app";
import { getFirestore } from "@firebase/firestore";

const firebaseConfig = {
	projectId: "mfeed-c43b1",
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
