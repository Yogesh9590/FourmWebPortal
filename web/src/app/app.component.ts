import { Component } from '@angular/core';

declare var $: any;

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'web';
  isLinear = false;

  addDiscussion(){
    $('#addDissModalCenter').modal('show'); 
  }
  editDiscussion(){
    $('#addDissModalCenter').modal('show');
  }

  addComment(){
    $('#addCommentModalCenter').modal('show');
  }

  signUp(){
    $('#signUpModalCenter').modal('show');
  }

  signIn(){
    $('#signInModalCenter').modal('show');
  }
  
}
