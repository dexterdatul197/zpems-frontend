import { FC } from "react";
import { useFormContext } from "react-hook-form";

import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

import { Input } from "@/components/ui/input";

export const InputField: FC<{
  name: string;
  label?: string;
  type?: string;
  readOnly?: boolean;
  disabled?: boolean;
  className?: string;
  placeholder?: string;
}> = ({
  name,
  label,
  type,
  readOnly = false,
  disabled = false,
  placeholder,
  ...rest
}) => {
  const { control } = useFormContext();

  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem {...rest}>
          {label && <FormLabel>{label}</FormLabel>}
          <FormControl>
            <Input
              type={type ? type : "text"}
              readOnly={readOnly}
              disabled={disabled}
              placeholder={placeholder}
              {...field}
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};
