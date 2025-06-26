import { postEvent, retrieveLaunchParams } from "@telegram-apps/sdk";
import axios from "axios";
import toast from "react-hot-toast";

export const handleGetReferralLink = async () => {
    console.log("Entering Refferal Link preview");
    const {tgWebAppData} = retrieveLaunchParams();
    const telegramId = tgWebAppData?.user?.id;
    console.log(telegramId);
    try {
      const button = document.querySelector('button:first-child');
      if (button) {
        button.setAttribute('disabled', 'true');
      }

      try {

        const uniqueId = `msg_${telegramId}_${Date.now()}`;
        try {
          const botToken = import.meta.env.VITE_BOT_TOKEN;
          console.log("BotToken");
          console.log(botToken);
          if (!botToken) {
            toast.error('Bot token is not configured. Please contact support.');
            console.log("Bot token is not configured");
            return;
          }

          const res = await axios.post(
            `https://api.telegram.org/bot${botToken}/savePreparedInlineMessage`,
            {
              user_id: telegramId,
              result: {
                type: "article",
                id: uniqueId,
                title: "Ride the wave with Dolphins🐬",
                input_message_content: {
                  message_text: `Hey! 👋\n
                  I just found this super fun Telegram mini-game called Dolphin Dash 🐬 🎮 where you can play, stake NFTs, and win rewards in TON! 💸\n
                  I’m already in ~ you should totally check it out and race with me! 😎\n Join Dolphin Dash now!
                  Let’s see whose dolphin is faster! 🐬⚡️`
                },
                reply_markup: {
                  inline_keyboard: [
                    [
                      {
                        text: "Join Now 🚀",
                        url: `https://t.me/DolphinDash_bot/DolphinDash`
                      }
                    ]
                  ]
                }
              },
              allow_user_chats: true
            },
            {
              headers: {
                'Content-Type': 'application/json'
              },
              timeout: 15000
            }
          );
          if(await res.data && await res.data.result.id) {
            postEvent("web_app_send_prepared_message", { id: res.data.result.id });
          } else {
            console.log('Failed to prepare message. Please try again.');
          }
        } catch(error) {
          toast.error('Failed to save message. Please try again.');
        }
      } catch (error: unknown) {
        console.error('Backend API Error:', error);
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        toast.error(`Failed to fetch referral data: ${errorMessage}`);
      }
    } catch (error: unknown) {
      console.error('General Error:', error);
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      toast.error(`An unexpected error occurred: ${errorMessage}`);
    } finally {
      const button = document.querySelector('button:first-child');
      if (button) {
        button.removeAttribute('disabled');
      }
    }
  };