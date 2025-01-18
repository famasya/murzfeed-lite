export type CommentsResponse = Array<{
  document?: {
    name: string
    fields: {
      commentId: {
        stringValue: string
      }
      postId: {
        stringValue: string
      }
      postTitle: {
        stringValue: string
      }
      postCreatorUsername: {
        stringValue: string
      }
      userProfileUid: {
        stringValue: string
      }
      username: {
        stringValue: string
      }
      content: {
        stringValue: string
      }
      isDelete: {
        booleanValue: boolean
      }
      pawCount: {
        integerValue: string
      }
      scratchCount: {
        integerValue: string
      }
      repliesCount: {
        integerValue: string
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
      reportCount: {
        integerValue: string
      }
      commentContentContainsCurseFlag: {
        booleanValue: boolean
      }
      titleSlug: {
        stringValue: string
      }
      isCommenterSetAnonymous: {
        booleanValue: boolean
      }
      isCommenterPostStarter: {
        booleanValue: boolean
      }
      commentSlug: {
        stringValue: string
      }
      createdAt: {
        timestampValue: string
      }
      updatedAt: {
        timestampValue: string
      }
    }
    createTime: string
    updateTime: string
  }
  readTime: string
}>

export type Replies = {
  documents: Array<{
    name: string
    fields: {
      commentContent: {
        stringValue: string
      }
      commentId: {
        stringValue: string
      }
      commentUsername: {
        stringValue: string
      }
      updatedAt: {
        timestampValue: string
      }
      postCreatorUsername: {
        stringValue: string
      }
      replyCreatorUsername: {
        stringValue: string
      }
      isDelete: {
        booleanValue: boolean
      }
      postTitle: {
        stringValue: string
      }
      reportCount: {
        integerValue: string
      }
      isReplierPostStarter: {
        booleanValue: boolean
      }
      pawCount: {
        integerValue: string
      }
      postId: {
        stringValue: string
      }
      isReplierSetAnonymous: {
        booleanValue: boolean
      }
      scratchCount: {
        integerValue: string
      }
      commentSlug: {
        stringValue: string
      }
      replyCreatorId: {
        stringValue: string
      }
      replyContentContainsCurseFlag: {
        booleanValue: boolean
      }
      reply: {
        stringValue: string
      }
      titleSlug: {
        stringValue: string
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
      replyId: {
        stringValue: string
      }
    }
    createTime: string
    updateTime: string
  }>
}

