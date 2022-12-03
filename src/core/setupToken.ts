export function setupToken() {
  const token = process.env.TELEGRAM_TOKEN;
  if (!token) {
    console.error(
      'Error! Token is not specified! You should create .env file in root directory and add TELEGRAM_TOKEN variable!',
    );
    process.exit(1);
  }
}
