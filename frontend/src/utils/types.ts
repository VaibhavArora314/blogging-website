export interface IUser {
  id: string;
  username: string;
  profilePicture: string;
  createdAt: string;
}

export interface IUserProfile extends IUser {
  blogs: IBlog[]
}

export interface IBlog {
  id: string;
  title: string;
  content: string;
  bannerImage: string;
  author: IUser;
  createdAt: string,
  updatedAt: string,
  comments: IComment[] | null,
  totalLikes: number,
  isLiked: boolean
}

export interface IComment {
  id: string;
  content: string;
  author: IUser;
  createdAt: string;
}

export interface InputField {
  label: string;
  type: string;
  id: string;
  placeholder: string;
  required?: boolean;
  handleOnChange: (target: HTMLInputElement) => void;
}
