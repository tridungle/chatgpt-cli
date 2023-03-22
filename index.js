import dotenv from "dotenv";
import { env } from "node:process";
import { Configuration, OpenAIApi } from "openai";
import { createInterface } from "node:readline/promises";
import { stdin as input, stdout as output } from "node:process";
import chalk from "chalk";

dotenv.config();
const configuration = new Configuration({ apiKey: env.OPENAI_API_KEY });
const openai = new OpenAIApi(configuration);

async function run() {
  const readline = createInterface({ input, output });

  const chatbotType = await readline.question("This is a simple chat bot. Plz press enter to continue.");
  const messages = [{ role: "system", content: chatbotType }];

  let userInput = await readline.question(
    chalk.whiteBright.bold("Hello! How can I assist you today?\n\n")
  );

  while (userInput !== ".exit") {
    messages.push({ role: "user", content: userInput });
    try {
      const response = await openai.createChatCompletion({
        messages,
        model: "gpt-3.5-turbo",
        
      });

      const botMessage = response.data.choices[0].message;
      if (botMessage) {
        messages.push(botMessage);
        userInput = await readline.question(chalk.green.bold("\n" + botMessage.content + "\n\n"));
      } else {
        userInput = await readline.question(
         chalk.blue("\nNo response, try asking again\n")
        );
      }
    } catch (error) {
      console.log(error.message);
      userInput = await readline.question(
        chalk.red("\nSomething went wrong, try asking again\n")
      );
    }
  }
}
run();
