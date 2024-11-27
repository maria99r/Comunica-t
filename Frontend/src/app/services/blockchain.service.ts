import { Injectable } from '@angular/core';
import { ApiService } from './api.service';

import { Result } from '../models/result';
import { CheckTransactionRequest } from '../models/checkEthTransactionRequest';
import { CreateEthTransactionRequest } from '../models/createEthTransactionRequest';
import { Erc20Contract } from '../models/erc20Contract';
import { EthereumInfo } from '../models/ethereumInfo';


@Injectable({
  providedIn: 'root'
})
export class BlockchainService {

  constructor(private api: ApiService) { }

  getContractInfo(nodeUrl: string, contractAddress: string): Promise<Result<Erc20Contract>> {
    return this.api.get<Erc20Contract>(`blockchain`, { nodeUrl: nodeUrl, contractAddress: contractAddress })
  }

  getEthereumInfo(data: CreateEthTransactionRequest): Promise<Result<EthereumInfo>> {
    return this.api.post<EthereumInfo>(`blockchain/transaction`, data)
  }

  checkTransaction(data: CheckTransactionRequest): Promise<Result<boolean>> {
    return this.api.post<boolean>(`blockchain/check`, data)
  }
}
