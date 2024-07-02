# Step-by-Step Guide: Building an Auto-Verified Decentralized Application

Link for the tutorial is available here (dev.to)

## Hello Devs 👋

Blockchain development is increasingly essential today. This new phase of the internet is being widely adopted by individuals and organizations, transforming various sectors such as finance, education, entertainment, healthcare, and creative arts. The growth and potential changes proposed for this emerging technology appear limitless at the moment.
Therefore, while understanding smart contract verification is a prerequisite for web3 developers, the more critical skill is the ability to programmatically provide the code that enables this verification.
In this tutorial, we will build a decentralized application (DApp) for managing book records, allowing users to track their reading progress and engagement with various books. This DApp functions like a library catalog, providing users with access to books and options to mark them as read for effective record-keeping and management.

> _Checkout this tutorial to learn the fundamentals of blockchain development, this will serve as a practical guide for the rest of this tutorial._
> {% link azeezabidoye/full-stack-ethereum-and-dapp-development-a-comprehensive-guide-2024-4jfd %}

## Prerequisites 📚

1. Node JS (v16 or later)
2. NPM (v6 or later)
3. Metamask
4. Testnet ethers
5. Etherscan API Key

## Dev Tools 🛠️

1. Yarn

```shell
npm install -g yarn
```

> The source code for this tutorial is located here:
> {% github azeezabidoye/book-record-dapp %}

### Step #1: Create a new React project

```shell
npm create vite@latest book-record-dapp --template react
```

- Navigate into the newly created project.

```shell
cd book-record-dapp
```

### Step #2: Install Hardhat as a dependency using `yarn`.

```shell
yarn add hardhat
```

### Bonus: How to create Etherscan API Key

Smart contract verification can be performed manually on Etherscan, but it is advisable for developers to handle this programmatically. This can be achieved using an Etherscan API key, Hardhat plugins, and custom logic.

- Sign up/Sign in on [etherscan.io](www.etherscan.io)
- Select your profile at the top right corner {image}
- Select `Add` button to generate a new API key {img}
- Provide a name for your project and select `Create API Key` {img}

### Step #3: Initialize Hardhat framework for development.

```shell
yarn hardhat init
```

### Step #4: Setup environment variables

- Install an NPM module that loads environment variable from `.env` file

```shell
yarn add --dev dotenv
```

- Create a new file in the root directory named `.env`.
- Create three (3) new variables needed for configuration

```javascript
PRIVATE_KEY = "INSERT-YOUR-PRIVATE-KEY-HERE";
INFURA_SEPOLIA_URL = "INSERT-INFURA-URL-HERE";
ETHERSCAN_API_KEY = "INSERT-ETHERSCAN-API-KEY-HERE";
```

> _An example of the file is included in the source code above. Rename the `.env_example` to `.env` and populate the variables therein accordingly_

### Step #5: Configure Hardhat for DApp development

- Navigate to `hardhat.config.cjs` file and setup the configuration

```javascript
require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config();

const { PRIVATE_KEY, INFURA_SEPOLIA_URL } = process.env;

module.exports = {
  solidity: "0.8.24",
  networks: {
    hardhat: { chainId: 1337 },
    sepolia: {
      url: INFURA_SEPOLIA_URL,
      accounts: [`0x${PRIVATE_KEY}`],
      chainId: 11155111,
    },
  },
};
```

### Step #6: Create smart contract

- Navigate to the contracts directory and create a new file named `BookRecord.sol`

```javascript
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

contract BookRecord {
    // Events
    event AddBook(address reader, uint256 id);
    event SetCompleted(uint256 bookId, bool completed);

    // The struct for new book
    struct Book {
        uint id;
        string title;
        uint year;
        string author;
        bool completed;
    }

    // Array of new books added by users
    Book[] private bookList;

    // Mapping of book Id to new users address adding new books under their names
    mapping (uint256 => address) bookToReader;

    function addBook(string memory title, uint256 year, string memory author, bool completed) external {
        // Define a variable for the bookId
        uint256 bookId = bookList.length;

        // Add new book to books-array
        bookList.push(Book(bookId, title, year, author, completed));

        // Map new user to new book added
        bookToReader[bookId] = msg.sender;

        // Emit event for adding new book
        emit AddBook(msg.sender, bookId);
    }

    function getBookList(bool completed) private view returns (Book[] memory) {
        // Create an array to save finished books
        Book[] memory temporary = new Book[](bookList.length);

        // Define a counter variable to compare bookList and temporaryBooks arrays
        uint256 counter = 0;

        // Loop through the bookList array to filter completed books
        for(uint256 i = 0; i < bookList.length; i++) {
            // Check if the user address and the Completed books matches
            if(bookToReader[i] == msg.sender && bookList[i].completed == completed) {
                temporary[counter] = bookList[i];
                counter++;
            }
        }

        // Create a new array to save the compared/matched results
        Book[] memory result = new Book[](counter);

        // Loop through the counter array to fetch matching results of reader and books
        for (uint256 i = 0; i < counter; i++) {
            result[i] = temporary[i];
        }
        return result;
    }

    function getCompletedBooks() external view returns (Book[] memory) {
        return getBookList(true);
    }

    function getUncompletedBooks() external  view returns (Book[] memory) {
        return getBookList(false);
    }

    function setCompleted(uint256 bookId, bool completed) external {
        if (bookToReader[bookId] == msg.sender) {
            bookList[bookId].completed = completed;
        }
        emit SetCompleted(bookId, completed);
    }
}
```

