import { initializeApp } from "@firebase/app";
import {
	collection,
	type DocumentData,
	getDocs,
	getFirestore,
	limit,
	orderBy,
	query,
	type QueryConstraint,
	startAfter,
	Timestamp,
	where,
} from "@firebase/firestore";
import type { MurzfeedPost, PostsQueryOptions } from "~/types";

const firebaseConfig = {
	projectId: "mfeed-c43b1",
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);

// Post document type based on Firestore structure
// Convert Firestore document to simplified Post type
const convertDocumentToPost = (doc: DocumentData): MurzfeedPost => {
	const data = doc.data();
	return {
		id: doc.id,
		title: data.title || "",
		content: data.content || "",
		postId: data.postId || "",
		username: data.username || "",
		uid: data.uid || "",
		createdAt: data.createdAt?.toDate() || new Date(),
		latestCommentCreatedAt: data.latestCommentCreatedAt?.toDate() || new Date(),
		published: data.published || false,
		isDelete: data.isDelete || false,
		isNewsletter: data.isNewsletter || false,
		postCategory: data.postCategory || [],
		pawCount: Number.parseInt(data.pawCount, 10) || 0,
		scratchCount: Number.parseInt(data.scratchCount, 10) || 0,
		commentsCount: Number.parseInt(data.commentsCount, 10) || 0,
		repliesCount: Number.parseInt(data.repliesCount, 10) || 0,
		viewCount: Number.parseInt(data.viewCount, 10) || 0,
		titleSlug: data.titleSlug || "",
		imageURL: data.imageURL || [],
		userDetail: data.userDetail || [],
		reference: data.reference || "",
	};
};

export const firebaseFetcher = async (
	options: PostsQueryOptions = {},
): Promise<MurzfeedPost[]> => {
	try {
		const {
			includeAllCategories = false,
			orderByField = "createdAt",
			orderDirection = "desc",
			limitCount = 10,
			startAfterValues,
			searchTerm,
		} = options;

		const constraints: QueryConstraint[] = [
			where("published", "==", true),
			where("isDelete", "==", false),
			where("isNewsletter", "==", false),
		];

		// Add category filter if not including all categories
		if (!includeAllCategories) {
			const allowedCategories = [
				"Company shutdown",
				"New company/startup",
				"WFA/WFO",
				"Work Experience",
				"Management info",
				"Layoff",
				"Employee benefit",
				"Product",
				"Acquisition/merger",
				"New funding",
			];
			constraints.push(
				where("postCategory", "array-contains-any", allowedCategories),
			);
		}

		// Add ordering first, then pagination
		if (searchTerm) {
			constraints.push(
				where("titleSlug", ">=", searchTerm),
				where("titleSlug", "<=", `${searchTerm}~`),
			);
			constraints.push(orderBy("titleSlug", "asc"));
			constraints.push(orderBy("__name__", "asc"));
		} else {
			constraints.push(orderBy(orderByField, orderDirection));
			constraints.push(orderBy("__name__", orderDirection));

			// Add pagination after ordering - use timestamp and id for proper cursor
			if (startAfterValues) {
				const timestamp = Timestamp.fromDate(startAfterValues.timestamp);
				constraints.push(startAfter(timestamp, startAfterValues.id));
			}
		}

		constraints.push(limit(limitCount));

		const postsQuery = query(collection(db, "posts"), ...constraints);
		const snapshot = await getDocs(postsQuery);

		return snapshot.docs.map(convertDocumentToPost);
	} catch (error) {
		console.error("Firebase fetcher error:", error);
		throw error;
	}
};
