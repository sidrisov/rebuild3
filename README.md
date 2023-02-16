# <img src="app/public/cubes.svg" align="center" height="35">(ReBuild3) => {[rebuild3.xyz](https://rebuild3.xyz/)}


## Description:

**Decentralized fundraising platform**, which helps global community to restore what was destroyed/damaged as a result of war, natural disaster, etc; enforced by smart-contracts to bring transparency into the fundraising process, safeguard donations, community based decision making (in future: DID, on-chain reputation, expenditure validation, campaign multi-rounds fundraising).

* * * 

## Problem statement ❌:

There are alsmost no fundraising solutions to fascilitate rebuilding post war, natural disasters, etc; in most cases those are big organizations with centralized decision making on funds distribusion.

Existing general purpose fundraising platforms lack transperancy in fundraising process, how donations are safeguarded, global community has almost no influence on decision making.

* * * 

## Solution ✅:

Using web3 smart-contract technologies, by default, we achieve accessebility, transparency and donations safeguarding in the fundraising process; decentralised autonomous organization (DAO) makes it possible for anyone to be part of decision making process.

#### Basic Product Workflow:

![Basic Product Workflow](documentation/product_workflow.png)

* * *

## Features📱:

1. Fully responsive dApp (support for most mobile/desktop browsers) fundraising platform accessible at [rebuild3.xyz](https://rebuild3.xyz/).
2. Smart-contracts decision making is fascilitated by [ReBuild3 DAO](https://www.tally.xyz/gov/rebuild3-pre-alpha) accessible via Tally platform.
3. There is a concept of active regions where fundraising is allowed.
4. Every region has its own list of organizations which fascilitate fundraising campaign validation.
5. Users can connect their wallet either throught available embeddable browser wallet (metamask), or via Magic Connect with your email (Magic Connect mode allows also to connect via Wallet Connect).
6. The platform should allow submitting rebuild campaign with specific expense criteria details, including information on what was destroyed: description, images.
7. There is a fundraising threashold, so that DAO can control over the time how much can be raised, and introduce new processes.
8. A person can donate for specific campaign.
9. Organization can approve campaign for fundraising after basic submission information check.
10. The system should not allow the organization to get money or send it to anyone else, the only thing it can do is approve an "escrow" for realeasing funds.

### User Interface:  

<img src="documentation/images/home_page.png" height="210">

<img src="documentation/images/../rebuild_dao.png" height="195">

<img src="documentation/images/app_page.png" height="215">

<p>
<img src="documentation/images/mobile_menu.jpg" height="375">
<img src="documentation/images/mobile_campaign_view.jpg" height="375">
</p>


* * * 

## Next Steps 🚀:  

* Secure Web3 messaging(@xmtp protocol)
* Decentralized Identity (gitcoin passport integration)
* On-chain reputation
* Expenditure validation (user submits restoration results)
* Campaign multi-rounds fundraising (allow previous rounds' donors to vote to approve start of the next round)
* Tokenomics/validators fees.

* * *

## Technical details 🛠️:

In this monorepo there are 2 projects: **solidity** and **app**.
In solidity all smart-contract (EVM) related work is done, where in app - all front-end.

**app** project depends on artifacts published in **solidity**, make sure to compile smart-contracts before running/bulding front-end.

### Smart-Contracts

**HardHat** is used as development framework for smart-contract, **OpenZeppelin**  - smart-contract library, mainly for token/governance related functionality.

Firstly, go to the solidity project and install dependencies:

```
cd solidity; npm install
```

Compile project to generate contract artifacts and run tests:

```
npx hardhat compile
npx hardhat test 
```

1. Running locally
Uncoment this section in hardhat.configt.ts:

```
defaultNetwork: 'localhost',
...
    hardhat: {
        mining: {
            interval: 5000
        }
    }
```

This way we make sure that your transactions actually take time to become part of next block; as your front-end should expect to have those confirmations delay in **goerli** or **mainnet**.

Run local node:

```
npx hardhat node 
```

To deploy our ReBuild3 and pre-initiate with regions and organizations run following script:

```
./scripts/app/init_local_env.sh
```

You will see some output:

```
ReBuild3 deployed to 0x5FbDB2315678afecb367f032d93F642f64180aa3
...
```

The address of deployed smart-contract will be required for front-end later on.

### Front-End

Technical stack: **Vite + React + TypeScript + MUI**; **Vercel** for dev/preview/production deployments under *.rebuild3.xyz.

Web3 SDK Tools:

1. Alchemy SDK - used mainly as default provider for all read-only communication with our deployed smart-contract, even if you don't connect any wallet, front-end will still be able to fetch all required metadata from contract.
2. MagicLink Connect - used as instant Web3 wallet (email/google sign-in), for those users who are still novice with crypto wallets.
3. Moralis SDK - used for uploading images to IPFS

**Vite** supports env segregation by specifying **mode**:

```
// used for development with contracts deployed to local network
// vite will load all env variables from *.env file
npm run dev or npx vite   

// used for staging with contracts deployed to goerli network
// vite will load all env variables from *.env.staging or *env.staging.local files
npx vite --mode staging
```

In our front-end application we need to specify following env variables (defined in **app/src/vite-env.d.ts**):

```
// deployed smart-contract address
VITE_REBUILD3_CONTRACT_ADDR=  

VITE_ALCHEMY_API_KEY=

// if not specified, assumed localhost is used
VITE_DEFAULT_NETWORK=

// whether magic is integrated
VITE_MAGIC_SUPPORTED=
VITE_MAGIC_API_KEY=
// whether enable magic wallet connection by default
VITE_MAGIC_ENABLED=

// whether to auto initiate wallet connection
VITE_INIT_CONNECT=

VITE_MORALIS_API_KEY=

// tally DAO URL for our ReBuild3 Governer specified in home page
VITE_TALLY_DAO_URL=
```

### Governance Interaction ([Tally](https://tally.xyz/))

**Tally** is used as User Inteface for interaction with deployed on-chain ReBuild3 Governer, this simplifies **proposal -> voting -> execution** process.
* * *
