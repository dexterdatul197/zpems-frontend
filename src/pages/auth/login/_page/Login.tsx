//@ts-nocheck
import React from "react";
import { useNavigate, useActionData, Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

import { Form } from "@/components/ui/form";

import { login } from "@/utils/auth";
import { InputField } from "@/components/fields/InputField";
import { Button } from "@/components/ui/button";

const formSchema = z.object({
  email: z.string().trim().nonempty().email(),
  password: z.string().trim().nonempty(),
});

export function Login() {
  const navigate = useNavigate();

  const [errorMessage, setErrorMessage] = React.useState("");

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {},
  });

  const onSubmit = async (data) => {
    try {
      await login(data);
      navigate("/");
    } catch (err) {
      setErrorMessage(
        err?.response?.data?.message || err?.message || "Something went wrong"
      );
    }
  };

  return (
    <div className="flex min-h-full flex-1 flex-col justify-center items-center px-6 py-12 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-sm">
        <h2 className="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">
          Sign in to your account
        </h2>
      </div>
      {errorMessage && (
        <div className="mt-4">
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative">
            {/* <strong className="font-bold">Error!</strong> */}
            <span className="block sm:inline"> {errorMessage}</span>
          </div>
        </div>
      )}

      <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <>
              <div className="space-y-12">
                <div className="mt-10 flex flex-col gap-2">
                  <div className="form-control w-full">
                    <InputField name="email" label="Email" />
                  </div>
                  <div className="form-control w-full">
                    <InputField
                      label="Password"
                      type="password"
                      name="password"
                    />
                  </div>
                </div>

                <Button type="submit" className="w-full">
                  Sign in
                </Button>

                <div>
                  <p className="text-sm text-center text-gray-600">
                    Don't have an account yet?{" "}
                    <Link
                      to="/auth/register"
                      className="text-primary-600 hover:text-primary-700 font-medium"
                    >
                      Register
                    </Link>
                  </p>
                </div>
              </div>
            </>
          </form>
        </Form>
      </div>
    </div>
  );
}
