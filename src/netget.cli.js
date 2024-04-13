#!/usr/bin/env node
import { program } from 'commander';
import { handleNetGetX } from './CLI/NetGetX.js';
import { handleGateways } from './CLI/Gateways.js';
import { handleGets } from './CLI/Gets.js';
import { NetGetMainMenu } from './CLI/netget_MainMenu.js';

program
  .description('NetGet Command Line Interface')
  .version('1.0.3')
  .action(NetGetMainMenu);

program.command('netget-x')
  .description('Directly interact with NetGetX')
  .action(handleNetGetX);

program.command('gateways')
  .description('Directly manage your Gateways')
  .action(handleGateways);

program.command('gets')
  .description('Directly configure and manage your Gets')
  .action(handleGets);

program.parse(process.argv);