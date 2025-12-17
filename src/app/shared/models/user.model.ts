export interface User {
    name: string,
    username: string,
    email: string,
    contact: number,
    department: string,
    password: string,
    profile_image: string,
    role: string
}

export interface Post {
  id: string;
  name: string;
  description: string;
  votedStatus: boolean;
  metadata: { genre: string, theme: string }[];
  ageRating: number;
}


export interface Notification {
  id: string;
  name: string;
  description: string;
  
}

export interface GetAllNotificationResponse {
  getAllNotifications: {
    getAllNotifications: Notification[];
    totalCount: number;
  };
}
