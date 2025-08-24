//@ts-nocheck
import { useEffect, useState } from "react";

import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { countries } from "@/constants/countries";

export const AddressView = ({ initialValues, onEdit }) => {
  const [addressInfo, setAddressInfo] = useState(null);

  useEffect(() => {
    if (initialValues?.address) {
      const address = initialValues.address;

      let areaCode = "";
      let countryName = "";
      let stateName = "";

      if (address.phoneCode) {
        const country = countries.find((c) => c.code === address.phoneCode);

        areaCode = country?.dial_code;
      }

      if (address.country) {
        const countryCode = initialValues.address.country;
        const stateCode = initialValues.address.state;
        const country = countries.find((c) => c.code === countryCode);

        countryName = country?.name;
        if (
          stateCode &&
          (countryCode === "US" ||
            countryCode === "CA" ||
            countryCode === "AU" ||
            countryCode === "GB")
        ) {
          stateName = country?.states?.find((s) => s.code === stateCode)?.name;
        } else {
          stateName = stateCode;
        }
      }

      setAddressInfo({
        ...initialValues.address,
        areaCode,
        countryName,
        stateName,
      });
    }
  }, [initialValues]);

  return (
    <div className="space-y-4">
      <div>
        <Label className="py-4">
          Enter Your Information
          <br />
          To ensure that you receive your payments on time, please enter your
          details as you shared them with your bank. P.O.
          <br />
          Box not allowed.
        </Label>
      </div>
      <div className="flex">
        <Label className="w-40 pt-3">Type: </Label>
        <Label className="pt-3">
          {addressInfo?.type === "1" ? "Individual" : "Company"}
        </Label>
      </div>
      <div className="flex">
        <Label className="w-40 pt-3">Contact Email: </Label>
        <Label className="pt-3">{addressInfo?.contactEmail}</Label>
      </div>
      <div className="flex">
        <Label className="w-40 pt-3">Phone Number: </Label>
        <Label className="pt-3">
          {`${addressInfo?.areaCode || ""} ${addressInfo?.phoneNumber || ""}`}
        </Label>
      </div>
      <div className="flex">
        <Label className="w-40 pt-3">Fist Name: </Label>
        <Label className="pt-3">{addressInfo?.firstName}</Label>
      </div>
      <div className="flex">
        <Label className="w-40 pt-3">Middle Name: </Label>
        <Label className="pt-3">{addressInfo?.middleName}</Label>
      </div>
      <div className="flex">
        <Label className="w-40 pt-3">Last Name: </Label>
        <Label className="pt-3">{addressInfo?.lastName}</Label>
      </div>
      {addressInfo?.type === "2" && (
        <div className="flex">
          <Label className="w-40 pt-3">Company: </Label>
          <Label className="pt-3">{addressInfo?.company}</Label>
        </div>
      )}
      <div className="flex">
        <Label className="w-40 pt-3">Address 1: </Label>
        <Label className="pt-3">{addressInfo?.address1}</Label>
      </div>
      <div className="flex">
        <Label className="w-40 pt-3">Address 2: </Label>
        <Label className="pt-3">{addressInfo?.address2}</Label>
      </div>
      <div className="flex">
        <Label className="w-40 pt-3">City: </Label>
        <Label className="pt-3">{addressInfo?.city}</Label>
      </div>
      <div className="flex">
        <Label className="w-40 pt-3">Country: </Label>
        <Label className="pt-3">{addressInfo?.countryName}</Label>
      </div>
      <div className="flex">
        <Label className="w-40 pt-3">State: </Label>
        <Label className="pt-3">{addressInfo?.stateName}</Label>
      </div>
      <div className="flex">
        <Label className="w-40 pt-3">Zip: </Label>
        <Label className="pt-3">{addressInfo?.zip}</Label>
      </div>
      <div className="flex justify-end">
        <Button onClick={onEdit} variant="outline">
          Edit
        </Button>
      </div>
    </div>
  );
};
