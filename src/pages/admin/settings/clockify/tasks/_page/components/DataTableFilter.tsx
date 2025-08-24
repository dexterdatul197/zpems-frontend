// @ts-nocheck
import { useEffect, useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";

import { RotateCcwIcon, SearchIcon, SlidersHorizontalIcon } from "lucide-react";
import { useForm } from "react-hook-form";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Form } from "@/components/ui/form";
import { ComboboxField } from "@/components/fields/ComboboxField";

import { getClientProjects } from "@/api/clockify/clients";

const DEFAULT_VALUES = {
  projectInternalId: "",
  clientInternalId: "",
};

export const DataTableFilter: React.FC = ({ filters, setFilters }: any) => {
  // const { authUser } = useRouteLoaderData("root");
  const form = useForm({
    defaultValues: DEFAULT_VALUES,
  });

  const { data: clients } = useQuery({
    queryKey: ["clockifyClients"],
    queryFn: async () => {
      return await getClientProjects({});
    },
  });

  const [showFilters, setShowFilters] = useState(true);

  const filterCount = useMemo(() => {
    return Object.keys(filters).reduce((filterCount, key: string) => {
      // @ts-ignore
      if (filters[key] != DEFAULT_VALUES[key]) {
        return filterCount + 1;
      }
      return filterCount;
    }, 0);
  }, [filters]);

  const handleShowFilters = () => {
    setShowFilters(!showFilters);
  };

  const handleReset = () => {
    form.reset({ ...DEFAULT_VALUES });
  };

  const clientInternalId = form.watch("clientInternalId");
  const projectInternalId = form.watch("projectInternalId");

  const handleFilter = (values: any) => {
    setFilters(values);
  };

  const projects = useMemo(() => {
    let _projects = [];
    try {
      _projects =
        clients.find((c) => c.internalId === clientInternalId).projects || [];
    } catch (e) {}

    return _projects;
  }, [clients, clientInternalId]);

  useEffect(() => {
    form.setValue("projectInternalId", "");
  }, [clientInternalId]);

  useEffect(() => {
    handleFilter({
      clientInternalId,
      projectInternalId,
    });
  }, [clientInternalId, projectInternalId]);

  return (
    <div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(() => {})} className="space-y-4">
          <div className="flex gap-4">
            <Button size="sm" onClick={handleShowFilters}>
              <SlidersHorizontalIcon className="mr-2 h-4 w-4" />
              {showFilters ? "Hide Filters" : "Show Filters"}
              {filterCount !== 0 && (
                <Badge variant="secondary" className="ml-2">
                  {filterCount}
                </Badge>
              )}
            </Button>

            {filterCount !== 0 && (
              <Button
                variant="ghost"
                size="sm"
                type="button"
                onClick={handleReset}
              >
                <RotateCcwIcon className="mr-2 h-4 w-4" /> Reset
              </Button>
            )}
          </div>

          {showFilters && (
            <div className="mt-2 flex flex-col gap-2">
              <div className="flex gap-4">
                <div className="flex items-center h-[40px]">
                  <SearchIcon className="h-4 w-4" />
                </div>
                <div className="flex-1 grid xs:grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-2">
                  <ComboboxField
                    name="clientInternalId"
                    label=""
                    options={[
                      { internalId: "", name: "All Clients" },
                      ...(clients || []),
                    ]}
                    getOptionLabel={(option) => option.name}
                    getOptionValue={(option) => option.internalId}
                    placeholder="Select Client..."
                  />
                  <ComboboxField
                    name="projectInternalId"
                    label=""
                    options={[
                      { internalId: "", name: "All Project" },
                      ...(projects || []),
                    ]}
                    getOptionLabel={(option) => option.name}
                    getOptionValue={(option) => option.internalId}
                    placeholder="Select Project..."
                  />
                </div>
              </div>
            </div>
          )}
        </form>
      </Form>
    </div>
  );
};
