// @ts-nocheck
import { useNavigate, useRouteLoaderData } from "react-router-dom";

import { toast } from "sonner";

import { Separator } from "@/components/ui/separator";
import { ProfileForm } from "./components/ProfileForm";

import { changePassword, updateUser } from "@/api/users";
import { useRef } from "react";
import { PasswordChangeForm } from "./components/PasswordChangeForm";
import { uploadFile } from "@/api/files";
import { HeaderPortal } from "@/pages/_page/HeaderPortal";

export const Profile = () => {
  const formRef = useRef(null);
  const { authUser }: any = useRouteLoaderData("root");
  const navigate = useNavigate();

  const handleUpdate = async (data: any) => {
    const { id, name, email, picture } = data;

    let userData = { name, email, picture };
    if (typeof picture !== "string") {
      try {
        const uploadedFile = await uploadFile(picture);
        userData = { ...userData, picture: uploadedFile?.fileUrl };
      } catch (error) {
        console.log(error);
        toast.error("Error uploading picture");
      }
    }

    try {
      await updateUser(id, userData);
      toast.success("Profile updated successfully");
      navigate("/profile");
    } catch (error) {
      console.error(error);
      toast.error("Error updating profile");
    }
  };

  const handleChangePassword = async (data: any) => {
    const { oldPassword, newPassword } = data;
    try {
      await changePassword({ oldPassword, newPassword });
      toast.success("Password changed successfully");
    } catch (error) {
      console.error(error);
      toast.error(
        error?.response?.data?.message ||
          error?.message ||
          "Error changing password"
      );
    }
  };

  return (
    <div>
      <HeaderPortal>
        <h1 className="text-xl font-bold">Profile</h1>
      </HeaderPortal>
      <div className="p-4 flex flex-col gap-4">
        <ProfileForm
          initialValues={{ ...authUser }}
          onSubmit={handleUpdate}
          ref={formRef}
        />

        <Separator />
        <h2 className="text-xl">Change Password</h2>
        <PasswordChangeForm onSubmit={handleChangePassword} />
      </div>
    </div>
  );
};
