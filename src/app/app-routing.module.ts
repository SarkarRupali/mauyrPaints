import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'welcome',
    pathMatch: 'full'
  },
  {
    path: 'login',
    loadChildren: () => import('./login/login.module').then(m => m.LoginPageModule)
  },
  {
    path: 'signup',
    loadChildren: () => import('./signup/signup.module').then(m => m.SignupPageModule)
  },
  {
    path: 'home',
    loadChildren: () => import('./home/home.module').then(m => m.HomePageModule)
  },
  {
    path: 'product/:categoryId',
    loadChildren: () => import('./product/product.module').then(m => m.ProductPageModule)
  },
  {
    path: 'productdetails/:productId',
    loadChildren: () => import('./productdetails/productdetails.module').then(m => m.ProductdetailsPageModule)
  },
  {
    path: 'enquire/:productId',
    loadChildren: () => import('./enquire/enquire.module').then(m => m.EnquirePageModule)
  },

  {
    path: 'history',
    loadChildren: () => import('./history/history.module').then(m => m.HistoryPageModule)
  },
  {
    path: 'reward',
    loadChildren: () => import('./reward/reward.module').then(m => m.RewardPageModule)
  },
  {
    path: 'about',
    loadChildren: () => import('./about/about.module').then(m => m.AboutPageModule)
  },

  {
    path: 'profile',
    loadChildren: () => import('./profile/profile.module').then(m => m.ProfilePageModule)
  },
  {
    path: 'forget',
    loadChildren: () => import('./forget/forget.module').then(m => m.ForgetPageModule)
  },
  {
    path: 'welcome',
    loadChildren: () => import('./welcome/welcome.module').then(m => m.WelcomePageModule)
  },
  {
    path: 'complain',
    loadChildren: () => import('./complain/complain.module').then(m => m.ComplainPageModule)
  },

  {
    path: 'gift',
    loadChildren: () => import('./gift/gift.module').then(m => m.GiftPageModule)
  },
  {
    path: 'giftdetails/:giftId',
    loadChildren: () => import('./giftdetails/giftdetails.module').then(m => m.GiftdetailsPageModule)
  },

  {
    path: 'chat',
    loadChildren: () => import('./chat/chat.module').then(m => m.ChatPageModule)
  },

  {
    path: 'partner-form',
    loadChildren: () => import('./partner-form/partner-form.module').then(m => m.PartnerFormPageModule)
  },
  {
    path: 'profile-edit',
    loadChildren: () => import('./profile-edit/profile-edit.module').then(m => m.ProfileEditPageModule)
  },
  {
    path: 'notification',
    loadChildren: () => import('./notification/notification.module').then(m => m.NotificationPageModule)
  },
  {
    path: 'billing-address',
    loadChildren: () => import('./address/billing-address/billing-address.module').then(m => m.BillingAddressPageModule)
  },
  {
    path: 'billing-address-edit',
    loadChildren: () => import('./address/billing-address-edit/billing-address-edit.module').then(m => m.BillingAddressEditPageModule)
  },
  {
    path: 'cash-form',
    loadChildren: () => import('./cash-form/cash-form.module').then(m => m.CashFormPageModule)
  },
  {
    path: 'order-form',
    loadChildren: () => import('./order/order-form/order-form.module').then( m => m.OrderFormPageModule)
  },
  {
    path: 'orderlist',
    loadChildren: () => import('./order/orderlist/orderlist.module').then( m => m.OrderlistPageModule)
  },
  {
    path: 'history-details',
    loadChildren: () => import('./history-details/history-details.module').then( m => m.HistoryDetailsPageModule)
  }
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
