// xState.js
import chalk from 'chalk';
let xState = {};

export const initializeState = (data) => {
    xState = { ...data };
    console.log(chalk.green('X State Initialized.'));
    //console.log(chalk.cyan(`Configuration attached: ${JSON.stringify(xState, null, 2)}`));
};

export const getState = () => {
    return xState;
};

export const updateState = (newData) => {
    xState = { ...xState, ...newData };
    console.log(chalk.green('X State Updated.'));
    console.log(chalk.cyan(`Current State: ${JSON.stringify(xState, null, 2)}`));
};
