import { useAppKitAccount } from "@reown/appkit/react";
import { useAppKit } from "@reown/appkit/react";
import { WalletErrorBoundary } from "@/components/wallet-error-boundary";

export default function ConnectButton() {
  const { address, isConnected} = useAppKitAccount();
  const appKit = useAppKit();

  return (
  <WalletErrorBoundary>
    <button
      onClick={() => {
        if (!isConnected) appKit.open();
      }}
      style={{
        backgroundColor: "#20a749ff",
        color: "white",
        padding: "10px 20px",
        border: "none",
        borderRadius: "5px",
        fontSize: "16px",
        cursor: isConnected ? "default" : "pointer",
        boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
        transition: "background-color 0.3s ease, transform 0.2s ease",
        width: "100%",
      }}
      onMouseOver={(e) => {
        if (!isConnected) e.currentTarget.style.backgroundColor = "#18893eff";
      }}
      onMouseOut={(e) => {
        if (!isConnected) e.currentTarget.style.backgroundColor = "#20a749ff";
      }}
      onMouseDown={(e) => {
        if (!isConnected) e.currentTarget.style.transform = "translateY(1px)";
      }}
      onMouseUp={(e) => {
        if (!isConnected) e.currentTarget.style.transform = "translateY(0)";
      }}
    >
      {isConnected ? (
        <span>{address.slice(0, 6)}...{address.slice(-4)}</span>
      ) : (
        "Connect Wallet"
      )}
    </button>
    </WalletErrorBoundary>
  );
}
