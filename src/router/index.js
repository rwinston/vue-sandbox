import { createRouter,createWebHistory } from 'vue-router';
import store from '../store/index';
import Home from '../views/Home.vue';
import UserProfile from '../views/UserProfile.vue';
import Admin from '../views/Admin.vue';
import {users} from '../assets/users';

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/user/:userId',
    name: 'UserProfile',
    component: UserProfile
  },
  {
    path: '/admin',
    name: 'Admin',
    component: Admin,
    meta: { 
      requiresAdmin: true
    }
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes
});


router.beforeEach(async (to, from, next) => {
  console.log('Store state:' + JSON.stringify(store.state));
  console.log('Store user state:' + store.state.User.user);
  const user = store.state.User.user;
  console.log("Users:" + JSON.stringify(users));

  if (!user) {
    await store.dispatch('User/setUser', users[0]);
  }
  const isAdmin = user.isAdmin;
  const requiresAdmin = to.matched.some(record => record.meta.requiresAdmin);
  if (requiresAdmin && !isAdmin) {
    next({name: 'Home'});
  } else {
    next();
  }
});

export default router
