<p align="center">
<img src="https://i.imgur.com/kizvtYy.png" alt="CryptoCash Logo" width="200px">
</p>
<p align="center">
<a href="https://www.typescriptlang.org/" target="_blank" rel="noreferrer"><img src="https://raw.githubusercontent.com/danielcranney/readme-generator/main/public/icons/skills/typescript-colored.svg" width="36" height="36" alt="TypeScript" /></a>
<a href="https://developer.mozilla.org/en-US/docs/Glossary/HTML5" target="_blank" rel="noreferrer"><img src="https://raw.githubusercontent.com/danielcranney/readme-generator/main/public/icons/skills/html5-colored.svg" width="36" height="36" alt="HTML5" /></a>
<a href="https://nextjs.org/docs" target="_blank" rel="noreferrer"><img src="https://raw.githubusercontent.com/danielcranney/readme-generator/main/public/icons/skills/nextjs-colored.svg" width="36" height="36" alt="NextJs" /></a>
<a href="https://reactjs.org/" target="_blank" rel="noreferrer"><img src="https://raw.githubusercontent.com/danielcranney/readme-generator/main/public/icons/skills/react-colored.svg" width="36" height="36" alt="React" /></a>
<a href="https://www.w3.org/TR/CSS/#css" target="_blank" rel="noreferrer"><img src="https://raw.githubusercontent.com/danielcranney/readme-generator/main/public/icons/skills/css3-colored.svg" width="36" height="36" alt="CSS3" /></a>
<a href="https://tailwindcss.com/" target="_blank" rel="noreferrer"><img src="https://raw.githubusercontent.com/danielcranney/readme-generator/main/public/icons/skills/tailwindcss-colored.svg" width="36" height="36" alt="TailwindCSS" /></a>
<a href="https://nodejs.org/en/" target="_blank" rel="noreferrer"><img src="https://raw.githubusercontent.com/danielcranney/readme-generator/main/public/icons/skills/nodejs-colored.svg" width="36" height="36" alt="NodeJS" /></a>
<a href="https://www.mongodb.com/" target="_blank" rel="noreferrer"><img src="https://raw.githubusercontent.com/danielcranney/readme-generator/main/public/icons/skills/mongodb-colored.svg" width="36" height="36" alt="MongoDB" /></a>
<a href="https://metamask.io/" target="_blank" rel="noreferrer"><img src="https://raw.githubusercontent.com/danielcranney/readme-generator/main/public/icons/skills/metamask-colored.svg" width="36" height="36" alt="MetaMask" /></a>
<a href="https://docs.alchemy.com/alchemy/documentation/alchemy-web3" target="_blank" rel="noreferrer"><img src="https://raw.githubusercontent.com/danielcranney/readme-generator/main/public/icons/skills/alchemy-colored.svg" width="36" height="36" alt="Alchemy" /></a>
<a href="https://ethers.io" target="_blank" rel="noreferrer"><img src="https://raw.githubusercontent.com/danielcranney/readme-generator/main/public/icons/skills/ethers-colored.svg" width="36" height="36" alt="Ethers" /></a>
<a href="https://ipfs.io/" target="_blank" rel="noreferrer"><img src="https://raw.githubusercontent.com/danielcranney/readme-generator/main/public/icons/skills/ipfs-colored.svg" width="36" height="36" alt="IPFS" /></a>
<a href="https://polygon.technology/" target="_blank" rel="noreferrer"><img src="https://raw.githubusercontent.com/danielcranney/readme-generator/main/public/icons/skills/polygon-colored.svg" width="36" height="36" alt="Polygon" /></a>
</p>

# CryptoCash Web Application

CryptoCash is a blockchain-based payment solution designed for developing markets, where the majority of transactions are cash-based due to high card transaction fees and low bank card usage. CryptoCash aims to streamline transactions by leveraging mobile phones and existing offline prepayment infrastructure, making payments faster, cheaper, and more convenient for users.
The application interacts with the CryptoCash smart contracts deployed on the Polygon Mumbai blockchain. This web application is built using Next.js and serves as the front-end for the CryptoCash project.

---

[Smart Contracts Repository](https://github.com/ignromanov/crypto-cash-contracts)

[Demo Application](https://crypto-cash-webapp.vercel.app/)

---

<p>
<a href="https://www.loom.com/share/b4a3bb2bb9e24bd38518e0b9396da757">
    <p>CryptoCash Presentation by Ignat Romanov - Watch Video</p>
    <img width=300px src="https://cdn.loom.com/sessions/thumbnails/b4a3bb2bb9e24bd38518e0b9396da757-1682790379066-with-play.gif" alt="CryptoCash Presentation by Ignat Romanov - Watch Video" />
</a>
</p>
---

## Features

1. CSH Token: The native token that serves as the primary medium of exchange within the CryptoCash ecosystem, with the potential to incorporate country-specific stablecoins.
2. CodesFactory Contract: A smart contract that generates secret codes corresponding to specific amounts of CSH tokens, which are then converted into QR codes and distributed offline via existing one-time code distribution networks.
3. Web Application: A user-friendly app that allows users to activate their secret codes, receive CSH tokens, and perform transactions with ease.
4. IPFS Integration: Decentralized storage for Merkle tree leaves and other relevant data, providing resilience and reliability.
5. Blockchain Technology: Secure, transparent transactions and improved record-keeping for better accounting and debt management practices.

These features combine to create an innovative payment solution that addresses the unique challenges faced by developing markets, leveraging mobile phones, offline prepayment infrastructure, and blockchain technology to create a more efficient and accessible financial ecosystem.

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
