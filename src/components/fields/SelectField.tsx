// @ts-nocheck
import React, { FC } from "react";
import { useFormContext } from "react-hook-form";

import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export const SelectField: FC<{
  name: string;
  label: string;
  options: any[];
  getOptionValue: (option: any) => string;
  getOptionLabel: (option: any) => string;
  placeholder?: string;
  className?: string;
  disabled?: boolean;
}> = ({
  name,
  label,
  options,
  getOptionValue,
  getOptionLabel,
  placeholder = "Select",
  disabled = false,
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
          <Select
            onValueChange={field.onChange}
            value={field.value}
            disabled={disabled}
          >
            <FormControl>
              <SelectTrigger>
                <SelectValue placeholder={placeholder} />
              </SelectTrigger>
            </FormControl>
            <SelectContent className="max-h-[400px]">
              {options.map((option) => (
                <SelectItem
                  key={getOptionValue(option)}
                  value={getOptionValue(option)}
                >
                  {getOptionLabel(option)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};
