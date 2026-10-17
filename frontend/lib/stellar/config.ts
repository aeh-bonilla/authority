export const STELLAR_CONFIG = {
  network: "testnet" as const,
  networkPassphrase: "Test SDF Network ; September 2015",
  sorobanRpcUrl: "https://soroban-testnet.stellar.org",
  horizonUrl: "https://horizon-testnet.stellar.org",
  contractId: "CAOAFGPATXWJ6KKGXFYHY42Q4N75NOWSR3NH3K2DT7QR3YSMDGT5P2HO",
  wasmHash: "ba7d1753ecf002984aee4a87c80b64af6bc1a819ed27bfa98162a9b4cfd2bcaa",
  explorerTxBaseUrl: "https://stellar.expert/explorer/testnet/tx",
  explorerContractBaseUrl: "https://stellar.expert/explorer/testnet/contract",
  stellarLabContractUrl: "https://lab.stellar.org/r/testnet/contract",
};

export function getTxExplorerUrl(txHash: string): string {
  if (!txHash || txHash.startsWith("mock_")) {
    return "#";
  }
  return `${STELLAR_CONFIG.explorerTxBaseUrl}/${txHash}`;
}

export function getContractExplorerUrl(contractId: string = STELLAR_CONFIG.contractId): string {
  return `${STELLAR_CONFIG.explorerContractBaseUrl}/${contractId}`;
}
