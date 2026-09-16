<template>
  <div class="game-manager-container">
    <div class="game-manager-card">
      <h1 class="title">🎲 请选择游戏</h1>
      <div class="select-wrapper">
        <select
          v-model="selected"
          class="game-select"
          size="8"
        >
          <option v-for="game in games" :key="game._id" :value="game._id">
            {{ game.name }}（{{ formatDate(game.updatedAt) }}）
          </option>
        </select>
      </div>
      <div class="actions">
        <Button type="primary" size="large" long :loading="loading" @click="startGame">开始游戏</Button>
      </div>
    </div>
  </div>
</template>

<script>
import { getValidGames, startExistGame } from '../../api/gameManageApi';
import { formatDate } from '../../util/dateUtils';

export default {
  name: 'GameSelector',
  data() {
    return {
      games: [],
      selected: [],
      loading: false,
    };
  },
  async mounted() {
    this.games = await getValidGames();
  },
  methods: {
    formatDate,
    async startGame() {
      if (!this.selected || this.selected.length === 0) {
        this.$Message.warning('请先选择一个游戏');
        return;
      }
      this.loading = true;
      try {
        const result = await startExistGame({ gameId: this.selected[0] });
        if (result.success) {
          this.$Message.success('正在进入游戏...');
          this.$router.push('/game');
        }
      } finally {
        this.loading = false;
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.game-manager-container {
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.game-manager-card {
  width: 480px;
  padding: 40px;
  background: #fff;
  border-radius: 12px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.15);
}

.title {
  text-align: center;
  margin-bottom: 32px;
  color: #333;
  font-size: 24px;
}

.select-wrapper {
  margin-bottom: 24px;
}

.game-select {
  width: 100%;
  min-height: 280px;
  padding: 10px 12px;
  font-size: 14px;
  line-height: 1.6;
  color: #333;
  background: #fff;
  border: 1px solid #dcdee2;
  border-radius: 4px;
  outline: none;
  cursor: pointer;
  transition: border-color 0.2s, box-shadow 0.2s;
  box-sizing: border-box;

  &:hover {
    border-color: #667eea;
  }

  &:focus {
    border-color: #667eea;
    box-shadow: 0 0 0 2px rgba(102, 126, 234, 0.2);
  }

  option {
    padding: 8px 10px;
    font-size: 14px;
    color: #333;

    &:hover {
      background: #f5f7ff;
    }

    &:checked {
      background: #667eea;
      color: #fff;
    }
  }
}

.actions {
  margin-top: 8px;
}
</style>