### Step #7: Compile smart contract

- Specify the directory where the ABI should be stored

```shell
  paths: {
    artifacts: "./src/artifacts",
  }
```

- After adding the `paths`. Your Hardhat configuration should look this

```javascript
require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config();

const { PRIVATE_KEY, INFURA_SEPOLIA_URL } = process.env;

module.exports = {
  solidity: "0.8.24",
  paths: {
    artifacts: "./src/artifacts",
  },
  networks: {
    hardhat: { chainId: 1337 },
    sepolia: {
      url: INFURA_SEPOLIA_URL,
      accounts: [`0x${PRIVATE_KEY}`],
      chainId: 11155111,
    },
  },
};
```

- Navigate to the terminal and run the command below

```shell
yarn hardhat compile
```

### Step #8: Configure DApp for deployment

- Create a new folder for deployment scripts in the root directory

```shell
mkdir deploy
```

- Create a file for the deployment scripts in the `deploy` directory like this: `00-deploy-book-record`

- Install an Hardhat plugin as a package for deployment

```shell
yarn add hardhat-deploy --dev

```

- Import `hardhat-deploy` package into Hardhat configuration file

```shell
require("hardhat-deploy")
```

- Install another Hardhat plugin to override the `@nomiclabs/hardhat-ethers` package

```shell
yarn add --dev @nomiclabs/hardhat-ethers@npm:hardhat-deploy-ethers
```

- Set up a deployer account in the Hardhat configuration file

```javascript
networks: {
     // Code Here
},
namedAccounts: {
     deployer: {
        default: 0,
     }
}
```

- Update the deploy script with the following code to deploy the smart contract

```javascript
module.exports = async ({ getNamedAccounts, deployments }) => {
  const { deploy, log } = deployments;
  const { deployer } = await getNamedAccounts();
  const args = [];
  await deploy("BookRecord", {
    contract: "BookRecord",
    args: args,
    from: deployer,
    log: true, // Logs statements to console
  });
};
module.exports.tags = ["BookRecord"];
```

- Open the terminal and deploy the contract on the Sepolia testnet

```shell
yarn hardhat deploy --network sepolia
```

> ✍️ _Copy the address of your deployed contract. You can store it in the `.env` file_

### Step #9: Configure DApp for automatic verification

- Install the Hardhat plugin to verify the source code of deployed contract

```shell
yarn add --dev @nomicfoundation/hardhat-verify
```

- Add the following statement to your Hardhat configuration

```javascript
require("@nomicfoundation/hardhat-verify");
```

- Add Etherscan API key to the environment variables in the Hardhat configuration

```javascript
const { PRIVATE_KEY, INFURA_SEPOLIA_URL, ETHERSCAN_API_KEY } = process.env;
```

- Add Etherscan config to your Hardhat configuration

```javascript
module.exports = {
  networks: {
      // code here
  },
  etherscan: {
      apiKey: "ETHERSCAN_API_KEY"
  }
```

- Create a new folder for _**utilities**_ in the root directory

```shell
mkdir utils
```

- Create a new file named `verify.cjs` in the `utils` directory for the verification logic

- Update `verify.cjs` with the following code:

```javascript
const { run } = require("hardhat");

const verify = async (contractAddress, args) => {
  console.log(`Verifying contract...`);

  try {
    await run("verify:verify", {
      address: contractAddress,
      constructorArguments: args,
    });
  } catch (e) {
    if (e.message.toLowerCase().includes("verify")) {
      console.log("Contract already verified!");
    } else {
      console.log(e);
    }
  }
};

module.exports = { verify };
```

- Update the deploy script with the verification logic

> ✍️ _Create a condition to confirm contract verification after deployment_

Your updated `00-deploy-book-record.cjs` code should look like this:

```javascript
const { verify } = require("../utils/verify.cjs");

module.exports = async ({ getNamedAccounts, deployments }) => {
  const { deploy, log } = deployments;
  const { deployer } = await getNamedAccounts();
  const args = [];
  const bookRecord = await deploy("BookRecord", {
    contract: "BookRecord",
    args: args,
    from: deployer,
    log: true, // Logs statements to console
  });

  if (process.env.ETHERSCAN_API_KEY) {
    await verify(bookRecord.target, args);
  }
  log("Contract verification successful...");
  log("............................................................");
};
module.exports.tags = ["BookRecord"];
```

- Now, let's verify the contract...open the terminal and run:

```shell
yarn hardhat verify [CONTRACT_ADDRESS] [CONSTRUCTOR_ARGS] --network sepolia
```

- In our case, the smart contract doesn't contain a function constructor, therefore we can skip the arguments

- Run:

```shell
yarn hardhat verify [CONTRACT_ADDRESS] --network sepolia
```

Here is the result... copy the provided link into your browser's URL bar.

```shell
Successfully submitted source code for contract
contracts/BookRecord.sol:BookRecord at 0x01615160e8f6e362B5a3a9bC22670a3aa59C2421
for verification on the block explorer. Waiting for verification result...

Successfully verified contract BookRecord on the block explorer.
https://sepolia.etherscan.io/address/0x01615160e8f6e362B5a3a9bC22670a3aa59C2421#code
```

{IMG}
