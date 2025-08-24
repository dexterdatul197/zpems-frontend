//@ts-nocheck

import React, { useRef } from "react";
import { useFormContext } from "react-hook-form";
import {
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Combobox } from "./Combobox";

export function ComboboxField({ name, label, className, ...props }) {
  const containerRef = useRef(null);

  const { control, setValue } = useFormContext();

  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => {
        return (
          <FormItem ref={containerRef} className={className}>
            {label && <FormLabel>{label}</FormLabel>}
            <Combobox
              value={field.value}
              containerRef={containerRef}
              onSelect={(value) => setValue(name, value)}
              {...props}
            />
            <FormMessage />
          </FormItem>
        );
      }}
    />
  );
}
