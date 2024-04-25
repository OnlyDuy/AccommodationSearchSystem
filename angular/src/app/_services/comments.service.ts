import { Injectable } from '@angular/core';
import { HubConnection, HubConnectionBuilder } from '@microsoft/signalr';
import { environment } from 'environments/environment';
import { Subject, BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CommentsService {

  public hubConnection: HubConnection;
  commentReceived = new Subject<any>();
  allCommentsReceived = new Subject<any>();
  updateComment = new Subject<any>();
  deleteComment = new Subject<any>();
  getTotalComments = new BehaviorSubject<number>(0);

  baseUrl = environment.apiUrl;

  constructor() {
    this.startConnection();
  }

  public startConnection = () => {
    this.hubConnection = new HubConnectionBuilder()
      .withUrl(`${this.baseUrl}commentHub`)
      .withAutomaticReconnect()
      .build();

    this.hubConnection
      .start()
      .then(() => {
        console.log('SignalR connection started');
        this.registerCommentEvents();
      })
      .catch(err => console.log('Error while starting connection: ' + err));
  }

  public registerCommentEvents = () => {
    this.hubConnection.on('ReceiveComment', (data) => {
      this.commentReceived.next(data);
    });

    this.hubConnection.on('UpdateComment', (data) => {
      this.updateComment.next(data);
    });

    this.hubConnection.on('DeleteComment', (data) => {
      this.deleteComment.next(data);
    });

    this.hubConnection.on('ReceiveAllComments', (data) => {
      this.allCommentsReceived.next(data);
    });

    this.hubConnection.on('GetTotalComments', (data: number) => {
      this.getTotalComments.next(data);;
    });
  }
}
