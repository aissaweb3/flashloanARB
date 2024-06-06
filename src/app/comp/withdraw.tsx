"use client";

import { useState } from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { withdraw } from "../server/server";
import ActionButton from "./button";

export default function Withdraw() {
  //const [pending, setpending] = useState(false);
  const [err, setError] = useState("");
  const [hash, setHash] = useState("");

  const go = async (data: FormData) => {
    //setpending(true);
    const token = data.get("token");
    const amount = data.get("amount");
    const privateKey = data.get("privateKey");
    const receiver = data.get("receiver");

    const DATA = { token, amount, privateKey, receiver };

    try {
      const result = await withdraw(DATA);
      const response = JSON.parse(result);

      if (response.success) {
        setHash(response.hash);
        setError("");
        setError("success");
      } else {
        setHash("");
        setError("");
        setError(response.error);
      }
    } catch (error) {
      setHash("");
      setError("");
      setError("An unexpected error occurred");
    } finally {
      //setpending(false);
    }
  };

  return (
    <div>
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Withdraw Your Tokens</CardTitle>
          <CardDescription>
            Enter the token address and the amount desired to Withdraw.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form className="grid gap-4" action={go}>
            <div className="grid gap-2">
              <Label htmlFor="privateKey"> Owner Private Key</Label>
              <Input
                id="privateKey"
                name="privateKey"
                placeholder="Enter the Owner Private Key"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="token">Token address</Label>
              <Input
                id="token"
                name="token"
                placeholder="Enter token address"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="amount">Amount to Withdraw</Label>
              <Input
                id="amount"
                name="amount"
                placeholder="Enter Amount to Withdraw"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="receiver">Receiver Address</Label>
              <Input
                id="receiver"
                name="receiver"
                placeholder="Enter Receiver Address"
              />
            </div>
            <p
              className={err === "success" ? "text-green-400" : "text-red-400"}
            >
              {err || ""}
            </p>

            <p className="text-[8px]">{hash}</p>

            <ActionButton />
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
