import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-blockchain',
  standalone: true,
  imports: [],
  templateUrl: './blockchain.component.html',
  styleUrl: './blockchain.component.css'
})
export class BlockchainComponent implements OnInit {


  async ngOnInit(): Promise<void> {
    console.log("Ethereum: ", window.ethereum);

    // cuentas de metamask que tiene el usuario
    const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
    console.log(accounts)

    // se le pide permiso al usuario para poder acceder a esa cuenta
    const account = accounts[0];
    await window.ethereum.request({
      method: 'wallet_requestPermissions',
      params: [{
        "eth_accounts": { account }
      }]
    });

    // crea transaccion y decirle al usuario que la firme
    /*const transaction = ; // Pedir datos al servidor
    const txHash = await window.ethereum.request({
      method: 'eth_sendTransaction',
      params: [{
        from: transaction.from,
        to: transaction.to,
        value: transaction.value,
        gas: transaction.gas,
        gasPrice: transaction.gasPrice
      }]
    });
*/

  }
}

declare global {
  interface Window {
    ethereum: any;
  }
}