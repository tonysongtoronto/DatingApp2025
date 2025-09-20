import { HttpClient } from '@angular/common/http';
import { Component, inject, OnInit, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { lastValueFrom } from 'rxjs';
import { environment } from '../environments/environment';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App implements OnInit {

 private http = inject(HttpClient);
  protected title = 'Dating app';
  protected members = signal<any>([])

   async ngOnInit() {
    this.members.set(await this.getMembers())
  }

  async getMembers() {
    try {
       return lastValueFrom(this.http.get(environment.apiUrl+'/members'));
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

}
