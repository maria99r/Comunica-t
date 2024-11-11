import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Product } from '../../models/product';
import { Review } from '../../models/review';
import { ApiService } from '../../services/api.service';
import { ActivatedRoute } from '@angular/router';
import { environment } from '../../../environments/environment';
import { NavComponent } from "../../components/nav/nav.component";
import { FooterComponent } from "../../components/footer/footer.component";
import { InputNumberModule } from 'primeng/inputnumber';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { AuthService } from '../../services/auth.service';
import { User } from '../../models/user';


@Component({
  selector: 'app-product-detail',
  standalone: true,
  imports: [NavComponent, FooterComponent, InputNumberModule, FormsModule, ButtonModule, CommonModule],
  templateUrl: './product-detail.component.html',
  styleUrl: './product-detail.component.css'
})
export class ProductDetailComponent implements OnInit {

  product: Product | null = null;

  reviews: Review[];

  textReview : String;

  public readonly IMG_URL = environment.apiImg;

  users: User[];

  quantity = 1;

  constructor(
    public authService: AuthService,
    private api: ApiService,
    private activatedRoute: ActivatedRoute) { }

  async ngOnInit(): Promise<void> {
    const id = this.activatedRoute.snapshot.paramMap.get('id') as unknown as number;
    this.product = await this.api.getProduct(id);
    this.reviews = await this.api.loadReviews(id);

    // obtiene info de los usuarios que han comentado
    for(const review of this.reviews){
      this.users.push(await this.api.getUser(review.userId));
    }
    console.log(this.users);
    
  }


  // crear reseña 
  async publicReview(){
    try {
      const result = await this.api.publicReview(this.textReview);

    } catch (error) {
      console.error('Error al publicar la reseña: ', error);
    }
  }

}
