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
import { Button } from "@/components/ui/button";
import { fArb } from "../server/server";
import ActionButton from "./button";

export default function FlashLoan() {
  const [err, setError] = useState("");
  const [hash, setHash] = useState("");

  const go = async (data: FormData) => {
    const token0 = data.get("token0");
    const token1 = data.get("token1");
    const amount = data.get("amount");
    const privateKey = data.get("privateKey");

    const DATA = { token0, token1, amount, privateKey };

    try {
      const result = await fArb(DATA);
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
    }
  };

  return (
    <div>
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Steps</CardTitle>
        </CardHeader>
        <CardContent>
          <ul>
            <CardDescription>
              1- First Request a flashLoan from Balancer of Token0.
            </CardDescription>
            <CardDescription>
              2- Swap from Token0 to Token1 on SushiSwap.
            </CardDescription>
            <CardDescription>
              3- Swap from Token1 to Token0 on UniSwap.
            </CardDescription>
            <CardDescription>
              4- Repay the loan if the transaction only if there is profit.
              Otherwise cancel the transaction
            </CardDescription>
          </ul>
        </CardContent>
      </Card>
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Request Flashloan and Swap : </CardTitle>
          <CardDescription>
            Enter the details to start the operation.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form
            className="grid gap-4"
            action={(e) => {
              go(e);
            }}
          >
            <div className="grid gap-2">
              <Label htmlFor="privateKey"> Owner Private Key</Label>
              <Input
                id="privateKey"
                name="privateKey"
                placeholder="Enter the Owner Private Key"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="token0">Token 0</Label>
              <Input id="token0" name="token0" placeholder="Enter token 0" />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="token1">Token 1</Label>
              <Input id="token1" name="token1" placeholder="Enter token 1" />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="amount">Amount of token 0</Label>
              <Input id="amount" name="amount" placeholder="Enter amount" />
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
