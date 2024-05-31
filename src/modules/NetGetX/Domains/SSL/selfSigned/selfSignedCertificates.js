const selfSignedMethod = async (xConfig) => {
    console.log(chalk.green('Setting up Self-Signed SSL...'));
    await saveXConfig({
        sslMode: 'selfsigned'
    });
    console.log(chalk.green('Self-Signed SSL setup complete.'));
};

export { selfSignedMethod };