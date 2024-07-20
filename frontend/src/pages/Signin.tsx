import { Link, useNavigate } from "react-router-dom";
import Card from "../components/Card";
import { useMemo, useState } from "react";
import Input from "../components/Input";
import Button from "../components/Button";
import { InputField } from "../utils/types";
import { signInType } from "@vaibhav314/blogging-common";
import axios, { AxiosError } from "axios";
import useAuthState from "../state/useAuthState";

const SignIn = () => {
  const [inputData, setInputData] = useState<signInType>({
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState<
    Partial<
      signInType & {
        other: string;
      }
    >
  >({});
  const { fetchUser } = useAuthState();
  const navigate = useNavigate();

  const fields: InputField[] = useMemo<InputField[]>(
    () => [
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

  const handleSubmit = async () => {
    try {
      const response = await axios.post("/api/v1/user/signin", inputData);

      const data = response.data;
      const token = data?.token;
      localStorage.setItem("token", token);
      fetchUser();
      navigate("/");
    } catch (error) {
      const e = error as AxiosError<{
        error: signInType & {
          other: string;
        };
      }>;
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
        <div>
          <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl text-center mb-2">
            Welcome Back!
          </h1>
          <p className="text-md font-light text-gray-800 md:text-lg text-center">
            Sign in to your account
          </p>
        </div>
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
              error={errors[field.type as keyof signInType] || ""}
            />
          ))}
          {errors.other && (
            <p className="block my-2 text-sm font-medium text-red-400 text-center">
              {errors.other}
            </p>
          )}

          <Button
            type="submit"
            label={"Sign In"}
            onClick={handleSubmit}
            fullWidth
            fontBold
          />

          <p className="text-sm font-light text-gray-500">
            Don't have an account yet?{" "}
            <Link
              to="/signup"
              className="font-medium text-primary-600 hover:underline"
            >
              Sign Up
            </Link>
          </p>
        </form>
      </div>
    </Card>
  );
};

export default SignIn;
