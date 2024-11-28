import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { CreateEthTransactionRequest } from '../../models/createEthTransactionRequest';
import { Erc20Contract } from '../../models/erc20Contract';
import { BlockchainService } from '../../services/blockchain.service';
import { FormsModule } from '@angular/forms';
import { NavComponent } from "../../components/nav/nav.component";
import { FooterComponent } from '../../components/footer/footer.component';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { TemporalOrder } from '../../models/temporal-order';
import { StripeEmbeddedCheckout } from '@stripe/stripe-js';
import { Subscription } from 'rxjs';
import { environment } from '../../../environments/environment';
import { CheckoutService } from '../../services/checkout.service';
import { Order } from '../../models/order';

@Component({
  selector: 'app-blockchain',
  standalone: true,
  imports: [FormsModule, NavComponent, FooterComponent],
  templateUrl: './blockchain.component.html',
  styleUrl: './blockchain.component.css'
})
export class BlockchainComponent implements OnInit, OnDestroy  {

  @ViewChild('blockchainDialog')
  checkoutDialogRef: ElementRef<HTMLDialogElement>;

  orderDetails: TemporalOrder = null; // Orden temporal
  temporalOrderId: number = 0; // ID de la Orden temporal
  paymentMethod: string = ''; // Método de pago escogido
  routeQueryMap$: Subscription;
  stripeEmbedCheckout: StripeEmbeddedCheckout;
  refreshInterval: any; // Intervalo para refrescar la orden

  createdOrder : Order; // el pedido cuando se cree

  public readonly IMG_URL = environment.apiImg;

  networkUrl: string = 'https://rpc.bordel.wtf/test'; // Red de pruebas;
  contractAddress: string;

  eurosToSend: number;  // precio total
  addressToSend: string = "0x8964FD1CAB4B9323F55cAC1a56648F8253CD0577";  // cuenta donde se ingresaran los pagos

  contractInfo: Erc20Contract;

  constructor(
    private blockchainService: BlockchainService,
    private service: CheckoutService,
    private route: ActivatedRoute,
  ) { }

  ngOnInit(): void {
    this.routeQueryMap$ = this.route.queryParamMap.subscribe(queryMap => this.init(queryMap));
    // throw new Error('Method not implemented.');
  }

  ngOnDestroy(): void {
    // throw new Error('Method not implemented.');
    this.routeQueryMap$.unsubscribe();
    clearInterval(this.refreshInterval); // Detener el refresco de la orden
    this.cancelCheckoutDialog(); // destruyo la sesion
  }

  async init(queryMap: ParamMap) {

    //  si el usuario acaba de iniciar sesión desde el redireccionamiento
    const justLoggedIn = sessionStorage.getItem('authRedirection') === 'true';
    sessionStorage.removeItem('authRedirection');

    this.temporalOrderId = parseInt(queryMap.get('session_id'));
    this.paymentMethod = queryMap.get('payment_method');

    console.log('ID:', this.temporalOrderId);
    console.log('Método de pago:', this.paymentMethod);
    console.log('Acaba de iniciar sesión:', justLoggedIn);

    if (!this.temporalOrderId) {
      console.error('No se proporcionó un ID de orden temporal, no se puede continuar.');
    } else {

      if (justLoggedIn) {
        console.log('El usuario acaba de iniciar sesión. Vinculando la orden temporal...');
        const linkResponse = await this.service.linkUserToOrder(this.temporalOrderId);

        if (!linkResponse.success) {
          console.error('Error al vincular la orden temporal:', linkResponse.error);
        }
      }

      console.log('Recuperando los detalles de la orden temporal...');
      const orderResponse = await this.service.getOrderDetails(this.temporalOrderId);

      if (orderResponse.success) {
        this.orderDetails = orderResponse.data;
        this.eurosToSend = this.orderDetails.totalPrice/100;  // recordar que esta en centimos
        console.log('Detalles de la orden cargados:', this.orderDetails);
        console.log('Productos:', this.orderDetails.temporalProductOrder);
        this.startOrderRefresh(); //  refresco de la orden

        //  pago
        if (this.paymentMethod === 'blockchain') {
          // await this.embeddedCheckout();
        } else {
          console.log('Método de pago:', this.paymentMethod);
        }

      } else {
        console.error('Error al cargar los detalles de la orden:', orderResponse.error);
      }
    }
  }


  async getContractInfo() {
    const result = await this.blockchainService.getContractInfo(this.networkUrl, this.contractAddress);

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
    const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
    const account = accounts[0];

    // Pedimos permiso al usuario para usar su cuenta de metamask
    await window.ethereum.request({
      method: 'wallet_requestPermissions',
      params: [{
        "eth_accounts": { account }
      }]
    });

    // Obtenemos los datos que necesitamos para la transacción: 
    // gas, precio del gas y el valor en Ethereum
    const transactionRequest: CreateEthTransactionRequest = {
      networkUrl: this.networkUrl,
      euros: this.eurosToSend
    };
    const ethereumInfoResult = await this.blockchainService.getEthereumInfo(transactionRequest);
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

    const checkTransactionResult = await this.blockchainService.checkTransaction(checkTransactionRequest);

    // Notificamos al usuario si la transacción ha sido exitosa o si ha fallado.
    // CREAMOS PEDIDO, PASAMOS A PAGINA DE CONFIRMACION Y MOSTRAMOS DATOS
    if (checkTransactionResult.success && checkTransactionResult.data) {
      alert('Transacción realizada con éxito');
      
      // creo pedido 
      this.service.newOrder(this.orderDetails).subscribe({
        next: (order: Order) => {
          this.createdOrder = order; // Guarda la respuesta en la variable
          console.log('Pedido creado:', this.createdOrder);
        },
        error: (err) => {
          console.error('Error al crear el pedido:', err);
        },
      });

    } else {
      alert('Transacción fallida');
    }
  }

  // Refrescar la orden orden temporal
  startOrderRefresh() {
    console.log('Iniciando el refresco de la orden temporal...');
    this.refreshInterval = setInterval(async () => {
      const refreshResponse = await this.service.refreshOrder(this.temporalOrderId);
      if (refreshResponse.success) {
        console.log('Orden temporal refrescada correctamente.');
      } else {
        console.error('Error al refrescar la orden temporal:', refreshResponse.error);
      }
    }, 60000); // Se refresca cada minuto
  }

  cancelCheckoutDialog() {
    this.stripeEmbedCheckout.destroy();
    this.checkoutDialogRef.nativeElement.close();
  }


}

declare global {
  interface Window {
    ethereum: any;
  }
}


