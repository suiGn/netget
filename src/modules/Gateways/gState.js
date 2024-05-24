// gState.js
import chalk from 'chalk';
let gState = {};

/**
 * Initializes the X State with the provided data.
 * @param {Object} data - The data to initialize the X State with.
 */
export const initializeState = (data) => {
    gState = { ...data };
    console.log(chalk.cyan('G State Initialized.'));
    //console.log(chalk.cyan(`Configuration attached: ${JSON.stringify(xState, null, 2)}`));
};

/**
 * Returns the current X State.
 * @returns {Object} - The current X State.
 */
export const getState = () => {
    return gState;
};

/**
 * Updates the X State with the provided data.
 * @param {Object} newData - The data to update the X State with.
 */
export const updateState = (newData) => {
    gState = { ...gState, ...newData };
    console.log(chalk.green('X State Updated.'));
    console.log(chalk.cyan(`Current State: ${JSON.stringify(gState, null, 2)}`));
};
