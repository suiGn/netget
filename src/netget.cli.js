#!/usr/bin/env node
import { program } from 'commander';
import { NetGetX } from './modules/NetGetX/NetGetX.cli.js';
import { handleGateways } from './modules/Gateways/Gateways.js';
import { handleGets } from './modules/Gets/Gets.js';
import { NetGetMainMenu } from './modules/netget_MainMenu.cli.js';

program
  .description('NetGet Command Line Interface')
  .version('1.0.3')
  .action(NetGetMainMenu);

program.command('netget-x')
  .description('Directly interact with NetGetX')
  .action(NetGetX);

program.command('gateways')
  .description('Directly manage your Gateways')
  .action(handleGateways);

program.command('gets')
  .description('Directly configure and manage your Gets')
  .action(handleGets);

program.parse(process.argv);