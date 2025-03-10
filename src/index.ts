import { client } from './bot/bot.js';
import { registerCommands } from './lib/helpers/discord-helpers.js';
import { track } from './bot/commands/track.js';
import { untrack } from './bot/commands/untrack.js';
import { help } from './bot/commands/help.js';
import { restoreWebsocketSubscriptions } from './lib/helpers/db-helpers.js';
import logger from './lib/utils/logger.js';

client.once('ready', async () => {
  try {
    logger.info(`Bot logged in as ${client.user?.tag}`);
    await registerCommands();
  } catch (error) {
    logger.error(`Error registering commands: ${error}`);
  }
  try {
    await restoreWebsocketSubscriptions();
  } catch (error) {
    logger.error(`Error restoring websocket subscriptions: ${error}`);
  }
});

client.on('interactionCreate', async (interaction) => {
  if (!interaction.isCommand()) return;

  switch (interaction.commandName) {
    case 'track':
      await track(interaction);
      break;
    case 'untrack':
      await untrack(interaction);
      break;
    case 'help':
      await help(interaction);
  }
});

process.on('unhandledRejection', (error) => {
  logger.error(`Unhandled promise rejection: ${error}`);
});

client
  .login(process.env.DISCORD_TOKEN)
  .catch((error) =>
    logger.error('Error logging in with discord token:', error)
  );
