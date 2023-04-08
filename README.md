<p align="center">
<img src="https://i.imgur.com/kizvtYy.png" alt="CryptoCash Logo" width="200px">
</p>

# CryptoCash Web Application

CryptoCash is a blockchain-based payment solution designed for developing countries, leveraging token-based transactions with secret codes. The application interacts with the CryptoCash smart contracts deployed on the Polygon Mumbai blockchain. This web application is built using Next.js and serves as the front-end for the CryptoCash project.

[Smart Contracts Repository](https://github.com/ignromanov/crypto-cash-contracts)

[Run Demo Application](https://crypto-cash-webapp.vercel.app/)

## Features

The application provides the following features:

1. Generate secret codes: The administrator (contract owner) can generate a list of secret codes that can be redeemed for tokens.
2. Redeem secret codes: Users can redeem their secret codes for tokens by providing a valid code and a valid Merkle proof.
3. Check token balances: Users can view their token balances on the CryptoCash token (CSH).

## Pages

The application consists of the following pages:

1. Generate Codes (`/generate-codes`): On this page, users can generate a list of secret codes. The secret codes can be saved and later used to redeem tokens.

2. Redeem Code (`/redeem-code`): On this page, users can reveal their secret codes and redeem tokens. They must provide a valid code, a nonce, and a valid Merkle proof to successfully redeem the tokens.

3. Balances (`/`): On this page, users can view their token balances on the CryptoCash token (CSH).

## Installation

1. Clone the repository:

```bash
git clone https://github.com/ignromanov/crypto-cash-webapp.git
```

2. Navigate to the project directory:

```bash
cd your-repo
```

3. Install the required dependencies:

```bash
npm install
```

4.Start the development server:

```bash
npm run dev
```

The application should now be running on http://localhost:3000.

### Support Me

<a href="https://www.buymeacoffee.com/ignromanov" target="_blank"><img src="https://cdn.buymeacoffee.com/buttons/v2/default-yellow.png" alt="Buy Me A Coffee" style="height: 60px !important;width: 217px !important;" ></a>

## License

This project is licensed under the MIT License.
