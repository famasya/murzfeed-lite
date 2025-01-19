export type Posts = Array<{
  document?: {
    name: string
    fields: {
      imageURL: {
        arrayValue: {
          values?: Array<{
            stringValue: string
          }>
        }
      }
      content: {
        stringValue: string
      }
      fileURL: {
        stringValue: string
      }
      isAnonymous: {
        booleanValue: boolean
      }
      isDelete: {
        booleanValue: boolean
      }
      isNewsletter: {
        booleanValue: boolean
      }
      pawCount: {
        integerValue: string
      }
      postCategory: {
        arrayValue: {
          values: Array<{
            stringValue: string
          }>
        }
      }
      postContentContainsCurseFlag: {
        booleanValue: boolean
      }
      postFeedImpressionCount: {
        integerValue: string
      }
      postId: {
        stringValue: string
      }
      postTitleContainsCurseFlag: {
        booleanValue: boolean
      }
      published: {
        booleanValue: boolean
      }
      repliesCount?: {
        integerValue: string
      }
      scratchCount: {
        integerValue: string
      }
      spillContentFlag: {
        booleanValue: boolean
      }
      title: {
        stringValue: string
      }
      titleSlug: {
        stringValue: string
      }
      uid: {
        stringValue: string
      }
      username: {
        stringValue: string
      }
      reference: {
        stringValue: string
      }
      viewCount: {
        integerValue: string
      }
      reportCount: {
        integerValue: string
      }
      industryType: {
        nullValue: string | null;
      }
      userDetail: {
        arrayValue: {
          values: Array<{
            mapValue: {
              fields: {
                userId: {
                  stringValue: string
                }
                photoURL: {
                  stringValue: string
                }
              }
            }
          }>
        }
      }
      createdAt: {
        timestampValue: string
      }
      publishAt: {
        timestampValue: string
      }
      endAt: {
        timestampValue: string
      }
      startAt: {
        timestampValue: string
      }
      updatedAt: {
        timestampValue: string
      }
      latestCommentCreatedAt: {
        timestampValue: string
      }
      commentsCount: {
        integerValue: string
      }
      takedownReason?: {
        stringValue: string
      }
      isDeleteByAdmin?: {
        booleanValue: boolean
      }
      takedownUserId?: {
        stringValue: string
      }
      takedownTimestamp?: {
        timestampValue: string
      }
    }
    createTime: string
    updateTime: string
  }
  readTime: string
}>
