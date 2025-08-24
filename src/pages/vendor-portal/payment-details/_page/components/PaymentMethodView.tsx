//@ts-nocheck
import { useEffect, useState } from "react";

import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { countries } from "@/constants/countries";

export const PaymentMethodView = ({ initialValues, onEdit }) => {
  return (
    <div className="space-y-4">
      <div className="flex">
        <Label className="w-40 pt-3">Payment Method: </Label>
        <Label className="pt-3">
          {initialValues?.method?.method === "1" ? "Check" : "Other"}
        </Label>
      </div>
      <div>
        <Label className="py-4">
          Checks are sent by post to the address below. Please allow 15 business
          days for the check to arrive. <br />
          Checks are for deposit only, and cannot be transferred. <br />
          The checks' currency will be as displayed above.
        </Label>
      </div>
      <div className="flex">
        <Label className="w-40 pt-3">Currency: </Label>
        <Label className="pt-3">
          {initialValues?.method?.currency?.toUpperCase() || ""}
        </Label>
      </div>
      <div className="flex">
        <Label className="w-40 pt-3">Name on Check: </Label>
        <Label className="pt-3">{initialValues?.method?.nameOnCheck}</Label>
      </div>
      <div className="flex">
        <Label className="w-40 pt-3">Address to Send Check: </Label>
        <Label className="pt-3">{initialValues?.method?.addressToSend}</Label>
      </div>
      <div>
        <Label className="py-4">
          Payment method minimum threshold: USD 50.00. No transaction fees.
        </Label>
      </div>
      <div className="flex justify-end">
        <Button onClick={onEdit} variant="outline">
          Edit
        </Button>
      </div>
    </div>
  );
};
