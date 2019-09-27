## 币身份

Hid is a public, permissionless, Decentralized Identifier (DID) network that implements the blockchain-agnostic Sidetree protocol on top of Bitcoin (as a 'Layer 2' overlay) to support DIDs/DPKI (Decentralized Public Key Infrastructure) at scale.

## Key Points:

- Hid is public and permissionless - the system is decentralized, no company, organization, or group owns/controls the identifiers and DPKI entries in the system, and no one dictates who can participate.

- Hid is not a sidechain or consensus system - the network nodes do not require any additional consensus mechanism.

## How does Hid work?

By leveraging the blockchain-agnostic [DsLink](https://github.com/ecslew/dslink) protocol, Hid makes it possible to anchor tens of thousands of DID/DPKI operations on a target using a single on-chain transaction. The transactions are encoded with a hash that Hid nodes use to fetch, store, and replicate the hash-associated DID operation batches via IPFS. The nodes process these batches of operations in accordance with a specific set of deterministic rules that enables them to independently arrive at the correct DPKI state for IDs in the system, without requiring a separate consensus mechanism, blockchain, or sidechain. Nodes can fetch, process, and assemble DID states in parallel, allowing the aggregate capacity of nodes to run at tens of thousands of operations per second.

