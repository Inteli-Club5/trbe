import { useAppKit } from "@reown/appkit/react";

export default function ConnectButton() {
  // Use the open function from the useAppKit hook to control the modal
  const { open } = useAppKit();

  return (
    <>
      {/*
        This is a basic example using inline styles.
        For a real application, you'd typically use a CSS-in-JS library,
        a CSS module, or a dedicated CSS file for styling.
      */}
      <button
        onClick={() => open()}
        style={{
          backgroundColor: '#20a749ff', // Reown's typical blue or a similar vibrant color
          color: 'white',
          padding: '10px 20px',
          border: 'none',
          borderRadius: '5px',
          fontSize: '16px',
          cursor: 'pointer',
          boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
          transition: 'background-color 0.3s ease, transform 0.2s ease',
          width: '100%',
        }}
        onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#18893eff'} // Darken on hover
        onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#20a749ff'} // Revert on mouse out
        onMouseDown={(e) => e.currentTarget.style.transform = 'translateY(1px)'} // Slight press effect
        onMouseUp={(e) => e.currentTarget.style.transform = 'translateY(0)'} // Release effect
      >
        Connect Wallet
      </button>
    </>
  );
}