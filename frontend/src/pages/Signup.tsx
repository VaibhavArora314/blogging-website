import { Link, useNavigate } from "react-router-dom";
import Card from "../components/Card";
import { useMemo, useState } from "react";
import Input from "../components/Input";
import Button from "../components/Button";
import { InputField } from "../utils/types";
import { signUpType } from "@vaibhav314/blogging-common";
import axios, { AxiosError } from "axios";
import useAuthState from "../state/useAuthState";

const SignUp = () => {
  const [inputData, setInputData] = useState<signUpType>({
    email: "",
    username: "",
    password: "",
    image: undefined,
  });
  const [errors, setErrors] = useState<
    Partial<
      Pick<signUpType, "email" | "username" | "password"> & {
        image: string;
        other: string;
      }
    >
  >({});
  const {fetchUser} = useAuthState();
  const navigate = useNavigate();

  const fields: InputField[] = useMemo<InputField[]>(
    () => [
      {
        id: "username",
        label: "Your username",
        type: "text",
        placeholder: "John Doe",
        required: true,
        handleOnChange: (target) => {
          setInputData((val) => {
            val.username = target.value;
            return val;
          });
        },
      },
      {
        id: "email",
        label: "Your email",
        type: "email",
        placeholder: "name@company.com",
        required: true,
        handleOnChange: (target) => {
          setInputData((val) => {
            val.email = target.value;
            return val;
          });
        },
      },
      {
        id: "password",
        label: "Password",
        type: "password",
        placeholder: "••••••••",
        required: true,
        handleOnChange: (target) => {
          setInputData((val) => {
            val.password = target.value;
            return val;
          });
        },
      },
    ],
    [setInputData]
  );

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setInputData((val) => {
        val.image = file;
        return val;
      });
    }
  };

  const handleSubmit = async () => {
    try {
      const formData = new FormData();
      formData.append("email", inputData.email);
      formData.append("username", inputData.username);
      formData.append("password", inputData.password);
      if (inputData.image) {
        formData.append("image", inputData.image);
      }

      const response = await axios.post("/api/v1/user/signup", formData);

      const data = response.data;
      const token = data?.token;
      localStorage.setItem("token", token);
      fetchUser();
      navigate("/");
    } catch (error) {
      const e = error as AxiosError<{
        error: Pick<signUpType, "email" | "username" | "password"> & {
          image: string;
          other: string;
        };
      }>;
      console.log(e.response?.data.error);
      setErrors(
        e.response?.data?.error || {
          other: "An unexpected error occurred",
        }
      );
    }
  };

  return (
    <Card>
      <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
      <Link to="/" className="flex flex-col justify-center items-center">
          <img src="/logo.png" alt="Logo" width="42" height="42" />
        </Link>
        <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl text-center">
          Create your account
        </h1>
        <form
          className="space-y-4 md:space-y-6"
          onSubmit={(e) => {
            e.preventDefault();
          }}
        >
          {fields.map((field) => (
            <Input
              key={field.id}
              {...field}
              error={
                errors[field.id as "username" | "email" | "password"] || ""
              }
            />
          ))}
          <div className="flex flex-col items-start space-y-2">
            <label
              htmlFor="image"
              className="block text-gray-900 text-sm font-medium mb-2"
            >
              Upload Profile Picture
            </label>
            <input
              type="file"
              id="image"
              accept="image/*"
              onChange={handleImageChange}
              className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5"
            />
            {errors.image && (
              <p className="block my-2 text-sm font-medium text-red-400">
                {errors.image}
              </p>
            )}
          </div>
          {errors.other && (
            <p className="block my-2 text-sm font-medium text-red-400 text-center">
              {errors.other}
            </p>
          )}
          <Button
            type="submit"
            label={"Sign Up"}
            onClick={handleSubmit}
            fontBold
            fullWidth
          />
          <p className="text-sm font-light text-gray-500">
            Already have an account?{" "}
            <Link
              to="/signin"
              className="font-medium text-primary-600 hover:underline"
            >
              Sign In
            </Link>
          </p>
        </form>
      </div>
    </Card>
  );
};

export default SignUp;
