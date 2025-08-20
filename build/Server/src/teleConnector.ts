import TelegramBot from "node-telegram-bot-api";
import dotenv from "dotenv";
import fetch from "node-fetch";
import { queryData } from "./db/couchbaseClient";
import { usersOnline } from "./controllers/socketController";

dotenv.config();

const token = process.env.TELEGRAM_BOT_TOKEN;
const gameUrl = "https://t.me/gamedevtoi_bot/shadow_javelin"; // Thay bằng link game của bạn


if (!token) {
  throw new Error("Missing TELEGRAM_BOT_TOKEN in .env file");
}

export const botTele = new TelegramBot(token, { polling: true });

botTele.on("inline_query", async (query) => {
  const results: TelegramBot.InlineQueryResult[] = [
    {
      type: "article",
      id: "1",
      title: "PlayGame",
      input_message_content: {
        message_text: gameUrl,
      },
    }
  ];

  botTele.answerInlineQuery(query.id, results);
});


// Khi người dùng bắt đầu chat với bot
botTele.onText(/\/games/, (msg) => {
    botTele.sendMessage(msg.chat.id, "Chào bạn! Đây là những game hiện có 🎮", {
    reply_markup: {
      keyboard: [[{ text: "🎮 Shadow Javelin" }, { text: "🍉 Garden DHH" }]],
      resize_keyboard: true,
      one_time_keyboard: false,
    },
  });
});

// Khi người dùng nhấn nút "Play Game"
botTele.on("message", (msg) => {
  if (msg.text === "🎮 Shadow Javelin") {
    botTele.sendMessage(msg.chat.id, `🚀 Nhấn vào đây để chơi: [Shadow Javelin](${gameUrl})`, {
      parse_mode: "Markdown",
    });
  }
  if (msg.text === "🍉 Garden DHH") {
    botTele.sendMessage(msg.chat.id, `🚀 Nhấn vào đây để chơi: [Garden DHH](https://t.me/gamedevtoi_bot/gardenDHH)`, {
      parse_mode: "Markdown",
    });
  }

  if(msg.text?.startsWith("/noti")){
    sendNotiAllUser(msg.text.replace("/noti", ""));
  }

  if(msg.text?.startsWith("/count")){
    botTele.sendMessage(msg.chat.id, `🚀 có ${usersOnline.length} người đang chơi game`, {
      parse_mode: "Markdown",
    });
  }
});

export async function sendMessage(userId: string, message: string) {
  const url = `https://api.telegram.org/bot${token}/sendMessage`;
  const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
          chat_id: userId,
          text: message,
      }),
  });

  const data = await response.json();
  console.log(data);
}

async function sendNotiAllUser(conten: string) {
  const query = `SELECT userId
  FROM \`Garden\`.\`_default\`.\`UserDatas\`;`;

  const rows = await queryData(query);
  for (const row of rows) {
    sendMessage(row.userId, conten);
  }
}

console.log("🤖 Bot is running...");


