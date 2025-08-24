//@ts-nocheck

import React, { ChangeEventHandler, FC } from "react";
import { Controller, useFormContext } from "react-hook-form";
import { useDropzone } from "react-dropzone";
import { PencilIcon, Trash2Icon } from "lucide-react";

import PDFViewer from "@/components/widgets/PdfViewer";

export const DropzoneAvatar: FC<{ name: string; multiple?: boolean }> = ({
  name,
  multiple = false,
  ...rest
}) => {
  const { getRootProps, getInputProps } = useDropzone({
    multiple,
    ...rest,
    useFsAccessApi: false,
    // accept: { "image/*": [] },
  });

  const { control } = useFormContext();

  const onRemove = (field) => {
    field.onChange(null);
  };

  return (
    <Controller
      render={({ field }) => {
        let fileType;
        if (field.value) {
          if (typeof field.value !== "string") {
            if (field.value.type && field.value.type.endsWith("pdf")) {
              fileType = "pdf";
            } else if (field.value.path && field.value.path.endsWith(".pdf")) {
              fileType = "pdf";
            } else {
              fileType = "image";
            }
          } else {
            if (field.value.endsWith("pdf")) {
              fileType = "pdf";
            } else {
              fileType = "image";
            }
          }
        }

        return (
          <div {...getRootProps()} className="flex w-full">
            <input
              {...getInputProps({
                onChange: (e) => {
                  field.onChange(
                    multiple ? e.target.files : e.target.files?.[0] ?? null
                  );
                },
              })}
            />

            <div className="relative">
              <div className="bg-white shadow rounded-full cursor-pointer">
                {field.value ? (
                  fileType === "pdf" ? (
                    <PDFViewer
                      pdfUrl={
                        typeof field.value !== "string"
                          ? URL.createObjectURL(field.value)
                          : field.value
                      }
                      // width={200}
                      height={190}
                    />
                  ) : (
                    <img
                      className="w-[100px] h-[100px] max-h-[180px] rounded-full"
                      src={
                        typeof field.value !== "string"
                          ? URL.createObjectURL(field.value)
                          : field.value
                      }
                    />
                  )
                ) : (
                  <div className="flex justify-center items-center">
                    Drag and drop file here.
                  </div>
                )}
              </div>
            </div>
          </div>
        );
      }}
      name={name}
      control={control}
      defaultValue=""
    />
  );
};

const Dropzone: FC<{
  multiple?: boolean;
  onChange?: ChangeEventHandler<HTMLInputElement>;
}> = ({ multiple, onChange, ...rest }) => {
  return (
    <div className="bg-red-500 w-[100px] h-[100px]">
      {/* <div className="rounded-full shadow bg-white absolute right-0 w-9 h-9 flex items-center justify-center p-0 right-[-18px] top-[-18px]">
        <PencilIcon className="w-5 h-5" />
      </div> */}
    </div>
  );
};
