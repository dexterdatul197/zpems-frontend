//@ts-nocheck
import React from "react";
import {
  useNavigate,
  Link,
  useParams,
  useSearchParams,
} from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { toast } from "sonner";

import { Form } from "@/components/ui/form";

import { acceptInvitation } from "@/api/auth";
import { InputField } from "@/components/fields/InputField";
import { Button } from "@/components/ui/button";

const formSchema = z
  .object({
    // name: z.string().trim().nonempty(),
    // email: z.string().trim().nonempty().email(),
    password: z.string().trim().nonempty(),
    confirmPassword: z.string().trim().nonempty(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export function Invitation() {
  const navigate = useNavigate();

  const { invitationId } = useParams();
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");

  const [errorMessage, setErrorMessage] = React.useState("");

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {},
  });

  const onSubmit = async (data) => {
    try {
      await acceptInvitation({
        ...data,
        invitationId,
        token,
      });
      navigate("/auth/login");
      toast.success("Accepted invitation successfully!");
    } catch (err) {
      setErrorMessage(
        err?.response?.data?.errors?.[0].messages?.[0] ||
          err?.message ||
          "Something went wrong"
      );
    }
  };

  return (
    <div className="flex min-h-full flex-1 flex-col justify-center items-center px-6 py-12 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-sm">
        <h2 className="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">
          Accept Invitation
        </h2>
      </div>

      {errorMessage && (
        <div className="mt-4">
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative">
            <strong className="font-bold">Error!</strong>
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
                  {/* <div className="form-control w-full">
                    <InputField name="name" label="Name" />
                  </div>
                  <div className="form-control w-full">
                    <InputField name="email" label="Email" />
                  </div> */}
                  <div className="form-control w-full">
                    <InputField
                      label="Password"
                      type="password"
                      name="password"
                    />
                  </div>
                  <div className="form-control w-full">
                    <InputField
                      label="Confirm Password"
                      type="password"
                      name="confirmPassword"
                    />
                  </div>
                </div>

                <Button type="submit" className="w-full">
                  Accept
                </Button>

                <div>
                  <p className="text-sm text-center text-gray-600">
                    Already have an account?{" "}
                    <Link
                      to="/auth/login"
                      className="text-primary-600 hover:text-primary-700 font-medium"
                    >
                      Log in
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
