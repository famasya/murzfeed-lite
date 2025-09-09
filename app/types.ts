import type { OrderByDirection } from "@firebase/firestore";

export interface PostDocument {
	name: string;
	fields: {
		imageURL: {
			arrayValue: {
				values?: Array<{ stringValue: string }>;
			};
		};
		content: { stringValue: string };
		fileURL: { stringValue: string };
		isAnonymous: { booleanValue: boolean };
		isDelete: { booleanValue: boolean };
		isNewsletter: { booleanValue: boolean };
		pawCount: { integerValue: string };
		postCategory: {
			arrayValue: {
				values: Array<{ stringValue: string }>;
			};
		};
		postContentContainsCurseFlag: { booleanValue: boolean };
		postFeedImpressionCount: { integerValue: string };
		postId: { stringValue: string };
		postTitleContainsCurseFlag: { booleanValue: boolean };
		published: { booleanValue: boolean };
		repliesCount?: { integerValue: string };
		scratchCount: { integerValue: string };
		spillContentFlag: { booleanValue: boolean };
		title: { stringValue: string };
		titleSlug: { stringValue: string };
		uid: { stringValue: string };
		username: { stringValue: string };
		reference: { stringValue: string };
		viewCount: { integerValue: string };
		reportCount: { integerValue: string };
		industryType: { nullValue: string | null };
		userDetail: {
			arrayValue: {
				values: Array<{
					mapValue: {
						fields: {
							userId: { stringValue: string };
							photoURL: { stringValue: string };
						};
					};
				}>;
			};
		};
		createdAt: { timestampValue: string };
		publishAt: { timestampValue: string };
		endAt: { timestampValue: string };
		startAt: { timestampValue: string };
		updatedAt: { timestampValue: string };
		latestCommentCreatedAt: { timestampValue: string };
		commentsCount: { integerValue: string };
		takedownReason?: { stringValue: string };
		isDeleteByAdmin?: { booleanValue: boolean };
		takedownUserId?: { stringValue: string };
		takedownTimestamp?: { timestampValue: string };
	};
	createTime: string;
	updateTime: string;
}

// Simplified Post type for easier usage
export interface Post {
	id: string;
	title: string;
	content: string;
	postId: string;
	username: string;
	uid: string;
	createdAt: Date;
	latestCommentCreatedAt: Date;
	published: boolean;
	isDelete: boolean;
	isNewsletter: boolean;
	postCategory: string[];
	pawCount: number;
	scratchCount: number;
	commentsCount: number;
	repliesCount: number;
	viewCount: number;
	titleSlug: string;
	imageURL: string[];
	userDetail: Array<{
		userId: string;
		photoURL: string;
	}>;
	reference: string;
}

export interface PostsQueryOptions {
	includeAllCategories?: boolean;
	orderByField?: "createdAt" | "latestCommentCreatedAt";
	orderDirection?: OrderByDirection;
	limitCount?: number;
	startAfterValues?: {
		timestamp: Date;
		id: string;
	};
	searchTerm?: string;
}
