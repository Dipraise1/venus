import { FC, useMemo, useState } from "react";
import {
  ConnectionProvider,
  WalletProvider,
  useWallet,
} from "@solana/wallet-adapter-react";
import { WalletAdapterNetwork } from "@solana/wallet-adapter-base";
import { WalletConnectWalletAdapter } from "@solana/wallet-adapter-walletconnect";
import {
  WalletModalProvider,
  WalletDisconnectButton,
  WalletMultiButton,
} from "@solana/wallet-adapter-react-ui";
import { clusterApiUrl } from "@solana/web3.js";
import "@solana/wallet-adapter-react-ui/styles.css";

const images = [
  "/images/image1.jpg",
  "/images/image2.jpg",
  "/images/image3.jpg",
  // Add more image paths as needed
];

const AnimatedImage: FC<{ imageUrl: string }> = ({ imageUrl }) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      className="animated-image-container"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <img src={imageUrl} alt="Project Image" className={isHovered ? "animated-image" : ""} />
    </div>
  );
};

const PublicKey: FC = () => {
  const { publicKey } = useWallet();

  return (
    <p>{publicKey ? `Public Key: ${publicKey.toBase58()}` : `Not Connected`}</p>
  );
};

const App: FC = () => {
  const network = WalletAdapterNetwork.Devnet;

  const endpoint = useMemo(() => clusterApiUrl(network), [network]);

  const wallets = useMemo(
    () => [
      new WalletConnectWalletAdapter({
        network,
        options: {
          projectId: "2a2a5978a58aad734d13a2d194ec469a",
        },
      }),
    ],
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [network]
  );

  const handleDownloadImage = () => {
    const randomIndex = Math.floor(Math.random() * images.length);
    const imageUrl = images[randomIndex];
    const link = document.createElement("a");
    link.href = imageUrl;
    link.download = `image_${randomIndex + 1}.jpg`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <ConnectionProvider endpoint={endpoint}>
      <WalletProvider wallets={wallets} autoConnect>
        <WalletModalProvider>
          <div className="app-container">
            <div className="content-container">
              <div className="header">
                <WalletMultiButton />
                <WalletDisconnectButton />
              </div>
              <div className="main-content">
                <PublicKey />
                <button onClick={handleDownloadImage} className="download-button">
                  Download Random Image
                </button>
                <AnimatedImage imageUrl="/images/15.png" />
              </div>
            </div>
          </div>
        </WalletModalProvider>
      </WalletProvider>
    </ConnectionProvider>
  );
};

export default App;
