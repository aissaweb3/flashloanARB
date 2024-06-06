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
import { getBalance } from "../server/server";
import ActionButton from "./button";

export default function Balance() {
  //const [pending, setpending] = useState(false);
  const [err, setError] = useState("");
  const [balance, setBalance] = useState("");

  const go = async (data: FormData) => {
    //setpending(true);
    const token = data.get("token");

    const DATA = { token };

    try {
      const result = await getBalance(DATA);
      const response = JSON.parse(result);

      if (response.success) {
        setBalance(response.balance);
        setError("");
        setError("success");
      } else {
        setBalance("");
        setError("");
        setError(response.error);
      }
    } catch (error) {
      setBalance("");
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
          <CardTitle>Get Balance of Your Tokens</CardTitle>
          <CardDescription>
            Enter the token address and click execute to get how much you have
            of the token
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form className="grid gap-4" action={go}>
            <div className="grid gap-2">
              <Label htmlFor="token">Token address</Label>
              <Input
                id="token"
                name="token"
                placeholder="Enter token address"
              />
            </div>
            <p
              className={err === "success" ? "text-green-400" : "text-red-400"}
            >
              {err || ""}
            </p>

            <p className="">balance : {balance}</p>

            <ActionButton />
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
