import { MatDialog } from '@angular/material/dialog';
import { Component, inject, Signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { Apollo } from 'apollo-angular';
import { DELETE_NOTIFICATION, GET_ALL_NOTIFICATION } from '../../core/graphql/notification.graphql';
import { NotificationModalComponent } from './notification-modal/notification-modal.component';

import { MatButtonModule } from '@angular/material/button';
import { MatListModule } from '@angular/material/list';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';

import { map } from 'rxjs';
import { Notification, GetAllNotificationResponse } from '../../shared/models/user.model';
import { ToastService } from '../../core/services/toast.service';

@Component({
  selector: 'app-notifications',
  standalone: true,
  imports: [
    MatListModule,
    MatButtonModule,
    CommonModule,
    MatIconModule,
    MatCardModule
  ],
  templateUrl: './notifications.component.html',
  styleUrls: ['./notifications.component.scss']
})
export class NotificationsComponent {
  limit = 10;
  skip = 0;
  totalNotificationsCount = 0;
  private toastService = inject(ToastService);
  private apollo = inject(Apollo);
  private dialog = inject(MatDialog);

  notificationsQuery = this.apollo.watchQuery<GetAllNotificationResponse>({
    query: GET_ALL_NOTIFICATION,
    variables: { limit: this.limit, skip: this.skip }
  });

  notifications: Signal<{ getAllNotifications: Notification[]; totalCount: number }> = toSignal(
    this.notificationsQuery.valueChanges.pipe(
      map(res => {
        const data = res.data?.getAllNotifications ?? { getAllNotifications: [], totalCount: 0 };

        const notificationsArray: Notification[] = (data.getAllNotifications ?? [])
          .filter((n): n is Notification => !!n && 'id' in n && 'name' in n && 'description' in n);

        this.totalNotificationsCount = data.totalCount ?? notificationsArray.length;
        return { getAllNotifications: notificationsArray, totalCount: this.totalNotificationsCount };
      })
    ),
    { initialValue: { getAllNotifications: [], totalCount: 0 } }
  );


  refresh() {
    this.notificationsQuery.refetch({
      limit: this.limit,
      skip: this.skip
    });
  }


  openCreateDialog() {
    const dialogRef = this.dialog.open(NotificationModalComponent, {
      width: '450px',
      disableClose: true
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) this.refresh();
    });
  }

  openEditDialog(notification: Notification) {
    if (!notification) return;

    const ref = this.dialog.open(NotificationModalComponent, {
      width: '450px',
      data: notification
    });

    ref.afterClosed().subscribe(res => {
      if (res) this.refresh();
    });
  }

  delete(id?: string) {
    if (!id) return;

    if (!confirm("Are you sure you want to delete this notification?")) return;

    this.apollo.mutate({
      mutation: DELETE_NOTIFICATION,
      variables: { id },
      update: (cache) => {
        cache.evict({
          id: cache.identify({ __typename: "Notification", id })
        })
        cache.gc()
      },
      errorPolicy: 'all'
    }).subscribe({
      next: () => this.refresh(),
      error: (err) => this.toastService.error(err)
    });
  }

  loadNextPage() {
    if (this.skip + this.limit < this.totalNotificationsCount) {
      this.skip += this.limit;
      this.refresh();
    }
  }

  loadPreviousPage() {
    if (this.skip > 0) {
      this.skip -= this.limit;
      if (this.skip < 0) this.skip = 0;
      this.refresh();
    }
  }


  totalPages() {
    return Math.ceil(this.totalNotificationsCount / this.limit);
  }

  totalNotifications() {
    return this.totalNotificationsCount;
  }
}