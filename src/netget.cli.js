#!/usr/bin/env node
import { program } from 'commander';
import { getDir } from './scripts/setupConfig.js';
import  NetGetX_CLI  from './modules/NetGetX/NetGetX.cli.js';
import { handleGateways } from './modules/Gateways/Gateways.js';
import { handleGets } from './modules/Gets/Gets.js';
import  NetGetMainMenu  from './modules/netget_MainMenu.cli.js';

// Directory check and setup if necessary
getDir();
// Entry Points Options and Commands
program
  .description('NetGet Command Line Interface')
  .version('1.0.3')
  .option('-dev, --development', 'Run NetGet in development mode')
  .action((options) => {
    // Pass the development flag down to the main menu
    NetGetMainMenu(options.development);
  });

program.command('netget-x')
  .description('Directly interact with NetGetX')
  .action(NetGetX_CLI);

program.command('gateways')
  .description('Directly manage your Gateways')
  .action(handleGateways);

program.command('gets')
  .description('Directly configure and manage your Gets')
  .action(handleGets);

program.parse(process.argv);