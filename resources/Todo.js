const TodoList = [
  {
    serial: 1,
    title: "user permission and track collection",
    description: "User Permission collection",
    status: "design",
    priority: "mid",
    assignedTo: "Sayedul",
    dueDate: "2024-12-25",
    tags: ["user", "permission", "collection"],
    process: [
      {
        id: 1,
        step: "model design",
        model: [
          {
            userId: {
              type: "ObjectId",
              ref: "User",
              logic: [
                "- user will be connected through userId",
                "- For every user there will be a user permission collection",
              ],
            },
            permitIps: {
              type: "Array",
              default: ["ip"], //["103.135.90.41","58.145.187.238","0.0.0.0"]
              logic: [
                "- Ip adress will be stored in permitIps array",
                "- It only use for user auth middleware and for admin user for now",
                "- It will be also can be use for normal user to verify them using their ip address which stored in login time",
                "- Only those ip will be can be acess whcih is stored in permitIps array",
                "- in special case we can store 0.0.0.0 for access from any ip",
                "- Later should implement to handle user Ip handle from admin panel to Add Remove Ip",
              ],
            },
            active: {
              type: "Boolean",
              default: false,
              logic: [
                "- If user is active then it will be true",
                "- If user is not active then it will be false",
                "- Active mean user using the website",
                "- It will implement from client side modification",
              ],
            },
            uniqDevices: [
              {
                ip: {
                  type: "String",
                  required: true,
                },
                forwaredIp: {
                  type: "String",
                  required: true,
                },
                userAgent: {
                  type: "String",
                  required: true,
                },
                accessFrom: {
                  type: "String", // web/Android-1/Android-2-/IOS-1/IOS-2
                  required: true,
                },

                logic: [
                  "- It will store the uniq devices of user",
                  "- It will store the ip address of user",
                  "- It will store the forwared ip address of user",
                  "- It will store the userAgent of user",
                  "- It will store the accessFrom of user",
                  "- when user login from website accessFrom will be web and for mobile it will be mobile and will create the one uniqDevices",
                  "- When user hit a auth middleware API then it will check is their uniqDevices ele found in user uniqDevices array using forwaredIp and useragents [pre]",
                  "- If found then it will be pass the request's",
                  "- If not found then it will be check is their forwaredIp ",
                ],
                issues: [
                  "- forwaredIp can be chnage but userAgent can be same",
                  "- userAgent can be chnage but forwaredIp can be same",
                ],
              },
            ],
          },
        ],
      },
    ],
  },
];
