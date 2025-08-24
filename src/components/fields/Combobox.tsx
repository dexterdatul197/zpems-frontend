//@ts-nocheck

import React from "react";
import { CheckIcon, ChevronsUpDown } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
  PopoverClose,
} from "@/components/ui/popover";

export function Combobox({
  value,
  options,
  placeholder = "Select",
  onSelect,
  getOptionValue,
  getOptionLabel,
  multipleGroups = false,
  getGroupValue,
  getGroupLabel,
  className = "",
}) {
  const [open, setOpen] = React.useState(false);

  const optionsByGroup = React.useMemo(() => {
    if (multipleGroups === true) {
      return options.reduce((acc, option) => {
        const groupValue = getGroupValue(option);
        if (!acc[groupValue]) {
          acc[groupValue] = {
            value: getGroupValue(option),
            label: getGroupLabel(option),
            options: [],
          };
        }
        acc[groupValue].options.push(option);
        return acc;
      }, {});
    } else {
      return [];
    }
  }, [options, multipleGroups]);

  const getSelectedOption = React.useCallback(
    (value) => {
      const found = options.find((x) => getOptionValue(x) === value);
      return found || null;
    },
    [options, getOptionValue]
  );

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className={cn(
            "justify-between w-full",
            !value && "text-muted-foreground",
            className
          )}
        >
          {getSelectedOption(value)
            ? getOptionLabel(getSelectedOption(value))
            : placeholder}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="PopoverContent p-0">
        <Command
          filter={(value, search) => {
            const option = options.find((x) => getOptionValue(x) === value);
            if (!option) return 0;
            const label = getOptionLabel(option);
            if (label.toLowerCase().includes(search.toLowerCase())) return 1;
            return 0;
          }}
        >
          <CommandInput placeholder="Search..." />

          <CommandList className="max-h-[250px] overflow-y-auto">
            <CommandEmpty>No results found.</CommandEmpty>
            {multipleGroups === true ? (
              Object.values(optionsByGroup).map(
                (group: { value: string; label: string; options: [] }) => {
                  return (
                    <CommandGroup key={group.value} heading={group.label}>
                      {group.options.map((x) => (
                        <CommandItem
                          key={getOptionValue(x)}
                          value={getOptionValue(x)}
                          onSelect={() => {
                            onSelect(getOptionValue(x));
                          }}
                          className="py-0"
                        >
                          <PopoverClose className="flex w-full py-1.5 text-left">
                            <CheckIcon
                              className={cn(
                                "mr-2 h-4 w-4",
                                getOptionValue(x) === value
                                  ? "opacity-100"
                                  : "opacity-0"
                              )}
                            />
                            {getOptionLabel(x)}
                          </PopoverClose>
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  );
                }
              )
            ) : (
              <CommandGroup>
                {options.map((x) => (
                  <CommandItem
                    key={getOptionValue(x)}
                    value={getOptionValue(x)}
                    onSelect={() => {
                      onSelect(getOptionValue(x));
                    }}
                    className="py-0"
                  >
                    <PopoverClose className="flex w-full py-1.5 text-left">
                      <CheckIcon
                        className={cn(
                          "mr-2 h-4 w-4",
                          getOptionValue(x) === value
                            ? "opacity-100"
                            : "opacity-0"
                        )}
                      />
                      {getOptionLabel(x)}
                    </PopoverClose>
                  </CommandItem>
                ))}
              </CommandGroup>
            )}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
