import { Component, OnInit } from '@angular/core';
import { CreateEthTransactionRequest } from '../../models/createEthTransactionRequest';
import { Erc20Contract } from '../../models/erc20Contract';
import { BlockchainService } from '../../services/blockchain.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-blockchain',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './blockchain.component.html',
  styleUrl: './blockchain.component.css'
})
export class BlockchainComponent {

  networkUrl: string = 'https://rpc.bordel.wtf/test'; // Red de pruebas;
  contractAddress: string;

  eurosToSend: number;
  addressToSend: string;

  contractInfo: Erc20Contract;

  constructor(private service: BlockchainService) {}

  async getContractInfo() {
    const result = await this.service.getContractInfo(this.networkUrl, this.contractAddress);

    if (result.success) {
      this.contractInfo = result.data;
    }
  }

  async createTransaction() {

    // Si no está instalado Metamask se lanza un error y se corta la ejecución
    if (!window.ethereum) {
      throw new Error('Metamask not found');
    }

    // Obtener la cuenta de metamask del usuario
    const accounts = await window.ethereum.request({method:'eth_requestAccounts'});
    const account = accounts[0];

    // Pedimos permiso al usuario para usar su cuenta de metamask
    await window.ethereum.request({
      method: 'wallet_requestPermissions',
      params: [{
        "eth_accounts": {account}
      }]
    });

    // Obtenemos los datos que necesitamos para la transacción: 
    // gas, precio del gas y el valor en Ethereum
    const transactionRequest: CreateEthTransactionRequest = { 
      networkUrl: this.networkUrl, 
      euros: this.eurosToSend 
    };
    const ethereumInfoResult = await this.service.getEthereumInfo(transactionRequest);
    const ethereumInfo = ethereumInfoResult.data;

    // Creamos la transacción y pedimos al usuario que la firme
    const transactionHash = await window.ethereum.request({
      method: 'eth_sendTransaction',
      params: [{
        from: account,
        to: this.addressToSend,
        value: ethereumInfo.value,
        gas: ethereumInfo.gas,
        gasPrice: ethereumInfo.gasPrice
      }]
    });

    // Pedimos al servidor que verifique la transacción.
    // CUIDADO: si el cliente le manda todos los datos,
    // podría engañar al servidor.
    const checkTransactionRequest = { 
      networkUrl: this.networkUrl,
      hash: transactionHash,
      from: account,
      to: this.addressToSend,
      value: ethereumInfo.value
    }
    
    const checkTransactionResult = await this.service.checkTransaction(checkTransactionRequest);

    // Notificamos al usuario si la transacción ha sido exitosa o si ha fallado.
    if (checkTransactionResult.success && checkTransactionResult.data) {
      alert('Transacción realizada con éxito');
    } else {
      alert('Transacción fallida');
    }
  }  
}

declare global {
  interface Window {
    ethereum: any;
  }
}

declare global {
  interface Window {
    ethereum: any;
  }
}