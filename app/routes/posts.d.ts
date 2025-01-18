export type PostsResponse = {
  documents: Array<{
    name: string
    fields: {
      postFeedImpressionCount: {
        integerValue: string
      }
      fileURL: {
        stringValue: string
      }
      isNewsletter: {
        booleanValue: boolean
      }
      industryType: {
        nullValue: string
      }
      postContentContainsCurseFlag: {
        booleanValue: boolean
      }
      reference: {
        stringValue: string
      }
      commentsCount: {
        integerValue: string
      }
      postId: {
        stringValue: string
      }
      updatedAt: {
        timestampValue: string
      }
      content: {
        stringValue: string
      }
      startAt: {
        timestampValue: string
      }
      scratchCount: {
        integerValue: string
      }
      imageURL: {
        arrayValue: {
          values?: Array<{
            stringValue: string
          }>
        }
      }
      titleSlug: {
        stringValue: string
      }
      endAt: {
        timestampValue: string
      }
      pawCount: {
        integerValue: string
      }
      publishAt: {
        timestampValue: string
      }
      reportCount: {
        integerValue: string
      }
      viewCount: {
        integerValue: string
      }
      isDelete: {
        booleanValue: boolean
      }
      repliesCount: {
        integerValue: string
      }
      isAnonymous: {
        booleanValue: boolean
      }
      userDetail: {
        arrayValue?: {
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
        mapValue?: {
          fields: {
            photoURL: {
              stringValue: string
            }
            userId: {
              stringValue: string
            }
          }
        }
      }
      published: {
        booleanValue: boolean
      }
      title: {
        stringValue: string
      }
      postCategory: {
        arrayValue: {
          values: Array<{
            stringValue: string
          }>
        }
      }
      username: {
        stringValue: string
      }
      createdAt: {
        timestampValue: string
      }
      spillContentFlag: {
        booleanValue: boolean
      }
      latestCommentCreatedAt: {
        timestampValue: string
      }
      uid: {
        stringValue: string
      }
      postTitleContainsCurseFlag: {
        booleanValue: boolean
      }
      takedownUserId?: {
        stringValue: string
      }
      isDeleteByAdmin?: {
        booleanValue: boolean
      }
      takedownTimestamp?: {
        timestampValue: string
      }
      takedownReason?: {
        stringValue: string
      }
      reportCategory?: {
        arrayValue: {
          values: Array<{
            stringValue: string
          }>
        }
      }
      deleteAt?: {
        timestampValue: string
      }
      deleteAdminReason?: {
        stringValue: string
      }
    }
    createTime: string
    updateTime: string
  }>
  nextPageToken: string
}

export type PostResponse = Array<{
  document?: {
    name: string
    fields: {
      content: {
        stringValue: string
      }
      fileURL: {
        stringValue: string
      }
      imageURL: {
        arrayValue?: {
          values?: Array<{
            stringValue: string
          }>
        }
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
      repliesCount: {
        integerValue: string
      }
    }
    createTime: string
    updateTime: string
  }
  readTime: string
}>

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
      repliesCount: {
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
