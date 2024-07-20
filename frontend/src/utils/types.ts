export interface IUser {
  id: string;
  username: string;
  email: string;
  profilePicture: string;
}

export interface IBlog {
  id: string;
  title: string;
  content: string;
  bannerImage: string;
  category: string;
  author: IUser;
  createdAt: string,
  updatedAt: string,
}

export interface InputField {
  label: string;
  type: string;
  id: string;
  placeholder: string;
  required?: boolean;
  handleOnChange: (target: HTMLInputElement) => void;
}
