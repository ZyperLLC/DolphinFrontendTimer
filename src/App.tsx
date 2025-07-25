import { useEffect, useState } from "react";
import { UserPlus, Copy, Send } from "lucide-react";
import { TonConnectUI, toUserFriendlyAddress } from "@tonconnect/ui";
import { handleGetReferralLink } from "./helper/getReferralLink";
import toast from "react-hot-toast";

const connector = new TonConnectUI({
  manifestUrl: "https://olive-fashionable-mule-815.mypinata.cloud/ipfs/bafkreibeyicm22fqvs3gft7os527dwfkptxy35h57j2gk7jk74btracggq", // 👈 Change this to your real manifest
});

function App() {
  const deadline = new Date("2025-07-14T18:30:00Z").getTime();
  const [timeLeft, setTimeLeft] = useState(getTimeRemaining());
  const [walletAddress, setWalletAddress] = useState<string | null>(null);

  function getTimeRemaining() {
    const now = new Date().getTime();
    const difference = deadline - now;

    if (difference <= 0) {
      return { days: 0, hours: 0, minutes: 0, seconds: 0 };
    }

    return {
      days: Math.floor(difference / (1000 * 60 * 60 * 24)),
      hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
      minutes: Math.floor((difference / (1000 * 60)) % 60),
      seconds: Math.floor((difference / 1000) % 60),
    };
  }

  useEffect(() => {
    const timer = setInterval(() => setTimeLeft(getTimeRemaining()), 1000);
    return () => clearInterval(timer);
  }, []);

  // Check for wallet connection
  useEffect(() => {
    connector.onStatusChange((wallet) => {
      if (wallet?.account?.address) {
        const address =toUserFriendlyAddress(wallet.account.address);
        setWalletAddress(address);
      } else {
        setWalletAddress(null);
      }
    });
  }, []);

  const handleConnect = () => {
    connector.openModal();
  };
  const handleDisconnect = ()=>{  
    connector.disconnect();
  }

  const messageText = `Hey! 👋 I just found this super fun Telegram mini-game called Dolphin Dash 🐬 🎮 where you can play, stake NFTs, and win rewards in TON! 💸\nI’m already in ~ you should totally check it out and race with me!\n 😎 Join Dolphin Dash now! Let’s see whose dolphin is faster! 🐬⚡️\nhttps://t.me/DolphinDash_bot/DolphinDash`;

  const handleCopyUrl = ()=>{
    navigator.clipboard.writeText(messageText).then(() => {
      toast.success('Your invite link has been copied to clipboard!');
    }).catch((err) => {
      toast.error('Failed to copy to clipboard. Please try again.');
      console.error('Error copying to clipboard:', err);
    });
  }
  return (
    <div
      className="min-h-screen flex flex-col justify-between items-center bg-cover bg-center py-8 px-4"
      style={{ backgroundImage: "url('/Background.jpg')" }}
    >
      {/* Timer */}
      <div className="mt-[14.5rem] flex space-x-4">
        <TimeBox value={timeLeft.days} label="days" />
        <TimeBox value={timeLeft.hours} label="hours" />
        <TimeBox value={timeLeft.minutes} label="min" />
        <TimeBox value={timeLeft.seconds} label="sec" />
      </div>

      <div className="flex-1" />

      {/* Bottom Section */}
      <div className="flex flex-col items-center space-y-3 w-full max-w-xs pb-4">
        {/* Project Info */}
        <div className="flex items-center text-white text-sm space-x-2">
          <span>About project:</span>
          <a href="https://t.me/BcFC_c" className="flex gap-2 items-center justify-center">
          <Send className="w-4 h-4" />
          <span>@TonDopeDolphins</span>
          </a>
        </div>

        {/* Connect Wallet */}
        {walletAddress ? (
          <button className="w-full cursor-pointer py-3 rounded-xl bg-white text-center font-semibold text-purple-700 shadow-lg" onClick={handleDisconnect}>
            {walletAddress.slice(0, 6)}...{walletAddress.slice(-4)}
          </button>
        ) : (
          <button
            onClick={
              handleConnect}
            className="w-full py-3 rounded-xl text-white font-semibold bg-gradient-to-r from-pink-500 to-purple-500 shadow-lg"
          >
            Connect wallet
          </button>
        )}

        {/* Invite + Copy */}
        <div className="flex items-center justify-between w-full space-x-2">
          <div className={`flex-grow flex items-center justify-between py-1 rounded-xl shadow-sm
            ${walletAddress
                ? "bg-white font-bolder text-purple-700 cursor-pointer"
                : "bg-white/40 text-purple-300 cursor-not-allowed opacity-50"
            }`}>
            <button className={`flex-grow flex items-center justify-start gap-4 text-xl px-4 py-3 rounded-xl shadow-sm transition duration-300`} onClick={handleGetReferralLink}>
              <UserPlus className="w-5 h-5" />
              <span className="text-[1.15rem] font-medium">Invite friends</span>
            </button>
          </div>

          <button className="p-3 w-12 h-12 flex items-center justify-center rounded-xl bg-gradient-to-r from-pink-500 to-purple-500 text-white shadow-lg" onClick={handleCopyUrl} disabled={!walletAddress}>
            <Copy className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
}

const TimeBox = ({ value, label }: { value: number; label: string }) => (
  <div className="w-20 h-20 rounded-xl bg-white/20 backdrop-blur-md text-white flex flex-col items-center justify-center">
    <div className="text-4xl font-bold">{value.toString().padStart(2, "0")}</div>
    <div className="text-base mt-1">{label}</div>
  </div>
);

export default App;
