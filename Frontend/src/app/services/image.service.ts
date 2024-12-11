import { Injectable } from '@angular/core';
import { ApiService } from './api.service';
import { Result } from '../models/result';
import { Image } from '../models/image';
import { ImageRequest } from '../models/image-request';


@Injectable({
  providedIn: 'root'
})
export class ImageService {

  constructor(private api: ApiService) { }

  addImage(imageRequest: ImageRequest): Promise<Result<Image>> {
    const formData = new FormData();
    formData.append('name', imageRequest.name);
    formData.append('file', imageRequest.file);

    return this.api.post<Image>('Images', formData);
  }

  updateImage(id: number, imageRequest: ImageRequest): Promise<Result> {
    const formData = new FormData();
    formData.append('name', imageRequest.name);
    formData.append('file', imageRequest.file);
    return this.api.put(`images/${id}`, formData);
  }

}
