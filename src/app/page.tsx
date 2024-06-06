import Balance from "./comp/balance";
import FlashLoan from "./comp/flash";
import Withdraw from "./comp/withdraw";

export default function Component() {
  return (
    <div className="flex justify-center items-center self-center p-2 gap-2">
      <Balance />
      <FlashLoan />
      <Withdraw />
    </div>
  );
}
