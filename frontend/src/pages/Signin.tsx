import { Link } from "react-router-dom";
import Card from "../components/Card";
import { useMemo, useState } from "react";
import Input from "../components/Input";
import Button from "../components/Button";
import { InputField } from "../utils/types";

const SignIn = () => {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");

  const fields: InputField[] = useMemo<InputField[]>(
    () => [
      {
        id: "email",
        label: "Your email",
        type: "email",
        placeholder: "name@company.com",
        required: true,
        handleOnChange: (target) => {
          setEmail(target.value);
        },
      },
      {
        id: "password",
        label: "Password",
        type: "password",
        placeholder: "••••••••",
        required: true,
        handleOnChange: (target) => {
          setPassword(target.value);
        },
      },
    ],
    [setEmail, setPassword]
  );

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
  };

  return (
    <Card>
      <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
        <div>
          <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl text-center mb-2">
            Welcome Back!
          </h1>
          <p className="text-md font-light text-gray-800 md:text-lg text-center">
            Sign in to your account
          </p>
        </div>
        <form className="space-y-4 md:space-y-6" onSubmit={handleSubmit}>
          {fields.map((field) => (
            <Input key={field.id} {...field} error={""} />
          ))}
          {/* {errors.other && (
            <p className="block my-2 text-sm font-medium text-red-400 text-center">
              {errors.other}
            </p>
          )} */}

          <Button
            type="submit"
            label={"Sign In"}
            onClick={() => {}}
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
