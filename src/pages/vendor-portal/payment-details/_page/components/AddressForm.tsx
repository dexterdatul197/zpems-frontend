//@ts-nocheck
import { forwardRef, useEffect, useImperativeHandle, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

import { Form } from "@/components/ui/form";
import { InputField } from "@/components/fields/InputField";
import { ComboboxField } from "@/components/fields/ComboboxField";
import { SelectField } from "@/components/fields/SelectField";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { countries } from "@/constants/countries";

import { usePaymentDetailsStore } from "../zustand/usePaymentDetailsStore";

interface AddressFormProps {
  onSubmit?: (data: any) => void;
  initialValues?: any;
}

export const AddressForm = forwardRef(
  ({ initialValues, onSubmit }: AddressFormProps, ref) => {
    const { activeStepIndex, setStepOptions } = usePaymentDetailsStore();

    const [stateList, setStateList] = useState([]);

    const formSchema = z.object({
      type: z.string().min(1), //1: Individual , 2: Company
      contactEmail: z.string().email().min(1),
      phoneCode: z.string().min(1),
      phoneNumber: z.coerce.number().min(1),
      firstName: z.string().min(1),
      middleName: z.string(),
      lastName: z.string().min(1),
      company: z.string(),
      address1: z.string().min(1),
      address2: z.string(),
      city: z.string().min(1),
      country: z.string().min(1),
      state: z.string(),
      zip: z.coerce.number().min(1),
    });

    const form = useForm({
      resolver: zodResolver(formSchema),
      defaultValues: {
        type: initialValues?.address?.type || "",
        contactEmail: initialValues?.address?.contactEmail || "",
        phoneCode: initialValues?.address?.phoneCode || "",
        phoneNumber: initialValues?.address?.phoneNumber || "",
        firstName: initialValues?.address?.firstName || "",
        middleName: initialValues?.address?.middleName || "",
        lastName: initialValues?.address?.lastName || "",
        company: initialValues?.address?.company || "",
        address1: initialValues?.address?.address1 || "",
        address2: initialValues?.address?.address2 || "",
        city: initialValues?.address?.city || "",
        country: initialValues?.address?.country || "",
        state: initialValues?.address?.state || "",
        zip: initialValues?.address?.zip || "",
      },
    });

    const type = form.watch("type");
    const countryCode = form.watch("country");

    useEffect(() => {
      if (
        countryCode === "US" ||
        countryCode === "CA" ||
        countryCode === "AU" ||
        countryCode === "GB"
      ) {
        const selectedCountry = countries.find(
          (country) => country.code === countryCode
        );
        setStateList(selectedCountry?.states || []);
      } else {
        setStateList([]);
      }
    }, [countryCode]);

    useImperativeHandle(ref, () => ({
      submit: form.handleSubmit(onSubmit),
    }));

    return (
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex flex-col gap-4"
        >
          <div>
            <Label className="py-4">
              Enter Your Information
              <br />
              To ensure that you receive your payments on time, please enter
              your details as you shared them with your bank. P.O.
              <br />
              Box not allowed.
            </Label>
          </div>
          <div className="flex">
            <Label className="w-40 pt-3">Type: </Label>
            <SelectField
              name="type"
              label=""
              options={[
                { key: "1", label: "Individual" },
                { key: "2", label: "Company" },
              ]}
              getOptionValue={(option) => option.key}
              getOptionLabel={(option) => option.label}
              className="w-1/2"
            />
          </div>
          <div className="flex">
            <Label className="w-40 pt-3">Contact Email: </Label>
            <InputField name="contactEmail" label="" className="w-1/2" />
          </div>
          <div className="flex">
            <Label className="w-40 pt-3">Phone Number: </Label>
            <div className="flex flex-row gap-2 w-1/2">
              <ComboboxField
                name="phoneCode"
                options={countries}
                getOptionValue={(option) => option.code}
                getOptionLabel={(option) =>
                  option.emoji + " " + option.name + " " + option.dial_code
                }
                placeholder="Country"
                className="w-1/2"
              />
              <InputField name="phoneNumber" label="" className="w-1/2" />
            </div>
          </div>
          <div className="flex">
            <Label className="w-40 pt-3">Fist Name: </Label>
            <InputField name="firstName" label="" className="w-1/2" />
          </div>
          <div className="flex">
            <Label className="w-40 pt-3">Middle Name: </Label>
            <InputField name="middleName" label="" className="w-1/2" />
          </div>
          <div className="flex">
            <Label className="w-40 pt-3">Last Name: </Label>
            <InputField name="lastName" label="" className="w-1/2" />
          </div>
          {type === "2" && (
            <div className="flex">
              <Label className="w-40 pt-3">Company: </Label>
              <InputField name="company" label="" className="w-1/2" />
            </div>
          )}
          <div className="flex">
            <Label className="w-40 pt-3">Address 1: </Label>
            <InputField name="address1" label="" className="w-1/2" />
          </div>
          <div className="flex">
            <Label className="w-40 pt-3">Address 2: </Label>
            <InputField name="address2" label="" className="w-1/2" />
          </div>
          <div className="flex">
            <Label className="w-40 pt-3">City: </Label>
            <InputField name="city" label="" className="w-1/2" />
          </div>
          <div className="flex">
            <Label className="w-40 pt-3">Country: </Label>
            <ComboboxField
              name="country"
              options={countries}
              getOptionValue={(option) => option.code}
              getOptionLabel={(option) => option.name}
              placeholder="Select a Country"
              className="w-1/2"
            />
          </div>
          <div className="flex">
            <Label className="w-40 pt-3">State: </Label>
            {stateList && stateList.length > 0 ? (
              <ComboboxField
                name="state"
                options={stateList}
                getOptionValue={(option) => option.code}
                getOptionLabel={(option) => option.name}
                placeholder="Select a State"
                className="w-1/2"
              />
            ) : (
              <InputField name="state" label="" className="w-1/2" />
            )}
          </div>
          <div className="flex">
            <Label className="w-40 pt-3">Zip: </Label>
            <InputField name="zip" label="" className="w-1/2" />
          </div>

          <div className="flex justify-end gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                setStepOptions(activeStepIndex, { isEditing: false });
              }}
            >
              Cancel
            </Button>
            <Button>Save</Button>
          </div>
        </form>
      </Form>
    );
  }
);
