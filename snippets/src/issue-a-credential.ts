import {
  InitConfig,
  Agent,
  WsOutboundTransport,
  HttpOutboundTransport,
  ConnectionEventTypes,
  ConnectionStateChangedEvent,
  DidExchangeState,
  CredentialProtocolVersion,
  AutoAcceptCredential,
  CredentialEventTypes,
  CredentialState,
  CredentialStateChangedEvent,
  OutOfBandRecord,
} from "@aries-framework/core"
import { agentDependencies, HttpInboundTransport } from "@aries-framework/node"
import { Schema } from "indy-sdk"
import fetch from "node-fetch"

const getGenesisTransaction = async (url: string) => {
  const response = await fetch(url)

  return await response.text()
}

// start-section-1
const initializeHolderAgent = async () => {
  const genesisTransactionsBCovrinTestNet = await getGenesisTransaction("http://test.bcovrin.vonx.io/genesis")
  // Simple agent configuration. This sets some basic fields like the wallet
  // configuration and the label. It also sets the mediator invitation url,
  // because this is most likely required in a mobile environment.
  const config: InitConfig = {
    label: "demo-agent-holder",
    walletConfig: {
      id: "demo-agent-holder",
      key: "demoagentholder00000000000000000",
    },
    indyLedgers: [
      {
        id: "bcovin-test-net",
        isProduction: false,
        genesisTransactions: genesisTransactionsBCovrinTestNet,
      },
    ],
    autoAcceptCredentials: AutoAcceptCredential.Always,
    autoAcceptConnections: true,
  }

  // A new instance of an agent is created here
  const agent = new Agent(config, agentDependencies)

  // Register a simple `WebSocket` outbound transport
  agent.registerOutboundTransport(new WsOutboundTransport())

  // Register a simple `Http` outbound transport
  agent.registerOutboundTransport(new HttpOutboundTransport())

  // Initialize the agent
  await agent.initialize()

  return agent
}
// end-section-1

// start-section-2
const initializeIssuerAgent = async () => {
  const genesisTransactionsBCovrinTestNet = await getGenesisTransaction("http://test.bcovrin.vonx.io/genesis")
  // Simple agent configuration. This sets some basic fields like the wallet
  // configuration and the label.
  const config: InitConfig = {
    label: "demo-agent-issuer",
    walletConfig: {
      id: "demo-agent-issuer",
      key: "demoagentissuer00000000000000000",
    },
    publicDidSeed: "demoissuerdidseed000000000000000",
    indyLedgers: [
      {
        id: "bcovrin-test-net",
        isProduction: false,
        genesisTransactions: genesisTransactionsBCovrinTestNet,
      },
    ],
    autoAcceptCredentials: AutoAcceptCredential.Always,
    autoAcceptConnections: true,
    endpoints: ["http://localhost:3001"],
  }

  // A new instance of an agent is created here
  const agent = new Agent(config, agentDependencies)

  // Register a simple `WebSocket` outbound transport
  agent.registerOutboundTransport(new WsOutboundTransport())

  // Register a simple `Http` outbound transport
  agent.registerOutboundTransport(new HttpOutboundTransport())

  // Register a simple `Http` inbound transport
  agent.registerInboundTransport(new HttpInboundTransport({ port: 3001 }))

  // Initialize the agent
  await agent.initialize()

  return agent
}
// end-section-2

// start-section-3
const registerSchema = async (issuer: Agent) =>
  issuer.ledger.registerSchema({ attributes: ["name", "age"], name: "Identity", version: "6.0" })
// end-section-3

// start-section-4
const registerCredentialDefinition = async (issuer: Agent, schema: Schema) =>
  issuer.ledger.registerCredentialDefinition({ schema, supportRevocation: false, tag: "default" })
// end-section-4

// start-section-5
const setupCredentialListener = (holder: Agent) => {
  holder.events.on<CredentialStateChangedEvent>(CredentialEventTypes.CredentialStateChanged, async ({ payload }) => {
    switch (payload.credentialRecord.state) {
      case CredentialState.OfferReceived:
        console.log("received a credential")
        // custom logic here
        await holder.credentials.acceptOffer({ credentialRecordId: payload.credentialRecord.id })
    }
  })
}
// end-section-5

// start-section-6
const issueCredential = async (issuer: Agent, credentialDefinitionId: string, connectionId: string) =>
  issuer.credentials.offerCredential({
    protocolVersion: CredentialProtocolVersion.V2,
    connectionId,
    credentialFormats: {
      indy: {
        credentialDefinitionId,
        attributes: [
          { name: "name", value: "Jane Doe" },
          { name: "age", value: "23" },
        ],
      },
    },
  })
// end-section-6

const createNewInvitation = async (agent: Agent) => {
  const outOfBandRecord = await agent.oob.createInvitation()

  return {
    invitationUrl: outOfBandRecord.outOfBandInvitation.toUrl({ domain: "https://example.org" }),
    outOfBandRecord,
  }
}

const receiveInvitation = async (agent: Agent, invitationUrl: string) => {
  const { outOfBandRecord } = await agent.oob.receiveInvitationFromUrl(invitationUrl)

  return outOfBandRecord
}

const setupConnectionListener = (issuer: Agent, outOfBandRecord: OutOfBandRecord, cb: (...args: any) => void) => {
  issuer.events.on<ConnectionStateChangedEvent>(ConnectionEventTypes.ConnectionStateChanged, ({ payload }) => {
    console.log("Incoming connection event!")
    if (payload.connectionRecord.outOfBandId !== outOfBandRecord.id) return
    if (payload.connectionRecord.state === DidExchangeState.Completed) {
      // the connection is now ready for usage in other protocols!
      console.log(`Connection for out-of-band id ${outOfBandRecord.id} completed`)

      // Custom business logic can be included here
      // In this example we can send a basic message to the connection, but
      // anything is possible
      cb(payload.connectionRecord.id)
    }
  })
}

const flow = (issuer: Agent) => async (connectionId: string) => {
  console.log("Registering the schema...")
  const schema = await registerSchema(issuer)
  console.log("Registering the credential definition...")
  const credentialDefinition = await registerCredentialDefinition(issuer, schema)
  console.log("Issuing the credential...")
  await issueCredential(issuer, credentialDefinition.id, connectionId)
}

const run = async () => {
  console.log("Initializing the holder...")
  const holder = await initializeHolderAgent()
  console.log("Initializing the issuer...")
  const issuer = await initializeIssuerAgent()

  console.log("Initializing the credential listener...")
  setupCredentialListener(holder)

  console.log("Initializing the connection...")
  const { outOfBandRecord, invitationUrl } = await createNewInvitation(issuer)
  setupConnectionListener(issuer, outOfBandRecord, flow(issuer))
  await receiveInvitation(holder, invitationUrl)
}

void run()
