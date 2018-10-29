import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

@IonicPage()
@Component({
  selector: 'page-comments',
  templateUrl: 'comments.html',
})
export class CommentsPage {

  comments: any;
  comment: any;
  
  constructor(public navCtrl: NavController, public navParams: NavParams) {
    this.comments = this.navParams.get('comments');
    this.comment = this.navParams.get('comment');
    console.log("Comments ->",this.comments);
    console.log("Comment detail ->",this.comment);
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad CommentsPage');
  }
  // 
  openCommentDetail(comment){
    console.log("Comment to open",comment);
    this.navCtrl.push("CommentsPage",{comment:comment})
  }
}
