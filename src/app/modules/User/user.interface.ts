export type TDeviceLogin = {
  deviceInfo: string;
  systemId: string;
  userIp: string;
  isDeleted: boolean;
  createdAt: Date;
};

export type Tuser = {
  name: string;
  phone: string;
  city: string;
  pin: number;
  email?: string;
  propileImageUrl?: string;
  paymentStatus: "paid" | "unPaid";
  status: "Active" | "Disabled" | "Block" | "Passed";
  role: "Admin" | "Student";
  isDeleted: true | false;
  group: string; //"Free"
  note?: string;
  paymantNote?: string;
  // coursesTime?: TCoursesTime[];
  deviceLogin?: TDeviceLogin[];
  logInAttempt?: number;
};
export type TLoginuser = {
  phone: string;
  pin: number;
  deviceInfo: string;
  systemId: string;
  userIp: string;
};

export type TUserLogs = {
  method: "GET" | "POST" | "PUT" | "DELETE" | "PATCH" | "UNKNOWN_METHOD";
  url: string;
  statusCode: number;
  ipAddress: string;
  userAgent: string;
  responseTimeMs: number;
  systemId: string;
  userId: string;
  phone: string;
  clientReqData: {
    req: Record<string, any>;
    query: Record<string, any>;
    params: Record<string, any>;
  };
  clientResData: Record<string, any>;
};
