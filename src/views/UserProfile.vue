<template>
    <div class="user-profile">
        <div class="user-profile__user-panel">
            <h1 class="user-profile__username">@{{ state.user.username }}</h1>
            <h2 class="user-profile__username">{{ userId }}</h2>
            <div class='user-profile__admin-badge' v-if="state.user.isAdmin">
                Admin
            </div>
            <div class="user-profile__follower-count"> 
                <strong>Followers:</strong> {{ state.followers }}
            </div>
            <form class="user-profile__create-twoot" @submit.prevent="createNewTwoot" :class="{'--exceeded': newTwootCharacterCount > 180 }">
                <label for="newTwoot"><strong>New Twoot ({{newTwootCharacterCount}}/180)</strong></label>
                <textarea id="newTwoot" rows="4" v-model="state.newTwootContent"></textarea>
                <div class="user-profile__create-twoot-type">
                    <label for="newTwootType"><strong>Twoot Type:</strong></label>
                    <select id="newTwootType" v-model="state.selectedTwootType">
                        <option :value="tt.value" v-for="(tt,index) in state.twootTypes" :key="index">{{ tt.name }}</option>
                    </select>       
                </div>
                <button :disabled="newTwootCharacterCount>180">Twoot!</button>
            </form>
        </div>
        <div class='user-profile__twoots-wrapper'>
            <div class="user-profile__twoot">
                <TwootItem v-for="twoot in state.user.twoots" 
                    :key="twoot.id" 
                    :username="state.user.username" 
                    :twoot="twoot" 
                    @favorite="toggleFavorite"/>
            </div>
        </div>
    </div>
</template>

<script>
import TwootItem from '../components/TwootItem.vue';
import {reactive, computed } from 'vue';
import { useRoute } from 'vue-router';
import { users } from '../assets/users';

export default {
  name: 'UserProfile',
  components: { TwootItem },
  setup(props,ctx) {
      const route = useRoute();
      const userId = computed(() => route.params.userId);

      const state = reactive({
      newTwootContent: '',
      selectedTwootType: 'instant',
      twootTypes: [
          {value:'draft', name: 'Draft' },
          {value:'instant', name: 'Instant' }
      ],  
      followers : 0,
      user: users[userId.value - 1] || users[0]
      });

      const newTwootCharacterCount = computed(() => state.newTwootContent.length);

      function createNewTwoot() {
          if (state.newTwootContent && state.selectedTwootType !== 'draft') {
              ctx.emit('add-twoot', state.newTwootContent);
              state.user.twoots.unshift({id:state.user.twoots.length+1, content:state.newTwootContent});
              state.newTwootContent = '';
          }
      }

      return {
          state,
          newTwootCharacterCount,
          createNewTwoot,
          userId
      }
  },
  watch: {
    followers(newFollowerCount, oldFollowerCount) {
        if (newFollowerCount > oldFollowerCount) {
          console.log(`${this.user.username} gained a follower!`)
        }
    }
  },
  computed : {
    fullName() {
      return `${this.user.firstName} ${this.user.lastName}`
    }
  },
  methods : {
    followUser() {
      this.followers++
    },
    toggleFavorite(id) {
        console.log(`Favorited: #${id}`)
    }
  },
  mounted() {
    this.followUser();
  }
}
</script>

<style lang="scss">

.user-profile {
       float: left;
}

.user-profile__user-panel {
    font-family:'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
    margin-top: 20px;
    padding: 20px 0;
    display: flex;
    flex-direction: column;
    border: 1px solid black;
    border-radius: 5px;
}

.user-profile__admin-badge {
    background: red;
    color: white;
    border-radius: 5px;
    padding: 10 px;
    margin-right: auto;
}

.user-profile__twoots-wrapper {
    float: right;
}

.user-profile__create-twoot {
    margin-top: 10px;
    border: 1px solid gray;
    display: flex;
    flex-direction: column;
}

.user-profile__create-twoot.--exceeded {
    color: red;
}

</style>
