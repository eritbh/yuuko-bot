import {Client, Command} from 'yuuko';
import * as defaultCommands from 'yuuko/dist/commands';
import * as path from 'path';
import * as log from 'another-logger';

const config = require('./config');

const c = new Client(config);

// Event logging
c.on('commandLoaded', command => {
	log.debug(`Command ${command.name} loaded${command.filename ? ` from ${command.filename}` : ''}.`);
});
c.on('ready', () => {
	log.success(`Logged in as @${c.user.username}#${c.user.discriminator} in ${c.guilds.size} guild${c.guilds.size === 1 ? '' : 's'}, ${c.commands.length} command${c.commands.length === 1 ? '' : 's'}`);
});
c.on('preCommand', (command, msg) => {
	log.preCommand(`${command.name} from user ${msg.author.id} in channel ${msg.channel.id}`);
});
c.on('command', (command, msg) => {
	log.command(`${command.name} from user ${msg.author.id} in channel ${msg.channel.id}`);
});

// Eris event things
// eslint-disable-next-line func-style
const autolog = name => (shard, thing) => log[name](...shard == null ? [thing] : [`[shard ${shard}]`, thing]);
c.on('error', autolog('error'));
c.on('warn', autolog('warn'));
c.on('debug', autolog('erisDebug'));

process.on('warning', warning => { // for best results, run with --no-warnings
	log.warn(`${warning.name}: ${warning.message}`);
});

// Add commands and connect
for (const command of Object.values(defaultCommands)) {
	c.addCommand(command as Command);
}
c.addCommandDir(path.join(__dirname, 'commands'));
c.connect();
