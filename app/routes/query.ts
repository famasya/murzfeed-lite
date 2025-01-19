export const defaultQuery = {
  structuredQuery: {
    from: [
      {
        collectionId: "posts"
      }
    ],
    where: {
      compositeFilter: {
        op: "AND",
        filters: [
          {
            fieldFilter: {
              field: {
                fieldPath: "postCategory"
              },
              op: "ARRAY_CONTAINS_ANY",
              value: {
                arrayValue: {
                  values: [
                    {
                      stringValue: "Company shutdown"
                    },
                    {
                      stringValue: "New company/startup"
                    },
                    {
                      stringValue: "WFA/WFO"
                    },
                    {
                      stringValue: "Work Experience"
                    },
                    {
                      stringValue: "Management info"
                    },
                    {
                      stringValue: "Layoff"
                    },
                    {
                      stringValue: "Employee benefit"
                    },
                    {
                      stringValue: "Product"
                    },
                    {
                      stringValue: "Acquisition/merger"
                    },
                    {
                      stringValue: "New funding"
                    }
                  ]
                }
              }
            }
          },
          {
            fieldFilter: {
              field: {
                fieldPath: "published"
              },
              op: "EQUAL",
              value: {
                booleanValue: true
              }
            }
          },
          {
            fieldFilter: {
              field: {
                fieldPath: "isDelete"
              },
              op: "EQUAL",
              value: {
                booleanValue: false
              }
            }
          },
          {
            fieldFilter: {
              field: {
                fieldPath: "isNewsletter"
              },
              op: "EQUAL",
              value: {
                booleanValue: false
              }
            }
          }
        ]
      }
    },
    orderBy: [
      {
        field: {
          fieldPath: "createdAt"
        },
        direction: "DESCENDING"
      },
      {
        field: {
          fieldPath: "__name__"
        },
        direction: "DESCENDING"
      }
    ],
    limit: 10
  },
  parent: "projects/mfeed-c43b1/databases/(default)/documents"
};

export const searchQuery = (query: string) => ({
  structuredQuery: {
    from: [
      {
        collectionId: "posts"
      }
    ],
    where: {
      compositeFilter: {
        op: "AND",
        filters: [
          {
            fieldFilter: {
              field: {
                fieldPath: "published"
              },
              op: "EQUAL",
              value: {
                booleanValue: true
              }
            }
          },
          {
            fieldFilter: {
              field: {
                fieldPath: "isDelete"
              },
              op: "EQUAL",
              value: {
                booleanValue: false
              }
            }
          },
          {
            fieldFilter: {
              field: {
                fieldPath: "isNewsletter"
              },
              op: "EQUAL",
              value: {
                booleanValue: false
              }
            }
          }
        ]
      }
    },
    orderBy: [
      {
        field: {
          fieldPath: "titleSlug"
        },
        direction: "ASCENDING"
      },
      {
        field: {
          fieldPath: "__name__"
        },
        direction: "ASCENDING"
      }
    ],
    limit: 10,
    startAt: {
      before: true,
      values: [
        {
          stringValue: query
        }
      ]
    },
    endAt: {
      before: false,
      values: [
        {
          stringValue: `${query}~`
        }
      ]
    }
  }
})
