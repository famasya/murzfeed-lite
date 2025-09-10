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
export interface MurzfeedPost {
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

export interface FomoPostsResponse {
	data: Array<{
		voteFlag?: number;
		notificationEnabled?: boolean;
		bookmarked?: boolean;
		bookmarkActivityId: unknown;
		headerType?: string;
		inner: {
			imageUrl?: string;
			tax?: string;
			promoted?: boolean;
			channelId: unknown;
			channel?: {
				curated: boolean;
				label: string;
				name: string;
				value: unknown;
				id: unknown;
				imageUrl: string;
				userCount: number;
				color: string;
			};
			pollOptions?: Array<unknown>;
			content?: string;
			title?: string;
			marketingConsented?: boolean;
			type: string;
			edited?: boolean;
			activityId: number;
			modifiedTime?: string;
			banned: boolean;
			deleted: boolean;
			numberOfLikes?: number;
			numberOfComments?: number;
			numberOfDislikes?: number;
			creationTime?: string;
			user?: {
				id: number;
				username?: string;
				companyId: number;
				companyName: string;
				profilePictureUrl?: string;
				reputationImageUrl?: string;
				subscription: string;
				jobPostActivityId: unknown;
				reputationLevel: number;
				gender?: string;
				needReverification: boolean;
				talentPostActivityId: unknown;
			};
			linkingUrl?: string;
			ctaCopy?: string;
			aspectRatioMultiplier?: number;
			jobTitle?: {
				value: string;
				id: number;
			};
			yearsOfExperience?: number;
			roleLevel: unknown;
			baseMonthlySalaryInRupiah?: number;
			annualBonusInRupiah: unknown;
			annualMarketPriceEquityInRupiah: unknown;
			allowances?: Array<unknown>;
			numberOfViews?: number;
			numberOfClicks?: number;
			buttonCta?: string;
			targetRoute?: string;
			targetRouteParams?: {
				company: {
					name: string;
					id: number;
					totalSalaries: number;
					totalReviews: number;
					imageUrl: string;
					ratings: number;
				};
			};
		};
		liked?: boolean;
		disliked?: boolean;
		blurred?: boolean;
	}>;
}

export interface FomoCommentsResponse {
	data: Array<{
		dislikedChildCommentIds: Array<unknown>;
		likedChildCommentIds: Array<unknown>;
		blockedUserIds: Array<unknown>;
		userBlockerIds: Array<unknown>;
		inner: {
			value: string;
			parentActivityId: number;
			comments: Array<{
				value: string;
				parentActivityId: number;
				comments: Array<unknown>;
				rootActivityId: number;
				type: string;
				edited: boolean;
				activityId: number;
				modifiedTime: unknown;
				banned: boolean;
				deleted: boolean;
				numberOfLikes: number;
				numberOfComments: number;
				numberOfDislikes: number;
				creationTime: string;
				user: {
					id: number;
					username: string;
					companyId: number;
					companyName: string;
					profilePictureUrl?: string;
					reputationImageUrl: string;
					subscription: string;
					jobPostActivityId: unknown;
					reputationLevel: number;
					gender: string;
					needReverification: boolean;
					talentPostActivityId: unknown;
				};
			}>;
			rootActivityId: number;
			type: string;
			edited: boolean;
			activityId: number;
			modifiedTime: unknown;
			banned: boolean;
			deleted: boolean;
			numberOfLikes: number;
			numberOfComments: number;
			numberOfDislikes: number;
			creationTime: string;
			user: {
				id: number;
				username: string;
				companyId: number;
				companyName: string;
				profilePictureUrl: string;
				reputationImageUrl: string;
				subscription: string;
				jobPostActivityId: unknown;
				reputationLevel: number;
				gender: string;
				needReverification: boolean;
				talentPostActivityId: unknown;
			};
		};
		liked: boolean;
		disliked: boolean;
	}>;
	meta: {
		relatedCompanies: Array<{
			name: string;
			id: number;
			totalSalaries: number;
			totalReviews: number;
			imageUrl: string;
			ratings: number;
		}>;
	};
}

export type FomoComment =
	FomoCommentsResponse["data"][number]["inner"]["comments"][number];

export interface FomoSearchResults {
	data: Array<{
		key?: number;
		banned?: boolean;
		deleted?: boolean;
		surveyQuestionIdToVoteFlag?: unknown;
		voteFlag?: number;
		notificationEnabled?: boolean;
		bookmarked?: boolean;
		bookmarkActivityId: unknown;
		headerType?: string;
		inner: {
			imageUrl?: string;
			tax?: string;
			promoted?: boolean;
			channelId?: number;
			channel?: {
				curated: boolean;
				label: string;
				name: string;
				value?: number;
				id?: number;
				imageUrl: string;
				userCount: number;
				color: string;
				creator?: {
					id: number;
					username: string;
					companyId: number;
					companyName: string;
					profilePictureUrl: string;
					reputationImageUrl: string;
					subscription: string;
					jobPostActivityId: unknown;
					reputationLevel: number;
					gender: string;
					needReverification: boolean;
					talentPostActivityId: unknown;
				};
				description?: string;
			};
			pollOptions?: Array<{
				flag: number;
				text: string;
				votes: number;
			}>;
			content: string;
			title: string;
			marketingConsented?: boolean;
			type: string;
			edited?: boolean;
			activityId: number;
			modifiedTime?: string;
			banned: boolean;
			deleted: boolean;
			numberOfLikes?: number;
			numberOfComments?: number;
			numberOfDislikes?: number;
			creationTime?: string;
			user?: {
				id: number;
				username?: string;
				companyId: number;
				companyName: string;
				profilePictureUrl: string;
				reputationImageUrl?: string;
				subscription: string;
				jobPostActivityId: unknown;
				reputationLevel: number;
				gender?: string;
				needReverification: boolean;
				talentPostActivityId: unknown;
			};
			linkingUrl?: string;
			ctaCopy?: string;
			aspectRatioMultiplier?: number;
			buttonCta?: string;
			targetRoute?: string;
			targetRouteParams?: {
				company: {
					name: string;
					id: number;
					totalSalaries: number;
					totalReviews: number;
					imageUrl: string;
					ratings: number;
				};
			};
		};
		liked?: boolean;
		disliked?: boolean;
	}>;
	meta: unknown;
}

export interface FomoSinglePost {
	key: number;
	banned: boolean;
	deleted: boolean;
	surveyQuestionIdToVoteFlag: unknown;
	voteFlag: number;
	notificationEnabled: boolean;
	bookmarked: boolean;
	bookmarkActivityId: unknown;
	headerType: string;
	inner: {
		imageUrl: unknown;
		tax: string;
		promoted: boolean;
		channelId: unknown;
		channel: {
			curated: boolean;
			label: string;
			name: string;
			value: unknown;
			id: unknown;
			imageUrl: string;
			userCount: number;
			color: string;
		};
		pollOptions: Array<unknown>;
		content: string;
		title: string;
		marketingConsented: boolean;
		type: string;
		edited: boolean;
		activityId: number;
		modifiedTime: string;
		banned: boolean;
		deleted: boolean;
		numberOfLikes: number;
		numberOfComments: number;
		numberOfDislikes: number;
		creationTime: string;
		user: {
			id: number;
			username: string;
			companyId: number;
			companyName: string;
			profilePictureUrl: string;
			reputationImageUrl: string;
			subscription: string;
			jobPostActivityId: unknown;
			reputationLevel: number;
			gender: string;
			needReverification: boolean;
			talentPostActivityId: unknown;
		};
	};
	liked: boolean;
	disliked: boolean;
}
