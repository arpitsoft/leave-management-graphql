import { Injectable, inject } from '@angular/core';
import { Apollo } from 'apollo-angular';
import { GET_ALL_NOTIFICATION, CREATE_NOTIFICATION, UPDATE_NOTIFICATION, DELETE_NOTIFICATION } from '../../core/graphql/notification.graphql';
import { Observable, map } from 'rxjs';
import { Notification, GetAllNotificationResponse } from '../../shared/models/user.model';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  private apollo = inject(Apollo);

   getNotifications(limit = 10, skip = 0): Observable<{ notifications: Notification[]; totalCount: number }> {
    return this.apollo.watchQuery<GetAllNotificationResponse>({
      query: GET_ALL_NOTIFICATION,
      variables: { limit, skip }
    }).valueChanges.pipe(
      map(res => {
        const data = res.data?.getAllNotifications ?? { getAllNotifications: [], totalCount: 0 };
        const notifications: Notification[] = (data.getAllNotifications ?? []).filter((n): n is Notification => !!n && 'id' in n && 'name' in n && 'description' in n);
        return { notifications, totalCount: data.totalCount ?? notifications.length };
      })
    );
  }

  createNotification(input: { name: string; description: string }): Observable<Notification> {
    return this.apollo.mutate({
      mutation: CREATE_NOTIFICATION,
      variables: { input },
      update: (cache, { data }) => {

      },
      errorPolicy: 'all'
    }).pipe(map((res:any) => res.data?.createNotificationMut as Notification));
  }

  updateNotification(input: { id: string; name: string; description: string }): Observable<Notification> {
    return this.apollo.mutate({
      mutation: UPDATE_NOTIFICATION,
      variables: { input },
      update: (cache, { data }) => {
      },
      errorPolicy: 'all'
    }).pipe(map((res:any) => res.data?.updateNotificationMut as Notification));
  }


  deleteNotification(id: string): Observable<string> {
    return this.apollo.mutate({
      mutation: DELETE_NOTIFICATION,
      variables: { id },
      update: (cache) => {
        cache.evict({ id: cache.identify({ __typename: "Notification", id }) });
        cache.gc();
      },
      errorPolicy: 'all'
    }).pipe(map((res:any) => res.data?.deleteNotificationMut as string));
  }
}
