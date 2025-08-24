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

import { Checkbox } from "../ui/checkbox";

export const StatusField: FC<{
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
        <FormItem className="flex flex-wrap items-center gap-4">
          {/* <FormLabel>{label}</FormLabel> */}

          {options.map((option, index) => (
            <div key={index} className="flex items-center gap-2 !mt-0">
              <Checkbox
                key={getOptionValue(option)}
                id={`${name}-${getOptionValue(option)}`}
                value={getOptionValue(option)}
                onCheckedChange={(checked) => {
                  const valueCopy = [...(field.value || [])];

                  if (checked) {
                    valueCopy.push(getOptionValue(option));
                  } else {
                    const index = valueCopy.indexOf(getOptionValue(option));
                    if (index !== -1) {
                      valueCopy.splice(index, 1);
                    }
                  }

                  const event = {
                    target: { name: field.name, value: valueCopy },
                  };
                  field.onChange(event);
                }}
                checked={field.value?.includes(getOptionValue(option))}
                disabled={disabled}
              >
                {getOptionLabel(option)}
              </Checkbox>
              <label
                htmlFor={`${name}-${getOptionValue(option)}`}
                className="cursor-pointer text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                {getOptionLabel(option)}
              </label>
            </div>
          ))}
        </FormItem>
      )}
      {...rest}
    />
  );
};
