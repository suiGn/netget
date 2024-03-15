#!/usr/bin/env node

import { program } from 'commander';

program
  .version('1.0.3')
  .description('An automated Nginx configurator for NetGet');

program
  .command('configure-nginx')
  .description('Configure Nginx for NetGet')
  .option('-d, --domain <domain>', 'Domain name')
  .option('-p, --port <port>', 'Port number')
  .action((options) => {
    // Logic to configure Nginx goes here
    console.log(`Configuring Nginx for ${options.domain} on port ${options.port}`);
  });

program.parse(process.argv);