import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { CreateEthTransactionRequest } from '../../models/createEthTransactionRequest';
import { Erc20Contract } from '../../models/erc20Contract';
import { BlockchainService } from '../../services/blockchain.service';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { TemporalOrder } from '../../models/temporal-order';
import { Subscription } from 'rxjs';
import { environment } from '../../../environments/environment';
import { CheckoutService } from '../../services/checkout.service';
import { Order } from '../../models/order';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';

@Component({
  selector: 'app-blockchain',
  standalone: true,
  imports: [FormsModule, ToastModule],
  templateUrl: './blockchain.component.html',
  styleUrl: './blockchain.component.css'
})
export class BlockchainComponent implements OnInit, OnDestroy {

  @ViewChild('blockchainDialog')
  checkoutDialogRef: ElementRef<HTMLDialogElement>;

  orderDetails: TemporalOrder = null; // Orden temporal
  temporalOrderId: number = null; // ID de la Orden temporal
  paymentMethod: string = ''; // Método de pago escogido
  routeQueryMap$: Subscription;
  refreshInterval: any; // Intervalo para refrescar la orden
  isLoading: boolean = true;

  createdOrder: Order; // el pedido cuando se cree

  public readonly IMG_URL = environment.apiImg;

  networkUrl: string = 'https://rpc.bordel.wtf/test'; // Red de pruebas;
  contractAddress: string;

  priceInEth: number; // precio total en Ethereum
  eurosToSend: number;  // precio total
  addressToSend: string = "0x8964FD1CAB4B9323F55cAC1a56648F8253CD0577";  // cuenta donde se ingresaran los pagos

  contractInfo: Erc20Contract;

  constructor(
    private blockchainService: BlockchainService,
    private service: CheckoutService,
    private route: ActivatedRoute,
    public router: Router,
    private messageService: MessageService
  ) { }

  ngOnInit(): void {
    this.routeQueryMap$ = this.route.queryParamMap.subscribe(queryMap => this.init(queryMap));
  }

  ngOnDestroy(): void { // Verifica que la suscripción y el refresco existen antes de destruirlos
    if (this.routeQueryMap$) {
      this.routeQueryMap$.unsubscribe();
      console.log("Suscripción eliminada");
    }

    if (this.refreshInterval) {
      clearInterval(this.refreshInterval);
      console.log("Intervalo eliminado");
    }
  }

  async init(queryMap: ParamMap) {
    console.log("Iniciando la página de checkout (blockchain)...");

    // si el usuario acaba de iniciar sesión desde el redireccionamiento
    const justLoggedIn = sessionStorage.getItem("authRedirection") === 'true';
    sessionStorage.removeItem("authRedirection");

    this.temporalOrderId = parseInt(queryMap.get("temporalOrderId"));

    if (isNaN(this.temporalOrderId)) { // Comprueba que la ID no está vacía
      console.error("El ID de la Orden temporal no es válido: ", this.temporalOrderId);
      this.throwError("blockchainError", "Se ha producido un error procesando tu pedido.");
    }

    this.paymentMethod = queryMap.get("paymentMethod");

    console.log("ID de la Orden temporal:", this.temporalOrderId);
    console.log("Método de pago:", this.paymentMethod);
    console.log("Acaba de iniciar sesión:", justLoggedIn);

    if (justLoggedIn) {
      console.log("El usuario acaba de iniciar sesión. Vinculando la orden temporal...");
      const linkResponse = await this.service.linkUserToOrder(this.temporalOrderId);

      if (linkResponse.success) {
        console.log("La orden temporal se vinculó exitosamente:", linkResponse.data);
      } else {
        console.error("Error al vincular la orden temporal:", linkResponse.error);
        this.throwError("blockchainError", "Se ha producido un error procesando tu pedido.");
      }
    }

    console.log("Recuperando los detalles de la orden temporal...");
    const orderResponse = await this.service.getOrderDetails(this.temporalOrderId);

    if (orderResponse.success) {
      this.orderDetails = orderResponse.data;
      this.eurosToSend = this.orderDetails.totalPrice / 100;  // recordar que esta en centimos
      this.priceInEth = this.eurosToSend * 0.00029;
      console.log("Detalles de la orden cargados:", this.orderDetails);
      console.log("Productos:", this.orderDetails.temporalProductOrder);
      this.startOrderRefresh(); // refresco de la orden

      if (!(this.paymentMethod === "blockchain")) {
        console.error("El método de pago no es en blockchain");
        this.throwError("blockchainError", "Se ha producido un error procesando tu pedido.");
      }

      this.isLoading = false;

    } else {
      console.error("Error al cargar los detalles de la orden:", orderResponse.error);
      this.throwError("blockchainError", "Se ha producido un error procesando tu pedido.");
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
      this.throwError("blockchainError", "No está instalado Metamask.");
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
      
      this.throwDialog("blockchain", "Transacción realizada con éxito. ¡Gracias por tu compra!")

      // creo pedido 
      this.service.newOrder(this.temporalOrderId).subscribe({
        next: (order: Order) => {
          this.createdOrder = order;
          console.log('Pedido creado:', this.createdOrder);

          setTimeout(() => {
            this.orderOnComplete();
          }, 500); // Espera 500 milisegundos por si acaso
        },
        error: (err) => {
          console.error('Error al crear el pedido:', err);
          this.throwError("blockchainError", "Se ha producido un error procesando tu pedido.");
        },
      });

    } else {
      this.throwError("blockchainError", "Transacción fallida.");
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
        this.throwError("blockchainError", "Se ha producido un error procesando tu pedido.");
      }}, 60000); // Se refresca cada minuto
  }

  cancelCheckoutDialog() {
    if (this.checkoutDialogRef?.nativeElement) {
      this.checkoutDialogRef.nativeElement.close();
    }
  }

  orderOnComplete() {
    console.log("Orden completada");

    this.cancelCheckoutDialog(); // Desmontar/destruir el checkout embebido
    // this.router.navigate(['/order-success']);  
    this.router.navigate(['/order-success/', this.createdOrder.id]);
  }
  

  // Cuadro de notificación de éxito
  throwDialog(key: string, texto: string) {
    this.messageService.add({ key: key, severity: 'success', summary: 'Éxito', detail: texto })
  }

  // Cuadro de notificación de error
  throwError(key: string, error: string) {
    this.messageService.add({ key: key, severity: 'error', summary: 'Error', detail: error })
  }
}

declare global {
  interface Window {
    ethereum: any;
  }
}