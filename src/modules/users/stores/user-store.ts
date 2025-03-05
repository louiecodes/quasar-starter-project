import { defineStore } from 'pinia';
import { api } from 'src/boot/axios';
import { User } from 'src/models/user';
import { CreateUser } from '../models/create-user.model';
import { notifyError, notifySuccess } from 'src/utils/notify';

export const useUserStore = defineStore('user', {
  state: () => ({
    loading: false as boolean,
    users: [] as User[],
    totalUsers: 0 as number,
  }),

  getters: {},

  actions: {
    async getUsers(
      page = 1,
      limit = 10,
      orderBy = 'firstName',
      order: 'asc' | 'desc' = 'asc',
      search = ''
    ) {
      this.loading = true;
      try {
        const response = await api.get('/users', {
          params: { page, limit, orderBy, order, search },
        });

        this.users = response.data.data;
        this.totalUsers = response.data.meta.total; // Guardamos el total de usuarios
      } catch (error) {
        console.error('Error fetching users:', error);
      } finally {
        this.loading = false;
      }
    },
    async createUser(user: CreateUser) {
      this.loading = true;
      try {
        const { data } = await api.post('/users', user);
        notifySuccess('User created succesfully');
        return data;
      } catch (error) {
        console.error('Error creating user:', error);
        notifyError('Error creating user');
        throw error;
      } finally {
        this.loading = false;
      }
    },
  },
});
