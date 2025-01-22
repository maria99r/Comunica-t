import { Component } from "@angular/core";

@Component({
  selector: 'app-chat',
  standalone: true,
  imports: [],
  templateUrl: './chat.component.html',
  styleUrl: './chat.component.css'
})
export class ChatComponent {


  // lista 
  infoMensajes: String[][] = [
    ["Hola, soy Alan, tu asistente virtual.", "Alan"],
    ["¿En qué puedo ayudarte?", "Alan"],
    ["ayudame porfi que compro", "User"]
  ]

  chatVisible: boolean = true;

  envia(mensaje: String) {

  }


}


